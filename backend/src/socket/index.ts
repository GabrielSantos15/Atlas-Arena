import { Server } from "socket.io";

import type { Player } from "../modules/player/types.js";
import {
  RoomStatus,
  type CreateRoomPayload,
  type Room,
} from "../modules/room/types.js";

import { rooms } from "../modules/room/repository.js";
import { players } from "../modules/player/repository.js";

import { generateRoomCode } from "../utils/generate-room-code.js";

function getRoomPlayers(room: Room) {
  return room.players.map((id) => players.get(id)).filter(Boolean);
}

function emitRoomUpdate(io: Server, room: Room) {
  io.to(room.code).emit("room:update", {
    ...room,
    players: getRoomPlayers(room),
  });
}

export default function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`✅ ${socket.id} connected`);

    socket.on("player:register", (data: Player) => {
      const oldPlayer = players.get(data.playerId);

      const player: Player = {
        ...oldPlayer,
        ...data,
        socketId: socket.id,
        online: true,
      };

      players.set(player.playerId, player);

      // Reconecta na sala caso exista
      if (player.roomCode) {
        const room = rooms.get(player.roomCode);

        if (room) {
          if (!room.players.includes(player.playerId)) {
            room.players.push(player.playerId);
          }

          socket.join(room.code);

          rooms.set(room.code, room);

          emitRoomUpdate(io, room);

          console.log(`🔄 ${player.nickname} reconectou na sala ${room.code}`);

          return;
        }
      }

      console.log(`👤 ${player.nickname} registrado`);
    });

    socket.on("room:create", (data: CreateRoomPayload) => {
      const host = players.get(data.hostId);

      if (!host) {
        socket.emit("room:error", {
          message: "Jogador não encontrado.",
        });

        return;
      }

      const room: Room = {
        code: generateRoomCode(),

        hostId: host.playerId,

        operation: data.operation,

        difficulty: data.difficulty,

        questionsAmount: data.questionsAmount,

        questionTime: data.questionTime,

        status: RoomStatus.WAITING,

        players: [host.playerId],
      };

      rooms.set(room.code, room);

      players.set(host.playerId, {
        ...host,
        roomCode: room.code,
        socketId: socket.id,
        online: true,
      });

      socket.join(room.code);

      console.log(`🏠 Sala ${room.code} criada por ${host.nickname}`);

      emitRoomUpdate(io, room);

      socket.emit("room:created", room);
    });

    socket.on("room:join", (data: { roomCode: string; playerId: string }) => {
      const room = rooms.get(data.roomCode);

      const player = players.get(data.playerId);

      if (!room) {
        socket.emit("room:error", {
          message: "Sala não encontrada.",
        });

        return;
      }

      if (!player) {
        socket.emit("room:error", {
          message: "Jogador não encontrado.",
        });

        return;
      }

      if (
        room.players.length >= 10 &&
        !room.players.includes(player.playerId)
      ) {
        socket.emit("room:error", {
          message: "Sala cheia.",
        });

        return;
      }

      if (!room.players.includes(player.playerId)) {
        room.players.push(player.playerId);
      }

      players.set(player.playerId, {
        ...player,
        roomCode: room.code,
        socketId: socket.id,
        online: true,
      });

      rooms.set(room.code, room);

      socket.join(room.code);

      console.log(`🚪 ${player.nickname} entrou na sala ${room.code}`);

      emitRoomUpdate(io, room);

      socket.emit("room:joined", room);
    });

    socket.on("disconnect", () => {
      console.log(`❌ ${socket.id} disconnected`);

      for (const [id, player] of players.entries()) {
        if (player.socketId === socket.id) {
          const updatedPlayer: Player = {
            ...player,
            socketId: undefined,
            online: false,
          };

          players.set(id, updatedPlayer);

          const room = player.roomCode ? rooms.get(player.roomCode) : null;

          if (room) {
            // Se o host saiu, passa para outro jogador online
            if (room.hostId === player.playerId) {
              const newHost = room.players
                .map((id) => players.get(id))
                .find((p) => p && p.playerId !== player.playerId && p.online);

              if (newHost) {
                room.hostId = newHost.playerId;

                console.log(`👑 Novo host: ${newHost.nickname}`);
              }
            }

            rooms.set(room.code, room);

            emitRoomUpdate(io, room);
          }

          break;
        }
      }
    });
  });
}
