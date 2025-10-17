import express from "express";
import user from "./user/user";
import web from "./application/website/web";
import region from "./application/region/region";
import charts from "./application/website/view";
import { Authorize } from "./user/middleware";
const API = express.Router();

API.get("/",(req,res)=>{
  res.send("Running");
});

API.use("/user", user); // end point for the user authorization 
API.use("/website", web); // end points for the website functionality
API.use("/region",region); // end points for region functionality
API.use("/charts",Authorize,charts); // end points for charts functionality 

export default API;