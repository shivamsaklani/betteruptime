import axios from "axios";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true, // ♻️  enable connection pooling
  maxConnections: 5, // optional – defaults to 5
  maxMessages: 100, // optional – defaults to 100
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_CLIENT_SECRET,
  },
});

export async function sendEmail({ subject, website_id, Heading, message, time }: {
  subject: string,
  website_id: string,
  Heading: string,
  message: string,
  time: Date
}) {
  const where = {
    website_id: website_id,
    channel: {
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
    const website = await axios.get(`${process.env.DATABASE_SERVER}/website`, {
      params: {
        where: JSON.stringify({ id: website_id })
      }
    });
    const websiteData = website.data[0];
    const rows = channels.data;
    const emailList = rows.map((r: any) => r.channel.channelDetails);
    if (!emailList || emailList.length == 0) {
      return;
    }
    const formattedTime = time.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const html = `
   <div style="color:#ff0068;">  
   <h1><span>An Event occured with intensity of </span>${Heading}</h1> 
   <p>Your Website ${websiteData.name} with url as ${websiteData.url} has faced issues ${Heading}.</p>
   <h2> The Reason for Event to occur is : ${message}</h2>
   <p>${formattedTime}</p>
   </div>
  `;
  console.log("before email");
    await transporter.sendMail({
      subject: subject,
      from: process.env.GOOGLE_EMAIL,
      to: emailList.join(","),
      html: html
    });
    console.log("Email Sent");
    return;
  } catch (error) {
    console.error("Email Not send", error);
    return;
  }
}

