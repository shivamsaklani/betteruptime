import type { Request, Response } from "express";
import { Authorize } from "../user/middleware";
import { Prisma } from "@repo/db/client";
import { DelRegion} from "@repo/redisstreams/redisclient";
const express = require("express");
const application = express.Router();

application.post("/createwebsite",Authorize ,async (req: Request, res: Response) => {
  const {url}= req.body;
  const id = req.userid?.id;
  if(!id) {
    res.status(401).send("No user found");
    return;
  }
  try {
   await Prisma.website.create({
      data:{
        url:url,
        user_id:id
      }
    });
    res.status(200).send("Website Added");
    return;
  } catch (e) {
    res.status(500).send("Please Try Again");
    return;
  }
}); // EndPoint for Creating a Website
application.post("/deletewebsite",Authorize ,async (req: Request, res: Response) => {
  const id = req.userid?.id;
  const {webid}=req.body;
  if(!id) {
    res.send("No user found");
    return;
  }
  try {
   const response= await Prisma.website.delete({
      where:{
        id:webid,
        user_id:id
      }
    });
    if(!response){
      res.send("No Website found");
      return;
    }
    res.send("Website Deleted");
    return;
  } catch (e) {
    res.send("Please Try Again");
    return;
  }
}); //EndPoint for Deleting a Website

application.post("/createregion",Authorize,async (req:Request,res:Response)=>{
  const {region}= req.body;
  try {
    await Prisma.region.create({
      data:{
        name:region
      }
    });
    res.status(200).send(`Region created:${region}`);
    return;
  } catch (error) {
      res.status(500).send("Try Again. We are facing Traffic");
    return;
  }
}); //EndPoint for Adding new Region
application.delete("/delregion",Authorize,async (req:Request,res:Response)=>{
  const {id,region}= req.body;
  try {
    await Prisma.region.delete({
      where:{
        id:id,
      }
    });
    DelRegion(region);
    res.status(200).send(`Region Deleted`);
    return;
  } catch (error) {
      res.status(500).send("Try Again. We are facing Traffic");
    return;
    
  }
}); //EndPoint for Deleting Region
application.get("/:websiteid",Authorize,async (req:Request,res:Response)=>{
  const user_id = req.userid?.id;
  try {
      const response =await Prisma.website.findFirst({
       where:{
         user_id:user_id,
         id:req.params.websiteid
       },
       include:{
        ticks:{
          orderBy:[{
            createdAt:"desc"
          }],
          take:1
        }
       }
      });
      if(!response){
        res.send("No Response");
        return;
      }
      res.status(200).json({
        response
      });
      return;
  } catch (error) {
    res.status(500).send("Try Again. We are facing Traffic");
    return;
  }
}); //Endpoint for checking Website data



export default application; 