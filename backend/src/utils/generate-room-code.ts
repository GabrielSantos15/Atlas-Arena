import { rooms } from "../modules/room/repository.js";

export function generateRoomCode(): string {
  let code: string;

  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (rooms.has(code));

  return code;
}