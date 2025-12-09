import express, { type Request, type Response } from "express";
import { Authorize } from "../../user/middleware";
import axios from "axios";

const channel = express();

channel.get("/", (req, res) => {
  res.status(200).send("Running Properly");
});

channel.post("/create", Authorize, async (req: Request, res: Response) => {
  const userId = req.userid?.id;
  const { channelDetails, channelName } = req.body;
  if (!userId) {
    return res.status(401).send("You don't have access to create this resource");
  }
  try {
    const response = await axios.post(
      `${process.env.DATABASE_SERVER}/monitoredChannel`,
      {
        user_id: userId,
        channelDetails,
        channelName: channelName,
      },
      {
        withCredentials: true,
      }
    );
    res.status(200).send(response.data);
    return;
  } catch (error) {
    res.status(500).send("Error occured");
    return;
  }

});
channel.post("/update", Authorize, async (req: Request, res: Response) => {
  const userId = req.userid?.id;
  const { isactive, channelId } = req.body;
  if (!userId) {
    return res.status(401).send("You don't have access to update this resource");
  }
  try {
    await axios.put(
      `${process.env.DATABASE_SERVER}/monitoredChannel`,
      {
        id: channelId,
        monitor: isactive
      },
      {
        withCredentials: true,
      }
    );
    res.status(200).send("Channel is updated");
    return;
  } catch (error) {
    res.status(500).send("Error occured");
    return;
  }

});
channel.get("/getchannels", Authorize, async (req: Request, res: Response) => {
  const userId = req.userid?.id;
  if (!userId) {
    return res.status(401).send("No User found");
  }
  try {
    const channels = await axios.get(`${process.env.DATABASE_SERVER}/monitoredChannel`);
    res.status(200).json(channels.data);
    return;
  } catch (error) {
    res.status(500).send("Error");
    return;
  }

});
channel.post("/delete",Authorize,async(req:Request,res:Response)=>{
   const userId = req.userid?.id;
  const { channelId } = req.body;
  if (!userId) {
    return res.status(401).send("You don't have access to update this resource");
  }
  try {
    await axios.delete(
      `${process.env.DATABASE_SERVER}/monitoredChannel/${channelId}`,
      {withCredentials:true}
    );
    res.status(200).send("Channel is updated");
  } catch (error) {
    res.status(500).send("Error occured");
  }
});
export default channel;