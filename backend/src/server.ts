import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import registerSocketHandlers from "./socket/index.js";

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});