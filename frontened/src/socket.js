// src/socket.js
import { io } from "socket.io-client";

export const serverUrl = "http://localhost:4000";
export const socket = io(serverUrl, { withCredentials: true });