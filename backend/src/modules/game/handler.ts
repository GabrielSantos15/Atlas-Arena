import type { Server, Socket } from "socket.io";
import { rooms } from "../room/repository.js";
import { players } from "../player/repository.js";
import { games } from "./repository.js";
import type { Game } from "./types.js";
import { RoomStatus } from "../room/types.js";
import { emitRoomUpdate } from "../room/handler.js";

export function registerGameHandlers(io: Server, socket: Socket) {
  socket.on("game:start", (data?: { roomCode?: string; playerId?: string }) => {
    const socketPlayer = Array.from(players.values()).find(
      (player) => player.socketId === socket.id
    );

    const roomCode = data?.roomCode ?? socketPlayer?.roomCode;
    const playerId = data?.playerId ?? socketPlayer?.playerId;

    if (!roomCode || !playerId) {
      socket.emit("room:error", {
        message: "Dados insuficientes para iniciar a partida.",
      });

      return;
    }

    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("room:error", {
        message: "Sala não encontrada.",
      });
      return;
    }

    if (room.hostId !== playerId) {
      socket.emit("room:error", {
        message: "Apenas o host pode iniciar a partida.",
      });
      return;
    }

    if (room.status !== RoomStatus.WAITING) {
      socket.emit("room:error", {
        message: "A partida já foi iniciada.",
      });
      return;
    }

    // Inicializa dados dos jogadores
    room.players.forEach((playerId) => {
      const player = players.get(playerId);

      if (player) {
        players.set(playerId, {
          ...player,
          score: 0,
          correctAnswers: 0,
        });
      }
    });

    // Atualiza status da sala
    room.status = RoomStatus.PLAYING;

    rooms.set(room.code, room);

    // Cria o jogo
    const game: Game = {
      roomCode: room.code,

      currentQuestion: 0,

      answers: [],

      startedAt: Date.now(),
    };

    games.set(room.code, game);

    console.log(`🎮 Jogo iniciado na sala ${room.code}`);

    // manda todos para o jogo
    io.to(room.code).emit("game:started", {
      roomCode: room.code,
    });

    // atualiza sala caso alguém ainda esteja ouvindo
    emitRoomUpdate(io, room);
  });
}
