import express, { type Request, type Response } from "express";
import axios from "axios";
const rules = express();

rules.post("/create",async (req:Request,res:Response)=>{
    const {website_id, channel_id,level} = req.body;
   try {
     const createrules = await axios.post(`${process.env.DATABASE_SERVER}/websiteMonitored`,{
       website_id:website_id,
       channel_id:channel_id,
       level:level,
     },{withCredentials:true});
     console.log(createrules.data);
     return res.status(200).send("New Rule created");
 
   } catch (error) {
      console.log(error);
      return res.status(500).send("Error Occured"+error);
   }

});

rules.post("/update",async (req: Request, res: Response) => {
  const userId = req.userid?.id;
  const { isactive, channelId } = req.body;
  if (!userId) {
    return res.status(401).send("You don't have access to update this resource");
  }
  try {
    await axios.put(
      `${process.env.DATABASE_SERVER}/websiteMonitored`,
      {
        id: channelId,
        monitor: isactive
      },
      {
        withCredentials: true,
      }
    );
    res.status(200).send("Rule is updated");
    return;
  } catch (error) {
    res.status(500).send("Error occured");
    return;
  }

});

rules.get("/getrules",async (req: Request, res: Response) => {
  const userId = req.userid?.id;
  if (!userId) {
    return res.status(401).send("No User found");
  }
const select = {
  id:true,
  level:true,
  website: {
    select: {
      name: true,
      url: true
    }
  },
  channel: {
    select: {
      channelName: true,
      channelDetails: true
    }
  }
};

  try {
    const channels = await axios.get(`${process.env.DATABASE_SERVER}/websiteMonitored`,{
      params:{select:JSON.stringify(select)}
    });
    res.status(200).json(channels.data);
    return;
  } catch (error) {
    res.status(500).send("Error");
    return;
  }

});

rules.post("/delete",async(req:Request,res:Response)=>{
   const userId = req.userid?.id;
  const { ruleId } = req.body;
  if (!userId) {
    return res.status(401).send("You don't have access to update this resource");
  }
  try {
    await axios.delete(
      `${process.env.DATABASE_SERVER}/websiteMonitored/${ruleId}`,
      {withCredentials:true}
    );
    res.status(200).send("Rule is updated");
  } catch (error) {
    res.status(500).send("Error occured");
  }
});


export default rules;