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
const toIST = (date: Date) => {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

charts.get("/responsetime/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const timeframe = (req.query.timeframe as string) || "1h";

  try {
    const now = new Date();
    let startTime = new Date();
    let groupInterval: "second" | "minute" | "hour" = "minute";

    switch (timeframe) {
      case "10m":
        startTime.setMinutes(now.getMinutes() - 10);
        groupInterval = "second";
        break;
      case "30m":
        startTime.setMinutes(now.getMinutes() - 30);
        groupInterval = "second";
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

    // Grouped data = store actual IST date instead of ISO strings
    const grouped: Record<string, { date: Date; values: number[] }> = {};

    for (const entry of rawData) {
      const dateIST = toIST(new Date(entry.createdAt));

      let key = "";

      if (groupInterval === "second")
        key = `${dateIST.getHours()}-${dateIST.getMinutes()}-${dateIST.getSeconds()}`;

      if (groupInterval === "minute")
        key = `${dateIST.getHours()}-${dateIST.getMinutes()}`;

      if (groupInterval === "hour")
        key = `${dateIST.getHours()}`;

      if (!grouped[key]) grouped[key] = { date: dateIST, values: [] };
      grouped[key].values.push(entry.response_time_ms);
    }

    const labels: string[] = [];
    const responseTimes: number[] = [];

    for (const key in grouped) {
      const g = grouped[key];

      const avg =
        g.values.reduce((a, b) => a + b, 0) / g.values.length;

      responseTimes.push(Number(avg.toFixed(2)));

      labels.push(
        groupInterval === "hour"
          ? g.date.toLocaleTimeString([], { hour: "2-digit" })
          : g.date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
      );
    }

    res.status(200).json({
      responsetime: responseTimes,
      label: labels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Try Again");
  }
});


// gives response line chart data for each website


export default charts;