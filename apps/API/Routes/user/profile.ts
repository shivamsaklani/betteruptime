import type { Request, Response } from "express";
import { Authorize } from "./middleware";
import { Prisma } from "@repo/db/client";
import fileUpload from "express-fileupload";
import bcrypt from "bcrypt";
import { password } from "./zodschema";
const express = require("express");
const profile = express.Router();
profile.use(fileUpload({
  useTempFiles : true,
  tempFileDir :  `${process.env.ImageDirectory}`,// 413 for big files error
   limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
}));
// add logic to user profile and settings data



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
    const user = await Prisma.user.findUnique({ where: { id: userid } });
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
    await Prisma.user.update({
      where: { id: userid },
      data: { password: hashedPassword },
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


profile.post("/imageupload",Authorize,async (req:Request, res:Response)=>{

const file = req.files?.profile  as fileUpload.UploadedFile;;
const userid = req.userid?.id;
const imageloc =`${process.env.ImageDirectory}`+`${file.name}`;

if (!file) {
  return res.status(400).send("No Image Selected");
}

try {
  await file.mv(imageloc);
  await Prisma.user.update({
        where: {
            id: userid
        },
        data: {
            profileImage:`/profiles/${file.name}`
        }
    });
    return res.status(200).json({
      mesg: "Image Uploaded Successfully",
      fileLoc:`/profiles/${file.name}`
    });
} catch (error) {
    console.error(error);
  return res.status(500).json({ success: false, message: "Server error" });
}

    
});

profile.get("/getdetails",Authorize,async (req:Request,res:Response)=>{
  const userid= req.userid?.id;
  try {
    const response= await Prisma.user.findFirst({
      where:{
        id:userid
      },
      select:{
        email:true,
        name:true,
        profileImage:true,
      }
    });
    if(!response){
      res.status(404).send("No user found");
      return;
    }
    return res.status(200).json(response);
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
      const updatedUser = await Prisma.user.update({
        where:{
          id:userId
        },
        data:{
          name:name
        }
      });

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
    await Prisma.user.update({
      where:{
       id:userid 
      },
      data:{
        profileImage:null
      }
    });
   return res.status(200).send("Profile Deleted");
  } catch (error) {
     console.error("Error updating user name:", error);
      return res.status(500).send("Internal server error. Please try again later.");
    
  }
})
export default profile;
