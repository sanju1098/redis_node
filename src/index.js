import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

// ================== Express App and Redis Setup ==================
const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");
const PORT = 3000;

const BANNER_KEY = "app:banner";

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

app.post("/banner", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Banner message is required" });
  }
  await redis.set(BANNER_KEY, req.body.message);
  res.json({ success: true, message: "Banner updated successfully" });
});

app.get("/banner", async (req, res) => {
  const bannerMessage = await redis.get(BANNER_KEY);
  if (!bannerMessage) {
    return res.status(404).json({ error: "No banner message found" });
  }
  res.json({ success: true, banner: bannerMessage });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true, message: "Banner deleted successfully" });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ success: true, exists: exists }); // Boolean(exists) to convert 0/1 to true/false
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
