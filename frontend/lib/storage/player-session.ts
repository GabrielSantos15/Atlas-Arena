import socket from "@/lib/socket";
import { getOrCreatePlayerId } from "@/lib/player";
import { Player } from "@/interfaces/Player";

export type PlayerSession = Pick<
  Player,
  "playerId" | "nickname" | "avatarSeed"
>;

const SESSION_KEY = "quiz:session";

export function saveSession(session: PlayerSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): PlayerSession | null {
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function startSession(
  nickname: string,
  avatarSeed: string
): PlayerSession {
  const playerId = getOrCreatePlayerId();

  const session: PlayerSession = {
    playerId,
    nickname,
    avatarSeed,
  };

  saveSession(session);

  socket.emit("player:register", {
    playerId,
    nickname,
    avatarSeed,
  });

  return session;
}
