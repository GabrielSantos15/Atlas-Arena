"use client";

import { useLeaveRoom } from "@/hooks/useLeaveRoom";

export default function RoomLifecycle() {
  useLeaveRoom();

  return null;
}