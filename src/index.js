import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
const redis = new Redis("redis://localhost:6379");
const PORT = 3000;

app.get("/redis", async (req, res) => {
  const redisReply = await redis.ping();
  res.json({ redis: redisReply });
});

app.get("/mongo", async (req, res) => {
  const url = "mongodb://localhost:27017/redis_mongo_db";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }
  res.json({ mongo: "DB Connected", database: mongoose.connection.name });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
