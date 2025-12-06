import type { Request, Response } from "express";
import { Authorize } from "../../user/middleware";
import axios from "axios";
const express = require("express");
const region = express.Router();


region.post("/createregion",Authorize,async (req:Request,res:Response)=>{
  const {region}= req.body;
  const userId=req.userid?.id;
  try {
     await axios.post(`${process.env.DATABASE_SERVER}/region`,{
      name:region,
      user_id:userId
    });

     const response = await axios.post(`${process.env.REDIS_SERVER}/createregion`,{
          region:region
        });

    // CreateRegion(region);
    console.log(response.data);
    res.status(200).send(region);
    return;
  } catch (error) {
    console.log(error);
      res.status(500).send("Try Again. We are facing Traffic");
    return;
  }
}); //EndPoint for Adding new Region


region.delete("/delregion",Authorize,async (req:Request,res:Response)=>{
  const {id,region}= req.body;
  try {
    await axios.delete(`${process.env.DATABASE_SERVER}/region`);
    await axios.delete(`${process.env.REDIS_SERVER}/deleteRegion/id?value=${region}`);
    // DelRegion(region);
    res.status(200).send(`Region Deleted`);
    return;
  } catch (error) {
      res.status(500).send("Try Again. We are facing Traffic");
    return;
    
  }
}); //EndPoint for Deleting Region



export default region; 