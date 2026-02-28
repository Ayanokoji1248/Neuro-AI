import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL as string
})
redisClient.on("error", (err) => console.log("Redis Error", err));
redisClient.on("connect", () => console.log("Redis connected"));
await redisClient.connect();