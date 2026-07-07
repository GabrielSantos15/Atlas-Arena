export enum RoomStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export enum QuizCategory {
  GEOGRAPHY = "geography",
  // MATH = "math" // v2
}

export enum GeographyMode {
  FLAGS = "flags",
  CAPITALS = "capitals",
  CONTINENTS = "continents",
}

export type CreateRoomPayload = {
  hostId: string;
  category: QuizCategory;
  mode: GeographyMode;
  isPublic: boolean;
  questionsAmount: number;
  questionTime: number;
};

export interface Room {
  code: string;
  hostId: string;
  category: QuizCategory;
  mode: GeographyMode;
  isPublic: boolean;
  questionsAmount: number;
  questionTime: number;
  status: RoomStatus;
  players: string[];
}
