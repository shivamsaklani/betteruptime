import axios from "axios";
import dotenv from "dotenv";
import { level, type ResponseType } from "./types";
dotenv.config();

const activeConsumers = new Map<string, boolean>(); // track running regions

async function consumeRegion(region: string, region_id: string, workerId: string) {

  console.log(`[${region}] consumer started for worker ${workerId}`);

  while (true) {
    try {
      const fetchRedis =  await axios.post(`${process.env.REDIS_SERVER}/readGroup`,{
        groupName:region,
        workerId:workerId
      });
      const response:ResponseType[]= fetchRedis.data;
      // await ReadGroup(region, workerId);

      if (response && response.length > 0) {
        await Promise.all(
          response[0]!.messages.map(async ({ message }: { message: { url: string; id: string } }) => {
            const url = message.url.startsWith("http://") || message.url.startsWith("https://") ? message.url : `https://${message.url}`;

            const websiteId = message.id;
            const startTime = Date.now();

            try {
              await axios.get(url);
              const responseTime = Date.now() - startTime;
              const status = responseTime > 5000 ? "degraded" : "up";
              await axios.post(`${process.env.DATABASE_SERVER}/websiteTick`,{
                 status, response_time_ms: responseTime, region_id, website_id: websiteId 
              });
       

              if (status === "degraded") {
                await axios.post(`${process.env.REDIS_SERVER}/alerts`,{
                  Event:{
                  websiteId,
                  Reason: `Response time too high (${responseTime} ms)`,
                  occured: true,
                  isResolved: false,
                  level: level.mid, // mid-level severity for degraded
                }
                });
                // await Alerts({
                //   websiteId,
                //   Reason: `Response time too high (${responseTime} ms)`,
                //   occured: true,
                //   isResolved: false,
                //   level: level.mid, // mid-level severity for degraded
                // });
              } else {
                // mark degraded/down alerts as resolved
                  await axios.post(`${process.env.REDIS_SERVER}/alerts`,{
                  Event:{
                  websiteId,
                  Reason: `Response time normal (${responseTime} ms)`,
                  occured: false,
                  isResolved: true,
                  level: level.low, // mid-level severity for degraded
                }
                });



                // await Alerts({
                //   websiteId,
                //   Reason: `Response time normal (${responseTime} ms)`,
                //   occured: false,
                //   isResolved: true,
                //   level: level.low,
                // });
              }
            } catch (e: any) {
              const responseTime = Date.now() - startTime;
              await axios.post(`${process.env.DATABASE_SERVER}/websiteTick`,{
                 status:"down", response_time_ms: responseTime, region_id, website_id: websiteId 
              });

              await axios.post(`${process.env.REDIS_SERVER}/alerts`,{
                Event:{
                websiteId,
                Reason: e?.message ?? "Request failed",
                occured: true,
                isResolved: false,
                level: level.high,
              }
              });
           
              // await Alerts({
              //   websiteId,
              //   Reason: e?.message ?? "Request failed",
              //   occured: true,
              //   isResolved: false,
              //   level: level.high,
              // });
            }
          })
        );

        // acknowledge messages
        await axios.post(`${process.env.REDIS_SERVER}/ackGroup`,{
          website:response[0]!.messages.map((w) => w.id), 
          groupName:region


        });
        // mesAckGroup(region, response[0]!.messages.map((w) => w.id));
      } else {
        console.log(`[${region}] no messages`);
      }
    } catch (err) {
      console.error(`[${region}] error:`, err);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

async function Worker() {
  setInterval(async () => {

    try {
      const fetch = await axios.get(`${process.env.DATABASE_SERVER}/region`,{
        params:{
          select : JSON.stringify({ id: true, name: true })
        }
      });
      let regions = fetch.data;
      if (regions.length === 0) {
        console.log("No regions found. Creating default region...");
        const fetchRegion = await axios.post(`${process.env.DATABASE_SERVER}/region`,{
          name:"asia"
        },{
          params:{
            select: JSON.stringify({ id: true, name: true })},
        });
        const defaultRegion =fetchRegion.data;
        await axios.post(`${process.env.REDIS_SERVER}/createregion`,{
          region:"asia"
        });
        // CreateRegion("asia");
        regions = [defaultRegion];
        activeConsumers.set("asia", true);
      }


      for (const r of regions) {
        if (!activeConsumers.has(r.id)) { // tracks new regions entry
          const workerId = `${r.name}-worker-${Date.now()}`;
          activeConsumers.set(r.id, true);
         
            await axios.post(`${process.env.DATABASE_SERVER}/region`,{
           name:r.name
        });
          // await CreateRegion(r.name);
          await consumeRegion(r.name, r.id, workerId);
        }
      }
    } catch (error) {
      console.log("Consumer not running", error);
    }
  }, 60_000); // every 60 seconds check for new regions
}

Worker().catch(console.error);
