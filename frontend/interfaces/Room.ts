import { Player } from "./Player";

type Operation = "addition" | "subtraction" | "multiplication" | "division";
type Difficulty = "easy" | "medium" | "hard";
export enum RoomStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export interface Room {
  code: string;
  hostId: string;

  operation: Operation;
  difficulty: Difficulty;

  questionsAmount: number;
  questionTime: number;

  status: RoomStatus;

  players: Player[];
}
