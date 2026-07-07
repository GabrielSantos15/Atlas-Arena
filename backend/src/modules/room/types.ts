export enum RoomStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

type Operation = "addition" | "subtraction" | "multiplication" | "division";
type Difficulty = "easy" | "medium" | "hard";

export type CreateRoomPayload = {
  hostId: string;
  operation: Operation;
  difficulty: Difficulty;
  questionsAmount: number;
  questionTime: number;
};

export interface Room {
  code: string;
  hostId: string;

  operation: Operation;
  difficulty: Difficulty;

  questionsAmount: number;
  questionTime: number;

  status: RoomStatus;

  players: string[];
}
