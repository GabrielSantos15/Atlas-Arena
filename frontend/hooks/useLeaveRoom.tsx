"use client";

import { useCallback } from "react";
import socket from "@/lib/socket";
import { usePlayer } from "./usePlayer";
import { clearRoomSession } from "@/lib/storage/room-session";

export function useLeaveRoom() {
  const { session } = usePlayer();

  return useCallback(() => {
    if (!session) return;

    socket.emit("room:leave", {
      playerId: session.playerId,
    });

    clearRoomSession();
  }, [session]);
}