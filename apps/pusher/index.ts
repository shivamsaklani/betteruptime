import { PushBulk} from "@repo/redisstreams/redisclient";
import { Prisma } from "@repo/db/client";
async function main(){
  const websites = await Prisma.website.findMany({
    select:{
      url:true,
      id:true 
  }
  });
  PushBulk(websites);
}

setInterval(()=>{
 main();
},60_000);