import type { Question } from "./question-types.js";

export interface Answer {
  playerId: string;
  answer: string | number;
  isCorrect: boolean;
  answeredAt: number;
}

export interface Game {
  roomCode: string;

  currentQuestion: number;

  question?: Question;

  answers: Answer[];

  startedAt: number;
}