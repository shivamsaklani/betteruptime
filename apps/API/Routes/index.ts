import express from "express";
import user from "./user/user";
import web from "./application/website/web";
import region from "./application/region/region";
import charts from "./application/website/view";
import profile from "./user/profile";
import { Authorize } from "./user/middleware";
import channel from "./application/channels/channels";
import rules from "./application/channels/rules";
const API = express.Router();

API.get("/",(req,res)=>{
  res.send("Running");
});

API.use("/user", user); // end point for the user authorization 
API.use("/profile",profile); //end point for user profile settings
API.use("/website", web); // end points for the website functionality
API.use("/region",region); // end points for region functionality
API.use("/charts",Authorize,charts); // end points for charts functionality 
API.use("/channel",Authorize,channel); //for sending Alerts through Email, SMS etc.
API.use("/rules",Authorize,rules);
export default API;