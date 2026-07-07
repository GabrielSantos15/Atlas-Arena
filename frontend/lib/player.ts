const PLAYER_ID_KEY = "quiz:player-id";

export function getOrCreatePlayerId(): string {
  const existingPlayerId = sessionStorage.getItem(PLAYER_ID_KEY);

  if (existingPlayerId) {
    return existingPlayerId;
  }

  const newPlayerId = crypto.randomUUID();

  sessionStorage.setItem(PLAYER_ID_KEY, newPlayerId);

  return newPlayerId;
}