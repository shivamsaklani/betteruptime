import express from "express";
import dotenv from "dotenv";
import router from "./routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/v1",router);
const PORT = process.env.RedisPort || 5000;

app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});
