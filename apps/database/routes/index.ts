import express from "express";
import cors from "cors";
import model from "./model/model";
const app =express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", model);

app.listen(process.env.DATABASE_PORT, () =>
  console.log("Database is Running")
);
