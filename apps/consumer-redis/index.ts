import axios from "axios";
import dotenv from "dotenv";
import { level, type ResponseType } from "./types";
dotenv.config();

const activeConsumers = new Map<string, boolean>(); // track running regions

async function consumeRegion(region: string, region_id: string, workerId: string) {

  console.log(`[${region}] consumer started for worker ${workerId}`);

  while (true) {
    try {
      const fetchRedis = await axios.post(`${process.env.REDIS_SERVER}/readGroup`, {
        groupName: region,
        workerId: workerId
      });
      const response: ResponseType[] = fetchRedis.data;
      if (response && response.length > 0) {
        await Promise.all(
          response[0]!.messages.map(async ({ message }: { message: { url: string; id: string } }) => {
            const url = message.url.startsWith("http://") || message.url.startsWith("https://") ? message.url : `https://${message.url}`;

            const websiteId = message.id;
            const startTime = Date.now();

            try {
              await axios.get(url, { timeout: 5000 });
              const responseTime = Date.now() - startTime;
              const status = responseTime > 1500 ? "degraded" : "up";
              await axios.post(`${process.env.DATABASE_SERVER}/websiteTick`, {
                status, response_time_ms: responseTime, region_id, website_id: websiteId
              });


              if (status === "degraded") {
                await axios.post(`${process.env.REDIS_SERVER}/alerts`, {
                  Event: {
                    websiteId,
                    Reason: `Response time too high (${responseTime} ms)`,
                    occured: true,
                    isResolved: false,
                    level: level.mid, // mid-level severity for degraded
                  }
                });

              } else {
                // mark degraded/down alerts as resolved
                await axios.post(`${process.env.REDIS_SERVER}/alerts`, {
                  Event: {
                    websiteId,
                    Reason: `Response time normal (${responseTime} ms)`,
                    occured: false,
                    isResolved: true,
                    level: level.low, // mid-level severity for degraded
                  }
                });
              }
            } catch (e: any) {
              const responseTime = Date.now() - startTime;
              await axios.post(`${process.env.DATABASE_SERVER}/websiteTick`, {
                status: "down", response_time_ms: responseTime, region_id, website_id: websiteId
              });

              await axios.post(`${process.env.REDIS_SERVER}/alerts`, {
                Event: {
                  websiteId,
                  Reason: e?.message ?? "Request failed",
                  occured: true,
                  isResolved: false,
                  level: level.high,
                }
              });

            }
          })
        );

        // acknowledge messages
        const ack = await axios.post(`${process.env.REDIS_SERVER}/ackGroup`, {
          website: response[0]!.messages.map((w) => w.id),
          groupName: region
        });
        console.log(ack.status);
      } else {
        console.log(`[${region}] region has  no messages waiting for more 3 seconds`);
      }
    } catch (err) {
      console.error(`[${region}] error:`, err);
      await new Promise((res) => setTimeout(res, 20));
    }
  }
}

async function Worker() {
  setInterval(async () => {
    console.log("Consumer service is running");
    try {
      const fetch = await axios.get(`${process.env.DATABASE_SERVER}/region`, {
        params: {
          select: JSON.stringify({ id: true, name: true })
        }
      });
      let regions = fetch.data;
      // Creating Default Region if not present

      if (regions.length === 0) {
        console.log("No regions found. Creating default region...");
        try {
          const fetchRegion = await axios.post(`${process.env.DATABASE_SERVER}/region`, {
            name: "asia"
          }, {
            params: {
              select: JSON.stringify({ id: true, name: true })
            },
          });
          activeConsumers.set(fetchRegion.data.id, true);
        } catch (error) {
          console.log("Region Not Created" + error);
        }
      }

      for (const r of regions) {
        const workerId = `${r.name}-worker`;
        if (!activeConsumers.has(r.id)) { // tracks new regions entry

          activeConsumers.set(r.id, true);
          await axios.post(`${process.env.REDIS_SERVER}/createregion`, {
            region: r.name
          });
       

        }
     void consumeRegion(r.name, r.id, workerId);
      }
    } catch (error) {
      console.log("Consumer not running", error);
    }
  }, 60000); // every 60 seconds check for new regions
}


// async function Worker() {


//     try {
//       const { data: regions } = await axios.get(`${process.env.DATABASE_SERVER}/region`, {
//         params: { select: JSON.stringify({ id: true, name: true }) }
//       });
//       console.log("Database regions"+regions);
//       if (regions.length === 0) {
//         console.log("No regions found. Creating default region...");
//       try {
//           const fetchRegion = await axios.post(`${process.env.DATABASE_SERVER}/region`,{
//             name:"asia"
//           },{
//             params:{
//               select: JSON.stringify({ id: true, name: true })},
//           });
//           const response = await axios.post(`${process.env.REDIS_SERVER}/createregion`,{
//             region:"asia"
//           });
//            console.log("Region Asia created"+response.data);
//         activeConsumers.set(fetchRegion.data,true);
//       } catch (error) {
//         console.log("Region Not Created"+error);
//       }
//       }

//       for (const r of regions) {
//         // Use region name as unique key
//         console.log("Active Consumers: "+activeConsumers);
//         if (!activeConsumers.has(r.name)) {
//           activeConsumers.set(r.name, true);
//           consumeRegion(r.name, r.id);
//         }
//       }
//     } catch (error) {
//       console.log("Worker error:", error);
//     }

// }

Worker().catch(console.error);

