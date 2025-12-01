import { createClient, type RedisClientType } from "redis";

export const redisclient: RedisClientType = createClient({
  url: process.env.Redis_url
});

redisclient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export async function connectRedis() {
  if (!redisclient.isOpen) {
    try {
      await redisclient.connect();
      console.log("✔ Redis Connected");
    } catch (err) {
      console.error("❌ Redis Connection Failed:", err);
      process.exit(1);
    }
  }
}
