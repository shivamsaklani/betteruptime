import type { Request, Response } from "express";
import { Authorize } from "../user/middleware";
import { Prisma } from "@repo/db/client";
const express = require("express");
const application = express.Router();

application.post("/create",Authorize ,async (req: Request, res: Response) => {
  const {url}= req.body;
  const id = req.userid?.id;
  try {
   await Prisma.website.create({
      data:{
        url:url,
        user_id:id
      }
    });
    res.send("Website Added");
    return;
  } catch (e) {
    res.send("Please Try Again");
    return;
  }
}); 

application.post("/region",Authorize,async (req:Request,res:Response)=>{

});

application.get("/website/:id",Authorize,(req:Request,res:Response)=>{
  const {url,region}=req.body;
  try {
      const response = Prisma.website.findFirst({
       where:{
         
       }
      });
  } catch (error) {
    
  }
});



export default application; 