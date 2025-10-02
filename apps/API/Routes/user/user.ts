import { Prisma } from "@repo/db/client";
import type { Request, Response } from "express"; 
import bcrypt from "bcrypt";
import { signin, userSchema } from "./zodschema";
import jwt from "jsonwebtoken";
import googleAuth from "./google/googleauth";
const express = require("express");
const user = express.Router();
const JWT_SECRET=process.env.JWT_TOKEN;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
user.use("/google",googleAuth);
user.get("/", (req:Request, res:Response) => {
  return res.send("Server is Running ");
});

 // create new user 
user.post("/signup", async (req:Request, res:Response) => {
  const salt = await bcrypt.genSalt(10);
  let trustedData;
 try {
    trustedData = await userSchema.safeParse(req.body);
  if(!trustedData.success){
    res.status(401).send("Please enter correct data");
    return;
  }
 } catch (error) {
   res.status(500).send("Validation Error"+error);
   return;
 }

 try {

  // if user exist in the database 
    const existingUser = await Prisma.user.findFirst({
      where: {
      email: trustedData.data.email  
      }
    });

    if (existingUser) {
      return res.status(409).send("User with this email already exists");
    }

// create new user
  let hashedpassword='';
    if(salt){
     hashedpassword=await bcrypt.hash(trustedData.data.password,salt);
    }
     const createuser = async ()=>{
  const {id} =await Prisma.user.create({
    data:{
      name:trustedData.data.username,
      password: hashedpassword,
      email:trustedData.data.email
    }
   });
    if(res.status(200)){
    res.status(200).json({id});
    return;
  }
  }
  createuser();
 
  } catch (error) {
    res.status(500).send("Sorry we are facing some issues"+error);
    return;
  }
  }
 );

 // SignIn
user.post("/signin",async (req:Request, res:Response) => {
  try {
    const trustedData = signin.safeParse(req.body);
    if(!trustedData.success){
      res.status(400).send("Invalid request data");
      return;
    }
    const userData= await Prisma.user.findFirst({
      where:{
        email:trustedData.data.email
      }
    });
    if(!userData){
      res.status(404).send("No user Found");
      return;
    }
    const hashedpassword= await bcrypt.compare(trustedData.data.password,userData?.password);
    if(!hashedpassword){
      res.status(401).send("Password mismatch");
      return;
    }
    const token= jwt.sign({
      username:userData?.email,
      id:userData?.id
    },JWT_SECRET as string,{
      expiresIn:"1h"
    });

      // ✅ Refresh token (long-lived, created only at signin)
    const refreshToken = jwt.sign(
      { username:userData?.email, id: userData.id },
      REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );
    req.session.sessionpayload= {token:token,refreshToken:refreshToken,id:userData.id,Username:userData.name};
   
    req.session.save((err) => {
  if (err) {
    console.error("Session save error:", err);
    return res.status(500).send("Could not save session");
  }
  // This ensures Set-Cookie header is sent
  res.status(200).json({
    message: "SignIn successful",
    id: userData.id,
    username: userData.name,
  });
  return;
});
    
  } catch (error) {
     res.status(500).send("Sorry we are facing some issues"+error);
     return;
  }    
  
});

// refresh token to create for new access token 
user.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as {refreshToken?: string};

    if (!refreshToken) {
      res.status(400).send("Refresh token required");
      return;
    }

    // ✅ Verify refresh token
    jwt.verify(refreshToken, REFRESH_SECRET as string, (err:jwt.VerifyErrors | null, decoded:any) => {
      if (err || !decoded) {
        res.status(403).send("Invalid or expired refresh token");
        return;
      }
      console.log(decoded); // Todo : type safe this 
      const token= jwt.sign({
      username:decoded.email,
      id:decoded.id
      },JWT_SECRET as string,{
      expiresIn:"1h"
      });

      // ⚡ Option 1: Return ONLY new access token (keep same refresh token)
      if (req.session.sessionpayload) {
        req.session.sessionpayload.token  = token
      }
      res.status(200).json("Refreshed");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error);
  }
});



export default user;