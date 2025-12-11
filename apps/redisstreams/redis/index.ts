import type { ResponseType, websiteType, Events } from "./types";
import axios from "axios";
import { connectRedis, redisclient } from "./main";

await connectRedis();

const Stream_Name = "uptime:website";
/* -----------------------------------------------------------
   PUSH WEBSITE INTO STREAM (SAFE + MAXLEN)
------------------------------------------------------------ */
export async function PushWebsite({ url, id }: websiteType) {
  try {
    try {
      await redisclient.xAdd(
        Stream_Name, '*', {
        url, id
      });
    } catch (error) {
      console.error("Connection Error", error);
    }
  } catch (error) {
    console.error("PushWebsite Error:", error);
  }
}

export async function PushBulk(websites: websiteType[]) {
  for (const w of websites) {
    await PushWebsite(w);
  }
}

/* -----------------------------------------------------------
   CREATE REGION (CONSUMER GROUP)
------------------------------------------------------------ */
export async function CreateRegion(region: string) {
  try {
    let groups: any[] = [];

    try {
      groups = await redisclient.xInfoGroups(Stream_Name);
    } catch {
      groups = [];
    }

    const exists = groups.some((g: any) => g.name === region);

    if (!exists) {
      await redisclient.xGroupCreate(Stream_Name, region, "$", {
        MKSTREAM: true,
      });
    }
  } catch (error) {
    console.error("CreateRegion Error:", error);
  }
}

/* -----------------------------------------------------------
   DELETE REGION (CONSUMER GROUP)
------------------------------------------------------------ */
export async function DelRegion(groupName: string) {
  try {
    await redisclient.xGroupDestroy(Stream_Name, groupName);
  } catch (error) {
    console.error("DelRegion Error:", error);
  }
}

/* -----------------------------------------------------------
   ACK MESSAGES
------------------------------------------------------------ */
export async function mesAck(messageId: string, groupName: string) {
  try {
    await redisclient.xAck(Stream_Name, groupName, messageId);
    // await redisclient.xDel(Stream_Name, messageId);
  } catch (error) {
    console.error(`ACK failed for ${messageId}:`, error);
  }
}

export async function mesAckGroup(groupName: string, ids: string[]) {
  try {
    if (!ids.length) return;
    await Promise.all(ids.map((id) => mesAck(id, groupName)));
  } catch (err) {
    console.error("mesAckGroup Error:", err);
  }
}

/* -----------------------------------------------------------
   READ GROUP MESSAGES (SAFE)
------------------------------------------------------------ */
export async function ReadGroup(
  groupName: string,
  workerId: string
): Promise<ResponseType[]> {
  if (!groupName) return [];


  try {
    const result = await redisclient.xReadGroup(
      groupName,
      workerId,
      {
        key: Stream_Name,
        id: ">" // read only new messages
      },
      {
        BLOCK: 2000, // 2s block
      }
    );
    if (!result || result.length === 0) {
      const claimed: ResponseType = await reclaimStuck(groupName, workerId);
      if (!claimed || claimed.messages.length > 0) {
        return [];
      }
    };
    return result as ResponseType[];
  } catch (error: any) {
    const msg = error?.message;

    if (msg?.includes("NOGROUP")) {
      return [];
    }

    console.error("ReadGroup Error:", error);
    return [];
  }
}

/* -----------------------------------------------------------
   ALERTING LOGIC
------------------------------------------------------------ */
export async function Alerts(Event: Events) {
  try {
    const key = `events:active:${Event.websiteId}`;
    const isActive = await redisclient.get(key);

    /* --------------------------
       EVENT OCCURRED (DOWN / DEGRADED)
    --------------------------- */
    if (Event.occured) {
      if (!isActive) {
        await axios.post(`${process.env.DATABASE_SERVER}/WebEvent`, {
          name: Event.Reason,
          level: Event.level,
          resolved: Event.isResolved,
          website_id: Event.websiteId,
          timeAdded: new Date(),
          resolvedTime: new Date(),
        });
        await axios.post(`${process.env.API_SERVER}/notify/methods`,{
          ...Event,subject:"Error Occured",time:new Date()
        });
        await redisclient.set(key, "active", { EX: 3600 });
      }
      return;
    }

    /* --------------------------
       EVENT RESOLVED
    --------------------------- */
    if (Event.isResolved && isActive) {
      await axios.put(
        `${process.env.DATABASE_SERVER}/WebEvent`,
        {
          resolved: true,
          resolvedTime: new Date(),
        },
        {
          params: {
            where: JSON.stringify({
              website_id: Event.websiteId,
              resolved: false,
            }),
          },
        }
      );
      await axios.post(`${process.env.API_SERVER}/notify/methods`,{
          ...Event,subject:"Issue Resolved",time:new Date()
        });
      await redisclient.del(key);
    }
  } catch (error) {
    console.error("Alerts Error");
    return;
  }
}

/* -----------------------------------------------------------
   Pending List Claim 
------------------------------------------------------------ */

async function reclaimStuck(groupName: string, workerId: string): Promise<any> {
  let claimed;
  try {
    claimed = await redisclient.XAUTOCLAIM(Stream_Name, groupName, workerId, 5000, "0-0");
    return claimed;
  } catch (error) {
    console.error("Error :"+error);
  }
  return claimed;
}

