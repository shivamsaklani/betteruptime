import express from "express";
import { Prisma } from "@repo/db/client";
const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("Running");
});

app.post("/website",(req,res)=>{
  const {url}=req.body;
  const response = async ()=>{
    await Prisma.website.create({
      data:{
        url:url,
        timeAdded:new Date()
      }

    })
  };
  response();
  res.status(200).send("Added data");
})

app.listen(3001);
