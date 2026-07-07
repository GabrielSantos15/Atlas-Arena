"use client";

import { useState } from "react";

import {
  startSession,
  type PlayerSession,
} from "@/lib/storage/player-session";

interface FormUserProps {
  mode: "create" | "join";
  loading?: boolean;
  onSubmit: (session: PlayerSession) => void;
}

export default function FormUser({
  mode,
  loading = false,
  onSubmit,
}: FormUserProps) {
  const [nick, setNick] = useState("");

  const [avatarSeed, setAvatarSeed] = useState(() =>
    crypto.randomUUID()
  );

  function handleSubmit() {
    if (!nick.trim() || loading) return;

    const session = startSession(
      nick.trim(),
      avatarSeed
    );

    onSubmit(session);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <img
        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarSeed}`}
        alt="Avatar"
        className="w-32 h-32 rounded-full border border-[var(--border-color)]"
      />

      <button
        type="button"
        onClick={() =>
          setAvatarSeed(crypto.randomUUID())
        }
        className="text-sm text-blue-500 hover:underline"
      >
        Sortear avatar
      </button>

      <input
        value={nick}
        onChange={(e) =>
          setNick(e.target.value)
        }
        placeholder="Seu nickname"
        maxLength={20}
        className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!nick.trim() || loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Aguardando..."
          : mode === "create"
            ? "Criar sala"
            : "Entrar na sala"}
      </button>
    </div>
  );
}