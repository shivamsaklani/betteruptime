import express, { type Request, type Response } from "express";
import { sendEmail } from "./method";
const notify = express();


notify.post("/methods", async (req: Request, res: Response) => {

  const { subject, websiteId, level, Reason, time } = req.body;

  try {
    await sendEmail({subject:subject,website_id:websiteId,Heading:level,message:Reason,time:time});
    res.status(200).send("Email sent");
  } catch (error) {
    res.status(500).send("Error");
  }

});


export default notify;