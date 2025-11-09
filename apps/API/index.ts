import express from "express";
import API from "./Routes";
import cors from "cors";
import session, { Store } from "express-session";
import { redisclient } from "@repo/redisstreams/redisclient";
import { RedisStore } from "connect-redis";
const store = new RedisStore({
  client: redisclient,
  prefix: "session:",
}) as unknown as Store;
const app = express();
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));
app.use(session({
  store:store,
  secret:process.env.SESSION_SECRET || "secret",
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    maxAge: 1000*60*60,
    secure:false,
    sameSite: "lax" // change it in production to none and secure to true 
  }
}
));
app.get("/",(req,res)=>{
  res.send("Running");
});

app.use("/api/v1", API);
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});