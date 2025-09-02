import { Prisma } from "@repo/db/client";
import type { Request, Response } from "express"; 
import bcrypt, { hash } from "bcrypt";
import { userSchema } from "./zodschema";
import { Authorize } from "./middleware"; // only the verified user be able to make request
import jwt from "jsonwebtoken";
const express = require("express");
const user = express.Router();
const JWT_SECRET=process.env.JWT_TOKEN;
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
        OR: [
          { email: trustedData.data.email
           },
          { name: trustedData.data.username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).send("User with this email or username already exists");
    }

// create new user
  let hashedpassword='';
    if(salt){
     hashedpassword=await bcrypt.hash(trustedData.data.password,salt);
    }
     const createuser = async ()=>{
   await Prisma.user.create({
    data:{
      name:trustedData.data.username,
      password: hashedpassword,
      email:trustedData.data.email
    }
   })
  }
  createuser();
  if(res.status(200)){
    res.send("User Create Successfully");
    return;
  }
  } catch (error) {
    res.status(500).send("Sorry we are facing some issues"+error);
    return;
  }
  }
 );

 // SignIn
user.post("/signin",async (req:Request, res:Response) => {
  try {
    const trustedData = userSchema.safeParse(req.body);
    if(!trustedData.success){
      res.status(401).send("Enter Valid Data");
      return;
    }
    const userData = await Prisma.user.findFirst({
      where:{
        name:trustedData.data.username
      }
    });
    console.log(JWT_SECRET);
    const token= jwt.sign({
      username:userData?.email,
      email:userData?.id
    },JWT_SECRET as string,{
      expiresIn:"1h"
    });
    res.status(200).send(token);
    return;
    
  } catch (error) {
     res.status(500).send("Sorry we are facing some issues"+error);
     return;
  }    
  
});

user.post("/website",Authorize,(req:Request,res:Response)=>{
  const {url}=req.body;
  const response = async ()=>{
    await Prisma.website.create({
      data:{
        url:url,
        timeAdded:new Date()
      }

    })
  };
  response();
  res.status(200).send("Added data");
});

export default user;