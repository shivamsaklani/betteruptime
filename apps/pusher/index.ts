import { PushBulk} from "@repo/redisstreams/redisclient";
import { Prisma } from "@repo/db/client";
async function Pusher(){
  const websites = await Prisma.website.findMany({
    select:{
      url:true,
      id:true 
  }
  });
  PushBulk(websites);
}

setInterval(()=>{
 Pusher();
},30_000);