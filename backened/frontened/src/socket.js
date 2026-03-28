// src/socket.js
import { io } from "socket.io-client";

export const serverUrl = import.meta.env.VITE_API_URL;
export const socket = io(serverUrl, { withCredentials: true });