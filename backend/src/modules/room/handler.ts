import type { Server, Socket } from "socket.io";
import { RoomStatus, type CreateRoomPayload, type Room } from "./types.js";
import { players } from "../player/repository.js";
import { generateRoomCode } from "../../utils/generate-room-code.js";
import { rooms } from "./repository.js";

export function emitRoomUpdate(io: Server, room: Room) {
  io.to(room.code).emit("room:update", {
    ...room,
    players: getRoomPlayers(room),
  });
}

export function getRoomPlayers(room: Room) {
  return room.players.map((id) => players.get(id)).filter(Boolean);
}

export function registerRoomHandlers(io: Server, socket: Socket) {
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
      category: data.category,
      mode: data.mode,
      isPublic: data.isPublic,
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

    if (room.players.length >= 10 && !room.players.includes(player.playerId)) {
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
}

export function removePlayerFromRoom(
  io: Server,
  room: Room,
  playerId: string
) {
  room.players = room.players.filter(
    (id) => id !== playerId
  );

  // ninguém ficou na sala
  if (room.players.length === 0) {
    rooms.delete(room.code);

    console.log(`🗑️ Sala ${room.code} removida`);

    return;
  }


  // saiu o host
  if (room.hostId === playerId) {
    const newHost = room.players
      .map((id) => players.get(id))
      .find((player) => player?.online);

    if (newHost) {
      room.hostId = newHost.playerId;

      console.log(
        `👑 Novo host: ${newHost.nickname}`
      );
    }
  }

  rooms.set(room.code, room);

  emitRoomUpdate(io, room);
}