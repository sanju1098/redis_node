import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import { OTPKeyWithTTL } from "./helpers/optLoginWithTTL.js";

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

// ================== Banner APIs ==================
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

// ================== OPT Login with TTL ==================
app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP

  await redis.set(OTPKeyWithTTL(phone), otpValue, "EX", 30); // Set OTP with a TTL of 10 seconds
  res.json({
    success: true,
    message: "OTP Sent and stored in Redis",
    otp: otpValue,
  });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }
  const storedOtp = await redis.get(OTPKeyWithTTL(phone));
  if (!storedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }
  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redis.del(OTPKeyWithTTL(phone)); // Optionally delete the OTP after successful verification
  return res.json({ success: true, message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(OTPKeyWithTTL(phone));
  res.json({ success: true, ttl });
});

// ================== Start the Server ==================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
