import express, { type Request, type Response } from "express";
import { Authorize } from "../../user/middleware";
import nodemailer from "nodemailer";
import axios from "axios";

const channel = express();
const transporter = nodemailer.createTransport({
  // service: "Gmail",
  host: "sandbox.smtp.mailtrap.io",
  // port: 465,
  port:2525,
  // secure: true,
  // pool: true, // ♻️  enable connection pooling
  // maxConnections: 5, // optional – defaults to 5
  // maxMessages: 100, // optional – defaults to 100
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_CLIENT_SECRET,
  },
});
// const transporter = nodemailer.createTransport({
//     mailTrap({

//     })
// })
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
})

channel.post("/sendEmail", async (req: Request, res: Response) => {
  const { subject, website_id, Heading, message } = req.body;
  const userId = req.userid?.id;
  const where = {
    website_id: website_id,
    channel: {
      user_id: userId,
      channelName: "email",
      monitor: true
    }
  }


  try {
    const channels = await axios.get(`${process.env.DATABASE_SERVER}/websiteMonitored`, {
      params: {
        where: JSON.stringify(where),
        include: JSON.stringify({ channel: true })
      }
    });
    const rows = channels.data;
    const emailList = rows.map((r: any) => r.channel.channelDetails);
    if (!emailList || emailList.length == 0) {
      res.status(404).send("No receipent! Please Add New Rules");
      return;
    }
    await transporter.sendMail({
      subject: subject,
      from: process.env.GOOGLE_EMAIL,
      to: emailList.join(","),
      html: `<div style="color:#ff0068;"><h1>${Heading}</h1><span>${channels.data.website}</span><p>${message}</p></div>`
    });
    res.status(200).send("Message sent");
  } catch (error) {
    console.log("Email Not send", error);
    res.status(500).send("Email not Sent due to Server issues");
  }

});
export default channel;