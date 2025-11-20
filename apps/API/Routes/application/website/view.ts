// add logic to how the user view and create a graph in this 

import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
const express = require("express");
const charts = express();

charts.get("/uptime/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const fetchdata = await PrismaClient.websiteTick.findMany({
            where: {
                website_id: id,
            },
            take: 100,
            select: {
                status: true,
            },
            orderBy: {
                createdAt: "desc", // optional, ensures latest first
            },
        });
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

charts.get("/responsetime/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const timeframe = (req.query.timeframe as string) || "1h"; // default 1 hour

  try {
    const now = new Date();
    let startTime = new Date();
    let groupInterval = "minute";

    // Determine timeframe and grouping
    switch (timeframe) {
      case "1m":
        startTime.setMinutes(now.getMinutes() - 1);
        groupInterval = "second";
        break;
      case "5m":
        startTime.setMinutes(now.getMinutes() - 5);
        groupInterval = "second";
        break;
      case "1h":
        startTime.setHours(now.getHours() - 1);
        groupInterval = "minute";
        break;
      case "1d":
        startTime.setDate(now.getDate() - 1);
        groupInterval = "hour";
        break;
      case "1mo":
        startTime.setMonth(now.getMonth() - 1);
        groupInterval = "day";
        break;
      case "1y":
        startTime.setFullYear(now.getFullYear() - 1);
        groupInterval = "month";
        break;
      default:
        startTime.setHours(now.getHours() - 1);
    }

    // Fetch data from DB
    const rawData = await PrismaClient.websiteTick.findMany({
      where: {
        website_id: id,
        createdAt: { gte: startTime },
      },
      orderBy: { createdAt: "asc" },
      select: { response_time_ms: true, createdAt: true },
    });

    if (rawData.length === 0) {
      return res.status(200).json({ response: [], label: [] });
    }

    // Group data by interval
    const grouped: Record<string, number[]> = {};
    for (const entry of rawData) {
      const date = new Date(entry.createdAt);
      let key: string;
      switch (groupInterval) {
        case "second":
          key = date.toISOString().slice(0, 19);
          break;
        case "minute":
          key = date.toISOString().slice(0, 16);
          break;
        case "hour":
          key = date.toISOString().slice(0, 13);
          break;
        case "day":
          key = date.toISOString().slice(0, 10);
          break;
        case "month":
          key = date.toISOString().slice(0, 7);
          break;
        default:
          key = date.toISOString();
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry.response_time_ms);
    }

    // Prepare response arrays
    const labels: string[] = [];
    const responseTimes: number[] = [];

    for (const [key, values] of Object.entries(grouped)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      responseTimes.push(Number(avg.toFixed(2)));

      const date = new Date(key);
      labels.push(
        groupInterval === "day"
          ? date.toLocaleDateString(undefined)
          : date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
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
});// gives response line chart data for each website


export default charts;