"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Room } from "@/interfaces/Room";

import { getSession } from "@/lib/storage/player-session";
import {
    clearRoomSession,
    getRoomSession,
    saveRoomSession,
} from "@/lib/storage/room-session";

import socket from "@/lib/socket";
import { getOrCreatePlayerId } from "@/lib/player";


export default function RoomPage() {
    const router = useRouter();
    const params = useParams<{ code: string }>();
    const [idUser, setIdUser] = useState<string>("");
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

        setIdUser(getOrCreatePlayerId)

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

        function handleError(payload: {
            message?: string;
        }) {
            setError(
                payload.message ??
                "Erro ao carregar sala."
            );
        }

        socket.on(
            "room:update",
            handleRoomUpdate
        );

        socket.on(
            "room:error",
            handleError
        );

        socket.emit(
            "room:join",
            {
                roomCode,
                playerId: session.playerId,
            }
        );

        return () => {
            socket.off(
                "room:update",
                handleRoomUpdate
            );

            socket.off(
                "room:error",
                handleError
            );
        };
    }, [roomCode, router]);

    return (
        <div>
            <div className=" mb-6 flex items-center justify-between ">
                <div>
                    <h1 className="text-3xl font-bold">
                        Sala {roomCode || "-"}
                    </h1>

                    <p className="text-[var(--text-secondary)]">
                        Aguarde os jogadores entrarem.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        clearRoomSession();
                        router.push("/");
                    }}
                    className="
            rounded-lg
            border
            border-[var(--border-color)]
            px-4
            py-2
            text-sm
          "
                >
                    Sair
                </button>

            </div>

            {error && (
                <p className="
          mb-4
          rounded-lg
          bg-red-500/10
          p-3
          text-sm
          text-red-500
        ">
                    {error}
                </p>

            )}

            <section className="
        rounded-2xl
        border
        border-[var(--border-color)]
        bg-[var(--bg-surface)]
        p-6
      ">

                <div className="mb-6 space-y-1">
                    <p className="text-sm">
                        Operação:{" "}
                        <strong>
                            {room?.operation ?? "-"}
                        </strong>
                    </p>

                    <p className="text-sm">
                        Dificuldade:{" "}
                        <strong>
                            {room?.difficulty ?? "-"}
                        </strong>
                    </p>

                    <p className="text-sm">
                        Questões:{" "}
                        <strong>
                            {room?.questionsAmount ?? "-"}
                        </strong>
                    </p>

                    <p className="text-sm">
                        Tempo:{" "}
                        <strong>
                            {room?.questionTime ?? "-"}s
                        </strong>
                    </p>
                </div>

                <h2 className="mb-4 text-xl font-semibold">
                    Jogadores ({room?.players.length ?? 0})
                </h2>

                <ul className="space-y-3">
                    {(room?.players ?? []).map((player) => (

                        <li
                            key={player.playerId}
                            className={`flex items-center gap-3 rounded-xl border border-[var(--border-color)] p-3 ${idUser === player.playerId ? "bg-blue-50" : ""}`}
                        >
                            <img
                                src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${player.avatarSeed}`}
                                alt={player.nickname}
                                className="h-17 w-17 rounded-full" />

                            <div>
                                <p className="font-semibold">
                                    {player.nickname}
                                </p>

                                {room?.hostId === player.playerId && (
                                    <span className="text-xs text-blue-500">
                                        Host
                                    </span>
                                )}
                            </div>
                            {player.online ?
                                <span className="text-5xl text-green-500">
                                    •
                                </span> : <span className="text-5xl text-red-500">
                                    •
                                </span>
                            }
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}