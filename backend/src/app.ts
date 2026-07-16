import express from "express";
import cors from "cors";
import "dotenv/config";
import { rooms } from "./modules/room/repository.js";
import { RoomStatus } from "./modules/room/types.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.get("/health", (_, res) => {
  res.send("OK");
});

app.get("/rooms/public", (_, res) => {
  const publicRooms = Array.from(rooms.values())
    .filter(
      (room) => room.isPublic,
      // && room.status === RoomStatus.WAITING
    )
.map((room) => ({
      code: room.code,
      category: room.category,
      difficulty: room.difficulty, 
      questionsAmount: room.questionsAmount,
      questionTime: room.questionTime,
      playersCount: room.players.length,
      maxPlayers: 10,
      canJoin: room.players.length < 10,
      status: room.status,
    }));

  res.json(publicRooms);
});

export default app;
