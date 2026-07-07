import { Player } from "./Player";

export type QuizCategory = "geography";
export type GeographyMode = "flags" | "capitals" | "continents";
export enum RoomStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export interface Room {
  code: string;
  hostId: string;

  category: QuizCategory;
  mode: GeographyMode;
  isPublic: boolean;

  questionsAmount: number;
  questionTime: number;

  status: RoomStatus;

  players: Player[];
}
