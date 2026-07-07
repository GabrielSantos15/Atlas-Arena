"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Room } from "@/interfaces/Room";
import { getOrCreatePlayerId } from "@/lib/player";
import { getSession } from "@/lib/storage/player-session";
import {
  clearRoomSession,
  getRoomSession,
  saveRoomSession,
} from "@/lib/storage/room-session";
import socket from "@/lib/socket";

const categoryLabels = {
  geography: "Geografia",
} as const;

const modeLabels = {
  flags: "Bandeiras",
  capitals: "Capitais",
  continents: "Continentes",
} as const;

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const [playerId, setPlayerId] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");

  const roomCode = useMemo(() => {
    const code = params?.code;

    if (typeof code === "string" && code.trim()) {
      return code.toUpperCase();
    }

    return "";
  }, [params]);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace("/join");
      return;
    }

    const persisted = getRoomSession();
    setPlayerId(getOrCreatePlayerId());

    if (!roomCode && persisted?.code) {
      router.replace(`/room/${persisted.code}`);
      return;
    }

    if (!roomCode) {
      router.replace("/join");
      return;
    }

    saveRoomSession({
      code: roomCode,
    });

    function handleRoomUpdate(nextRoom: Room) {
      setRoom(nextRoom);
    }

    function handleError(payload: { message?: string }) {
      setError(payload.message ?? "Erro ao carregar sala.");
    }

    socket.on("room:update", handleRoomUpdate);
    socket.on("room:error", handleError);

    socket.emit("room:join", {
      roomCode,
      playerId: session.playerId,
    });

    return () => {
      socket.off("room:update", handleRoomUpdate);
      socket.off("room:error", handleError);
    };
  }, [roomCode, router]);

  return (
    <main className="min-h-screen bg-(--bg-primary) px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sala {roomCode || "-"}</h1>
            <p className="text-(--text-secondary)">
              Aguarde os jogadores entrarem.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              clearRoomSession();
              router.push("/");
            }}
            className="rounded-lg border border-(--border-color) px-4 py-2 text-sm"
          >
            Sair
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </p>
        ) : null}

        <section className="rounded-2xl border border-(--border-color) bg-(--bg-surface) p-6 shadow-lg">
          <div className="mb-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p>
              Categoria: <strong>{categoryLabels[room?.category ?? "geography"]}</strong>
            </p>
            <p>
              Modo: <strong>{room ? modeLabels[room.mode] : "-"}</strong>
            </p>
            <p>
              Visibilidade: <strong>{room?.isPublic ? "Pública" : "Privada"}</strong>
            </p>
            <p>
              Questões: <strong>{room?.questionsAmount ?? "-"}</strong>
            </p>
            <p>
              Tempo: <strong>{room?.questionTime ?? "-"}s</strong>
            </p>
          </div>

          <h2 className="mb-4 text-xl font-semibold">
            Jogadores ({room?.players.length ?? 0})
          </h2>

          <ul className="space-y-3">
            {(room?.players ?? []).map((player) => (
              <li
                key={player.playerId}
                className={`flex items-center gap-3 rounded-xl border border-(--border-color) p-3 ${playerId === player.playerId ? "bg-blue-50" : ""}`}
              >
                <img
                  src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${player.avatarSeed}`}
                  alt={player.nickname}
                  className="h-14 w-14 rounded-full"
                />

                <div className="flex-1">
                  <p className="font-semibold">{player.nickname}</p>

                  {room?.hostId === player.playerId ? (
                    <span className="text-xs text-blue-500">Host</span>
                  ) : null}
                </div>

                <span className={player.online ? "text-green-500" : "text-red-500"}>
                  ●
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
