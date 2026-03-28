import dotenv from "dotenv";
dotenv.config(); // ← MOVE THIS to be right after dotenv import

import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import cors from "cors";
import UserRouter from "./routes/User.route.js";
import ShopRouter from "./routes/ShopRoute.js";
import ItemRouter from "./routes/ItemRouter.js";
import orderRouter from "./routes/OrderRoute.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

// rest of your code stays the same...

const app = express();
const server = http.createServer(app);

// ✅ CORS ORIGIN CHECK FUNCTION
const allowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // allow Postman / mobile

  if (
    origin.includes("localhost") ||
    origin.includes("vercel.app")
  ) {
    return callback(null, true);
  }

  return callback(new Error("Not allowed by CORS"));
};

// ✅ EXPRESS CORS
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ✅ SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// ✅ MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/auth", authrouter);
app.use("/api/user", UserRouter);
app.use("/api/shop", ShopRouter);
app.use("/api/item", ItemRouter);
app.use("/api/order", orderRouter);

// ✅ SOCKET HANDLER
socketHandler(io);

// ✅ START SERVER
const port = process.env.PORT || 5000;

server.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});