"use client";

import { useEffect, useState, type ReactNode } from "react";

import socket from "@/lib/socket";

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({
  children,
}: SocketProviderProps) {
  const [connected, setConnected] = useState(false)
  const [socketId, setSocketId] = useState<String>()

  useEffect(() => {

    socket.connect();

    socket.on("connect", () => {
      setConnected(true)
      setSocketId(socket.id ?? "");
    });

    socket.on("disconnect", (reason) => {
      setConnected(false)
      console.log("❌ Desconectado:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", top: 10, right: 10 }}>
        <p>Status: {connected ? "🟢 conectado" : "🔴 desconectado"}</p>
        <p>ID: {socketId}</p>
      </div>

      {children}
    </>
  );
}