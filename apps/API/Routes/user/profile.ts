import type { Request, Response } from "express";
import { Authorize } from "./middleware";
import fileUpload from "express-fileupload";
import bcrypt from "bcrypt";
import { password } from "./zodschema";
import axios from "axios";
import {v2 as  cloudinary, type UploadApiResponse} from "cloudinary";
import fs from "fs";
const express = require("express");

const profile = express.Router();
profile.use( fileUpload({
    // useTempFiles: true,
    // tempFileDir: "/tmp/",         // recommended temp dir
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    createParentPath: true
  }));
// add logic to user profile and settings data

cloudinary.config({
 cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key :process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});


profile.post("/changepassword", Authorize, async (req: Request, res: Response) => {
  try {
    const userid = req.userid?.id as string;
    if (!userid) {
      return res.status(401).send("Unauthorized: No user found");
    }
    //  Validate request body
    const result = password.safeParse(req.body.user);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error,
      });
    }

    const { oldpassword, newpassword } = result.data;

    //  Fetch user and verify old password
    const userDB = await axios.get(`${process.env.DATABASE_SERVER}/user/${userid}`);
    const user = userDB.data;
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect Password");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    //  Update user password
    await axios.put(`${process.env.DATABASE_SERVER}/user/${userid}`,{
      password:hashedPassword
    });


    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while changing password",
    });
  }
});


// profile.post("/imageupload", Authorize, async (req: Request, res: Response) => {
//   const file = req.files?.profile as fileUpload.UploadedFile | undefined;
//   const userid = req.userid?.id;
//   if (!file) {
//     return res.status(400).json({ message: "No Image Selected" });
//   }
//   try {
//     // wrap cloudinary stream in a promise
//     const result = await new Promise<UploadApiResponse>((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "image",
//            folder: "profiles",
//         },
//         (error, result) => {
//           // console.log(result);
//           if (error) return reject(error);
//           if (!result) return reject(new Error("Upload failed"));
//           resolve(result);
//         }
//       );
//       console.log("running");
//       uploadStream.end(file.data);
//     });

//     console.log("result"+result);
    
//     // now Cloudinary upload is finished safely
//     // await axios.put(`${process.env.DATABASE_SERVER}/user/${userid}`, {
//     //   profileImage: result.secure_url,
//     // });

//     return res.status(200).send("Image Uploaded Successfully");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error,
//     });
//   }
// });
profile.post("/imageupload", Authorize, async (req: Request, res: Response) => {
  const file = req.files?.profile as fileUpload.UploadedFile;
  const userid = req.userid?.id as string;

  // Basic validation
  if (!file) return res.status(400).json({ message: "No image selected" });
  if (!userid) return res.status(401).json({ message: "Unauthorized" });
  if (!file.mimetype.startsWith("image/"))
    return res.status(400).json({ message: "Only images are allowed" });
  if (file.size > 10 * 1024 * 1024)
    return res.status(400).json({ message: "Image too large (max 10MB)" });

  try {
    const b64 = Buffer.from(file.data).toString("base64");
    const dataUri = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "profiles",
      public_id: userid,           // one unique image per user
      overwrite: true,             // replace old profile pic
      resource_type: "image",
      // format: "webp",              // modern & small (optional)
      // transformation: [
      //   { width: 600, height: 600, crop: "limit", quality: "auto", fetch_format: "auto" }
      // ],
    });

    // Save the URL to your database
    await axios.put(`${process.env.DATABASE_SERVER}/user/${userid}`, {
      profileImage: result.secure_url,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      url: result.secure_url,
    });

  } catch (error: any) {
    console.error("Image upload failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      details: error.message,
    });
  }
});

profile.get("/getdetails",Authorize,async (req:Request,res:Response)=>{
  const userid= req.userid?.id;
  try {
      const select = encodeURIComponent(
      JSON.stringify({
        email: true,
        name: true,
        profileImage: true,
      })
    );
    const response = await axios.get(`${process.env.DATABASE_SERVER}/user/${userid}?select=${select}`);
    if(!response){
      res.status(404).send("No user found");
      return;
    }
    return res.status(200).json(response.data);
  } catch (error:any) {
      console.error("Error updating user name:", error);
      return res.status(500).send("Internal server error. Please try again later.");
  }
})


profile.post("/changedetails",Authorize,async (req: Request, res: Response) => {
    try {
      const userId = req.userid?.id;
      const { name } = req.body;

      // Validate input
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).send( "Name is required and cannot be empty.");
      }

      if (name.trim().length > 50) {
        return res.status(400).send("Name must be less than 50 characters.");
      }

      // Find and update user
      const User = await axios.put(`${process.env.DATABASE_SERVER}/user/${userId}`,{
        name:name
      });
      const updatedUser = User.data;

      if (!updatedUser) {
        return res.status(404).send("No User Found");
      }

      return res.status(200).send("Updated");
    } catch (error: any) {
      console.error("Error updating user name:", error);
      return res.status(500).send("Internal server error. Please try again later.");
    }
  });



profile.post("/deleteprofile",Authorize,async (req:Request,res:Response)=>{
  const userid=req.userid?.id;
  try {
    await axios.delete(`${process.env.DATABASE_SERVER}/user/${userid}`);

     req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).send("Could not destroy session");
      }
      res.clearCookie("connect.sid");
      return res.status(200).send("Profile Deleted & Logged out");
    });

   return res.status(200).send("Profile Deleted");
  } catch (error) {
     console.error("Error updating user name:", error);
      return res.status(500).send("Internal server error. Please try again later.");
    
  }
});
export default profile;
