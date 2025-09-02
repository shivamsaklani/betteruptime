import type { Request, Response } from "express";

const express = require("express");
const application = express.Router();

application.get("/", (req: Request, res: Response) => {
  res.send("Application Route");
}); 


export default application; 