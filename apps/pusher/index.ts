import { PushBulk } from "@repo/redisstreams/redisclient";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
async function Pusher() {
  if (!process.env.DATBASE_SERVER) {
    console.error("❌ DATABASE_SERVER is not defined in .env");
    return;
  }
  try {
    const fetch = await axios.get(`${process.env.DATBASE_SERVER}/website`, {
      params: {
        select: JSON.stringify({
          url: true,
          id: true
        })
      }
    });
    const websites = fetch.data;
    PushBulk(websites);
    // change it to API Request too 

  } catch (error) {
    console.log("Error");
  }

}

setInterval(() => {
  Pusher();
}, 20_000);