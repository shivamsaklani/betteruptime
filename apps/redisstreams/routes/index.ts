import express, { type Request, type Response } from "express";
import type { Events, websiteType } from "../redis/types";
import { Alerts, CreateRegion, DelRegion, mesAck, mesAckGroup, PushBulk, ReadGroup } from "../redis/index";
import axios from "axios";

const router = express.Router();


// Health Check
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Server Working" });
});

// Push Multiple Websites
router.post("/pushbulk", async (req: Request, res: Response) => {
  const { websites } = req.body as { websites: websiteType[] };

  if (!websites || websites.length === 0) {
    return res.status(400).json({ error: "websites array is required" });
  }

  // TODO: call Redis push bulk
  await PushBulk(websites);

  return res.status(200);
});
// Create Region
router.post("/createregion", async (req: Request, res: Response) => {
  const { region } = req.body as { region: string };
  if (!region) {
    return res.status(400).json({ error: "region name is required" });
  }


  await CreateRegion(region);

  return res.status(200).send(region);

});
// Delete Region

router.delete("/deleteRegion/:id", async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await DelRegion(id);
  return res.status(200);
});

router.post("/ackGroup", async (req: Request, res: Response) => {
  const { website, groupName } = req.body as { groupName: string, website: string[] };
  await mesAckGroup(groupName, website);
  return res.status(200);
});

router.post("/readGroup", async (req: Request, res: Response) => {
  const { groupName, workerId } = req.body as { groupName: string, workerId: string };
  const fetch = await axios.get(`${process.env.DATABASE_SERVER}/website`, {
    params: {
      select: JSON.stringify({
        url: true,
        id: true
      })
    }
  });

  const response = await ReadGroup(groupName, workerId);
  return res.status(200).send(response);
});

router.post("/alerts", async (req: Request, res: Response) => {
  const { Event } = req.body as { Event: Events };
  await Alerts(Event);
  return res.status(200);
});


export default router;
