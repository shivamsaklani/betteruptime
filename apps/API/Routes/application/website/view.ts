// add logic to how the user view and create a graph in this 
import axios from "axios";
import type { Request, Response } from "express";
const express = require("express");
const charts = express();

charts.get("/uptime/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const  where= {
                website_id: id,
            };
    try {
        const fetchDB = await axios.get(`${process.env.DATABASE_SERVER}/websiteTick`,{
          params:{
            where:JSON.stringify(where),
            take: 100,
            orderBy:JSON.stringify( {
                createdAt: "desc", // optional, ensures latest first
            }),
             select:JSON.stringify( {
                status: true,
            }),

          }
        })
        const fetchdata = fetchDB.data;
        const total = fetchdata.length;
        if (total == 0) {
            return res.status(401).json({
                "status": []
            });
        }
        const uptime = fetchdata.filter((w:any) => w.status == "up" ).length;
        const downtime = fetchdata.filter((w:any) =>  w.status == "down" ).length;
        const degraded = fetchdata.filter((w:any) =>  w.status == "degraded" ).length;

        const success = Number(((uptime / total) * 100).toFixed(2));
        const failed = Number(((downtime / total) * 100).toFixed(2));
        const degrad = Number(((degraded / total) * 100).toFixed(2));

        return res.status(200).json({
            "status": [success, failed, degrad]
        });

    } catch (error) {
        res.status(500).send("Try Again");
        return;
    }
}); // gives data to the pie chart uptime for each website

// Convert UTC → IST
// ------------------------------
// Convert UTC → IST safely
// ------------------------------
export function toIST(date: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => parts.find(p => p.type === type)?.value;

  // Proper ISO with +05:30 offset
  const istString =
    `${get("year")}-${get("month")}-${get("day")}T` +
    `${get("hour")}:${get("minute")}:${get("second")}.000+05:30`;

  return new Date(istString);
}



// ==================================
//   GET /responsetime/:id
// ==================================
charts.get("/responsetime/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const timeframe = (req.query.timeframe as string) || "1h";

  try {
    const now = new Date();
    let startTime = new Date();
    let groupInterval: "second" | "minute" | "hour" = "minute";

    // ------------------------------
    // Timeframe logic
    // ------------------------------
    switch (timeframe) {
      case "10m":
        startTime.setMinutes(now.getMinutes() - 10);
        groupInterval = "minute";
        break;

      case "30m":
        startTime.setMinutes(now.getMinutes() - 30);
        groupInterval = "minute";
        break;

      case "1h":
        startTime.setHours(now.getHours() - 1);
        groupInterval = "minute";
        break;

      case "24h":
        startTime.setHours(now.getHours() - 24);
        groupInterval = "hour";
        break;

      default:
        return res.status(400).json({
          error: "Invalid timeframe. Use 10m, 30m, 1h, or 24h.",
        });
    }


    // ------------------------------
    // Fetch DB
    // ------------------------------
    const fetchDB = await axios.get(`${process.env.DATABASE_SERVER}/websiteTick`, {
      params: {
        where: JSON.stringify({
          website_id: id,
          createdAt: { gte: startTime },
        }),
        orderBy: JSON.stringify({ createdAt: "asc" }),
        select: JSON.stringify({ response_time_ms: true, createdAt: true }),
      },
    });

    const rawData = fetchDB.data;
    if (rawData.length === 0)
      return res.status(200).json({ responsetime: [], label: [] });

    // ------------------------------
    // Group values (in IST)
    // ------------------------------
    const grouped: Record<string, { date: Date; values: number[] }> = {};

    for (const entry of rawData) {
      const dateIST = toIST(new Date(entry.createdAt));

      // ------------- Grouping Logic -------------
      let key = "";

      if (groupInterval === "hour") {
        key = dateIST.getHours().toString(); // 0-23
      } else {
        key = `${dateIST.getHours()}-${dateIST.getMinutes()}`;
      }

      if (!grouped[key]) {
        grouped[key] = { date: dateIST, values: [] };
      }

      grouped[key].values.push(entry.response_time_ms);
    }

    // ------------------------------
    // Sort keys by actual date
    // ------------------------------
    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => grouped[a].date.getTime() - grouped[b].date.getTime()
    );

    // ------------------------------
    // Build chart output
    // ------------------------------
let labels: string[] = [];
let responseTimes: number[] = [];

if (timeframe === "24h") {
  // ------------- Generate full 24 hours -------------
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, "0");

    labels.push(hourStr);

    if (grouped[hour.toString()]) {
      // avg present
      const g = grouped[hour.toString()];
      const avg =
        g.values.reduce((a, b) => a + b, 0) / g.values.length;

      responseTimes.push(Number(avg.toFixed(2)));
    } else {
      // no data → pad with 0 or null?
      responseTimes.push(0);
    }
  }
} else {
  // other timeframes (10m, 30m, 1h)
  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => grouped[a].date.getTime() - grouped[b].date.getTime()
  );

  for (const key of sortedKeys) {
    const g = grouped[key];
    const avg =
      g.values.reduce((a, b) => a + b, 0) / g.values.length;

    responseTimes.push(Number(avg.toFixed(2)));

    labels.push(
      g.date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }
}

    return res.status(200).json({
      responsetime: responseTimes,
      label: labels,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Try Again");
  }
});




// gives response line chart data for each website


export default charts;