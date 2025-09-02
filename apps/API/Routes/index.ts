import express from "express";
import user from "./user/user";
const API = express.Router();

API.get("/",(req,res)=>{
  res.send("Running");
});

API.use("/user", user);

export default API;