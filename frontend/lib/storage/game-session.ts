import socket from "../socket";

type StartGamePayload = {
  roomCode: string;
  playerId: string;
};

export function startGame({ roomCode, playerId }: StartGamePayload) {
  socket.emit("game:start", {
    roomCode,
    playerId,
  });
}
