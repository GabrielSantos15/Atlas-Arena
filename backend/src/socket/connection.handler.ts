import type { Server, Socket } from "socket.io";

import { players } from "../modules/player/repository.js";
import { rooms } from "../modules/room/repository.js";
import { destroyRoom, emitRoomUpdate } from "../modules/room/handler.js";

export function registerConnectionHandlers(io: Server, socket: Socket) {
  socket.on("disconnect", () => {
    console.log(`❌ ${socket.id} disconnected`);

    for (const [id, player] of players.entries()) {
      if (player.socketId !== socket.id) continue;

      players.set(id, {
        ...player,
        socketId: undefined,
        online: false,
      });

      const room = player.roomCode
        ? rooms.get(player.roomCode)
        : undefined;

      if (!room) break;

      // Se ninguém ficou online, destrói a sala
      const hasOnlinePlayers = room.players.some((playerId) => {
        return players.get(playerId)?.online;
      });

      if (!hasOnlinePlayers) {
        destroyRoom(room.code);

        console.log(`🗑️ Sala ${room.code} encerrada`);

        break;
      }

      // Troca host caso necessário
      if (room.hostId === player.playerId) {
        const newHost = room.players
          .map((id) => players.get(id))
          .find((p) => p?.online);

        if (newHost) {
          room.hostId = newHost.playerId;

          console.log(`👑 Novo host: ${newHost.nickname}`);
        }
      }

      rooms.set(room.code, room);

      emitRoomUpdate(io, room);

      break;
    }
  });
}