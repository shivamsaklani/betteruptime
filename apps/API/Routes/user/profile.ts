import type { Request, Response } from "express";
import { Authorize } from "./middleware";
import { Prisma } from "@repo/db/client";

// add logic to user profile and settings data
const express = require("express");
const profile = express.Router();


profile.post("/changepassword",Authorize,async (req:Request,res:Response)=>{
   const {currentpassword, newpass,confirmpass } = req.body;
   const userid = req.userid?.id as string;
   try {
        await Prisma.user.update({
            where:{
                id:userid
            },
        })
   } catch (error) {
    
   }
});

export default profile;
