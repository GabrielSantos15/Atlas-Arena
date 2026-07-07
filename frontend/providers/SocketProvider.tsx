"use client";

import { useEffect, useState, type ReactNode } from "react";

import socket from "@/lib/socket";
import { getOrCreatePlayerId } from "@/lib/player";
import { getSession } from "@/lib/storage/player-session";

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({
  children,
}: SocketProviderProps) {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    getOrCreatePlayerId();
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id ?? "");

      const session = getSession();

      // re-registra o jogador ao conectar/reconectar para manter o lobby consistente
      if (session) {
        socket.emit("player:register", {
          playerId: session.playerId,
          nickname: session.nickname,
          avatarSeed: session.avatarSeed,
        });
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId("");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}