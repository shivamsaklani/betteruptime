import { Alerts, CreateRegion, ReadGroup, mesAck, mesAckGroup } from "@repo/redisstreams/redisclient";
import { level, type ResponseType } from "@repo/redisstreams/types";
import { Prisma } from "@repo/db/client";
import axios from "axios";

const activeConsumers = new Map<string, boolean>(); // track running regions

async function consumeRegion(region: string, region_id: string, workerId: string) {
  console.log(`[${region}] consumer started for worker ${workerId}`);

  while (true) {
    try {
      const response: ResponseType[] = await ReadGroup(region, workerId);

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
              await Prisma.websiteTick.create({
                data: { status, response_time_ms: responseTime, region_id, website_id: websiteId },
              });

              if (status === "degraded") {
                await Alerts({
                  websiteId,
                  Reason: `Response time too high (${responseTime} ms)`,
                  occured: true,
                  isResolved: false,
                  level: level.mid, // mid-level severity for degraded
                });
              } else {
                // mark degraded/down alerts as resolved
                await Alerts({
                  websiteId,
                  Reason: `Response time normal (${responseTime} ms)`,
                  occured: false,
                  isResolved: true,
                  level: level.low,
                });
              }
            } catch (e: any) {
              const responseTime = Date.now() - startTime;
              await Prisma.websiteTick.create({
                data: { status: "down", response_time_ms: responseTime, region_id, website_id: websiteId },
              });
              await Alerts({
                websiteId,
                Reason: e?.message ?? "Request failed",
                occured: true,
                isResolved: false,
                level: level.high,
              });
            }
          })
        );

        // acknowledge messages
        mesAckGroup(region, response[0]!.messages.map((w) => w.id));
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
      let regions = await Prisma.region.findMany({
        select: { id: true, name: true },
      });
      if (regions.length === 0) {
        console.log("No regions found. Creating default region...");
        const defaultRegion = await Prisma.region.create({
          data: { name: "asia" },
          select: { id: true, name: true },
        });
        CreateRegion("asia");
        regions = [defaultRegion];
        activeConsumers.set("asia", true);
      }


      for (const r of regions) {

        if (!activeConsumers.has(r.id)) { // tracks new regions entry
          const workerId = `${r.name}-worker-${Date.now()}`;
          activeConsumers.set(r.id, true);
          await CreateRegion(r.name);
          await consumeRegion(r.name, r.id, workerId);
        }
      }
    } catch (error) {
      console.log("Consumer not running", error);
    }
  }, 60_000); // every 60 seconds check for new regions
}

Worker().catch(console.error);
