import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import cors from "cors";
import UserRouter from "./routes/User.route.js";
import ShopRouter from "./routes/ShopRoute.js";
import ItemRouter from "./routes/ItemRouter.js";
import orderRouter from "./routes/OrderRoute.js";
import http from "http"
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

dotenv.config();

const app = express();
const server= http.createServer(app)
const io = new Server(server ,{
    cors:{
    origin: 'https://mealhunt-good-dilevery99.vercel.app',
  credentials: true,
    methods:['POST' , 'GET']
  },
})

app.set("io" , io)
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authrouter);
app.use("/api/user", UserRouter);
app.use("/api/shop", ShopRouter);
app.use("/api/item", ItemRouter);
app.use("/api/order", orderRouter);

socketHandler(io)

server.listen(port, () => {
  connectDB();
  console.log(`Server started at ${port}`);
});
