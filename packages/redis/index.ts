import { createClient } from "redis";
const redisclient = await createClient({
    url:process.env.Redis_url|| "redis://localhost:6379"
});
redisclient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

try {
  await redisclient.connect();
  console.log("Connected to Redis");
} catch (err) {
  console.error("Failed to connect to Redis:", err);
  process.exit(1); 
}

type websiteType ={ url :string, id:string};

async function PushWebsite({url,id}:websiteType) {
   try {
     await redisclient.xAdd(
         'uptime:website','*',{
             url,id
     });
   } catch (error) {
     console.log("Connection Error",error);
     
   }
}

export async function PushBulk(website:websiteType[]) {
    for (const w of website) {
    await PushWebsite(w);
  }
}