import type { Request, Response } from "express"; 
import bcrypt from "bcrypt";
import { signin, userSchema } from "./zodschema";
import jwt from "jsonwebtoken";
import googleAuth from "./google/googleauth";
import axios from "axios";
const express = require("express");
const user = express.Router();
const JWT_SECRET=process.env.JWT_TOKEN;
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

  // if user exist in the Prisma 
  const existingUser = await axios.get(`${process.env.DATABASE_SERVER}/filter/user/email?value=${trustedData.data.email}`);
    if (Array.isArray(existingUser.data) && existingUser.data.length >0) {
      return res.status(409).send("User with this email already exists");
    }

// create new user
  let hashedpassword='';
    if(salt){
     hashedpassword=await bcrypt.hash(trustedData.data.password,salt);
    }

     const createuser = async ()=>{
    const User =await axios.post(`${process.env.DATABASE_SERVER}/User`,{
      name:trustedData.data.username,
      password: hashedpassword,
      email:trustedData.data.email
    });
    if(res.status(200)){
    res.status(200).json(User.data);
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
user.post("/signin", async (req: Request, res: Response) => {
  try {
    const trustedData = signin.safeParse(req.body);
    if (!trustedData.success) {
      return res.status(400).send("Invalid request data");
    }

    // Fetch user by email
    const userResp = await axios.get(
      `${process.env.DATABASE_SERVER}/filter/user/email?value=${encodeURIComponent(
        trustedData.data.email
      )}`
    );

    const user = userResp.data[0]; // ← extract user safely

    // Check if user exists
    if (!user) {
      return res.status(404).send("No user Found");
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      trustedData.data.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).send("Password mismatch");
    }

    // Generate JWT
    const token = jwt.sign(
      {
        username: user.email,
        id: user.id,
      },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Save Session Payload
    req.session.sessionpayload = {
      token: token,
      id: user.id,
      Username: user.name,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Could not save session");
      }
    });
  return res.status(200).json({
        message: "SignIn successful",
        id: user.id,
        username: user.name,
   });
  } catch (error) {
    return res.status(500).send("Sorry we are facing some issues: " + error);
  }
});


user.get("/logout", async (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  });
});




export default user;