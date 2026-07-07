import { Server } from "socket.io";

import { registerConnectionHandlers } from "./connection.handler.js";
import { registerPlayerHandlers } from "../modules/player/handler.js";
import { registerRoomHandlers } from "../modules/room/handler.js";
import { registerGameHandlers } from "../modules/game/handler.js";

export default function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`✅ ${socket.id} connected`);

    registerPlayerHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);
    registerConnectionHandlers(io, socket);
  });
}
