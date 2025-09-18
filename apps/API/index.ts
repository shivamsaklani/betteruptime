import express from "express";
import API from "./Routes";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
  res.send("Running");
});

app.use("/api/v1", API);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});