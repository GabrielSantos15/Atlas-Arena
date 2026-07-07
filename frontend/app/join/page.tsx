"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import FormUser from "@/components/setup/FormUser";
import type { PlayerSession } from "@/lib/storage/player-session";
import { saveRoomSession } from "@/lib/storage/room-session";
import socket from "@/lib/socket";

interface RoomResponse {
	code: string;
}

export default function JoinRoom() {
	const router = useRouter();
	const [roomCode, setRoomCode] = useState("");
	const [error, setError] = useState("");

	function handleJoin(session: PlayerSession) {
		const normalizedCode = roomCode.trim().toUpperCase();

		if (!normalizedCode) {
			setError("Digite o codigo da sala para entrar.");
			return;
		}

		setError("");

		socket.off("room:joined");
		socket.off("room:error");

		socket.once("room:joined", (room: RoomResponse) => {
			saveRoomSession({ code: room.code });
			router.push(`/room/${room.code}`);
		});

		socket.once("room:error", (payload: { message?: string }) => {
			setError(payload?.message ?? "Nao foi possivel entrar na sala.");
		});

		socket.emit("room:join", {
			roomCode: normalizedCode,
			playerId: session.playerId,
		});
	}

	return (
		<main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
			<section className="w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 shadow-lg">
				<header className="mb-8">
					<h1 className="text-3xl font-bold">Entrar na Sala</h1>
					<p className="mt-2 text-[var(--text-secondary)]">
						Informe seu nickname e o codigo de uma sala existente.
					</p>
				</header>

				<label className="mb-6 block">
					<span className="mb-2 block text-sm text-[var(--text-secondary)]">
						Codigo da sala
					</span>
					<input
						value={roomCode}
						onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
						placeholder="Ex: ABC123"
						maxLength={6}
						className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] p-3 uppercase outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>

				{error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

				<FormUser mode="join" onSubmit={handleJoin} />
			</section>
		</main>
	);
}
