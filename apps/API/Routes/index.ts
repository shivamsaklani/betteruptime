import express from "express";
import user from "./user/user";
import application from "./application/app";
const API = express.Router();

API.get("/",(req,res)=>{
  res.send("Running");
});

API.use("/user", user); // end point for the user authorization 
API.use("/website", application); // end points for the website functionality

export default API;