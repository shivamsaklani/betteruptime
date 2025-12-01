
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
async function Pusher() {
  if (!process.env.DATABASE_SERVER) {
    console.error("❌ DATABASE_SERVER is not defined in .env");
    return;
  }
  try {
    const fetch = await axios.get(`${process.env.DATABASE_SERVER}/website`, {
      params: {
        select: JSON.stringify({
          url: true,
          id: true
        })
      }
    });

    const websites = fetch.data;
    const redis_res = await axios.post(`${process.env.REDIS_SERVER}/pushbulk`, {
      websites
    });
    if (redis_res.status == 400) {
      console.log("No Websites");
    }

  } catch (error) {
    console.log("Error " + error);
  }

}

setInterval(() => {
  Pusher();
}, 30000);