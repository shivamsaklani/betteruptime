import express from "express";
import cors from "cors";
import model from "./model/model";
const app =express();
app.use(express.json());
app.use(cors({
  origin:process.env.API_SERVER ,
  credentials:true
}));

app.use("/api/v1", model);


app.listen(process.env.DATABASE_PORT, () =>
  console.log(`Database is Running${process.env.API_SERVER}`)

);
