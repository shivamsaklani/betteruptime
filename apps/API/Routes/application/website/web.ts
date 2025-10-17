import { Prisma } from "@repo/db/client";
import { Authorize } from "../../user/middleware";
import type { Request, Response } from "express";

const express = require("express");
const web = express.Router();


web.post("/createwebsite", Authorize, async (req: Request, res: Response) => {
    const { url ,name} = req.body;
    const id = req.userid?.id;
    if (!id) {
        res.status(401).send("No user found");
        return;
    }
    try {
        const web= await Prisma.website.create({
            data: {
                url: url,
                name:name,
                user_id: id
            }
        });
        res.status(200).send(web.id);
        return;
    } catch (e) {
        res.status(500).send("Please Try Again"+e);
        return;
    }
}); // EndPoint for Creating a Website
web.delete("/deletewebsite/:id", Authorize, async (req: Request, res: Response) => {
    const id = req.userid?.id;
    const  webid  = req.params.id;
    console.log(id);
    console.log(webid);
    if (!id) {
        res.status(401).send("No user found");
        return;
    }
    try {
        await Prisma.websiteTick.deleteMany({
  where: {
    website_id: webid,
  },
});
        const response = await Prisma.website.delete({
            where: {
                id: webid,
                user_id: id
            }
        });
        console.log(response.name);
        if (!response) {
            res.status(404).send("No Website found");
            return;
        }
        res.status(200).send("Website Deleted");
        return;
    } catch (e) {
        res.status(500).send("Please Try Again");
        console.log(e);
        return;
    }
}); //EndPoint for Deleting a Website
web.get("/getwebsites", Authorize, async (req: Request, res: Response) => {
    const id = req.userid?.id;
    try {

        const websites = await Prisma.website.findMany({
            where: {
                user_id: id,
            },
            select: {
                name:true,
                url: true,
                id: true,
                timeAdded: true,
                ticks: {
                    orderBy: {
                        createdAt: "desc",   // latest tick first
                    },
                    take: 1,               // only one tick
                    select: {
                        status: true,
                        createdAt:true,
                        response_time_ms:true
                    },
                }
            }
        });
   
    if (!websites || websites.length === 0) {
      return res.status(404).send("No websites");
    }

    // Flatten tick data into website object
    const flattenedWebsites = websites.map((w) => {
      const latestTick = w.ticks[0]; // because take: 1
      return {
        id: w.id,
        name:w.name,
        url: w.url,
        timeAdded: w.timeAdded,
        status: latestTick?.status,
        lastChecked: latestTick?.createdAt,
        responseTime: latestTick?.response_time_ms,
      };
    });
        res.status(200).send(flattenedWebsites);
        return;

    } catch (error) {
        res.status(500).send("We ara facing issue Please try after some time");
        return;
    }
});// Sends all the websites from database
web.get("/:websiteid", Authorize, async (req: Request, res: Response) => {
    const user_id = req.userid?.id;
    try {
        const website= await Prisma.website.findFirst({
            where: {
                user_id: user_id,
                id: req.params.websiteid
            },
            include: {
                ticks: {
                    orderBy: [{
                        createdAt: "desc"
                    }],
                    take: 1000
                },
                
            },
        });
        if (!website) {
      return res.status(404).send("No websites");
    }

    // Flatten tick data into website object
     const latestTick = website.ticks[0]; // because take: 1
    const upCount = website.ticks.filter(t => t.status === "up").length;
    const uptime = website.ticks.length > 0 ? (upCount / website.ticks.length) * 100 : null;
   
    const  response = {
          id: website.id,
        name:website.name,
        url: website.url,
        timeAdded: website.timeAdded,
        status: latestTick?.status || "unkown",
        lastChecked: latestTick?.createdAt || 0,
        responseTime: latestTick?.response_time_ms || "0",
        uptime:uptime || 0,
        };
    

     //also add it to the response data recentIncidents
     
    res.status(200).json(response);
        return;
    } catch (error) {
        res.status(500).send("Try Again. We are facing Traffic");
        return;
    }
}); //Endpoint for checking Website data




export default web;