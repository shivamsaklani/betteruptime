import type { Request, Response } from "express";
import { Prisma } from "@repo/db/client";
import {CreateRegion, DelRegion} from "@repo/redisstreams/redisclient";
import { Authorize } from "../../user/middleware";
const express = require("express");
const region = express.Router();


region.post("/createregion",Authorize,async (req:Request,res:Response)=>{
  const {region}= req.body;
  const userId=req.userid?.id;
  try {
    await Prisma.region.create({
      data:{
        name:region,
        user_id:userId
      }
    });
    CreateRegion(region);
    res.status(200).send(`Region created:${region}`);
    return;
  } catch (error) {
      res.status(500).send("Try Again. We are facing Traffic");
    return;
  }
}); //EndPoint for Adding new Region
region.delete("/delregion",Authorize,async (req:Request,res:Response)=>{
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



export default region; 