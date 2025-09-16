import { createClient } from "redis";
import type { ResponseType, websiteType } from "./types";
const redisclient = await createClient({
    url:process.env.Redis_url|| "redis://localhost:6379"
});
redisclient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});
const Stream_Name = 'uptime:website';
try {
  await redisclient.connect();
  console.log("Connected to Redis");
} catch (err) {
  console.error("Failed to connect to Redis:", err);
  process.exit(1); 
}


async function PushWebsite({url,id}:websiteType) {
   try {
     await redisclient.xAdd(
         Stream_Name ,'*',{
             url,id
     });
   } catch (error) {
     console.log("Connection Error",error);
     
   }
} // pushes website into the queue
export async function PushBulk(website:websiteType[]) {
    for (const w of website) {
    await PushWebsite(w);
  }
}// pushes all the websites from database to the queue
export async function CreateRegion(region:string) {
  try {
    const exist= await redisclient.exists(region); //check if the region is in the stream or not 
  if(!exist){
    await redisclient.xGroupCreate(
      Stream_Name,
      region,
      "$",
      {
        MKSTREAM: true // auto create stream if it doesn't exist
      }
    );
  }
  } catch (error) {
    console.log("Error Creating Group",error);
  }  
} // creates new Region in the Stream
export async function DelRegion(groupName:string) {
  try {
    await redisclient.xGroupDestroy(Stream_Name,groupName);
      } catch (error) {
    console.error(`Error deleting consumer: ${error}`);
  }
}// delete Region 
export async function mesAck(mesid:string,groupName:string) {
try {
   const response =await  redisclient.xAck(Stream_Name,groupName,mesid);
} catch (error) {
  console.log("Message Not ack",error);
}
}
export async function ReadGroup(groupName:string,workerId:string):Promise<ResponseType[] > {
  if(!groupName){
    return [];
  }
  
  try {
  const website = await redisclient.xReadGroup(groupName,workerId,{
      key:Stream_Name,
      "id":">"
    },
  {
    BLOCK:60_000
  });
     if(!website) return [];
    return website as ResponseType[];
  } catch (error) {
    console.log("Error reading",error);
    return [];
  }
  
}

export async function mesAckGroup(groupName:string, website:string[]) {
  for(const w of website){
    await mesAck(w,groupName);
  }
}