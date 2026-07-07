"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PlayerSession } from "@/lib/storage/player-session";
import { saveRoomSession } from "@/lib/storage/room-session";
import socket from "@/lib/socket";
import FormUser from "@/components/setup/FormUser";

type GeographyMode = "flags" | "capitals" | "continents";

interface RoomResponse {
  code: string;
}

const geographyModes = [
  {
    value: "flags",
    label: "Bandeiras",
    icon: "🏳️",
  },
  {
    value: "capitals",
    label: "Capitais",
    icon: "🏛️",
  },
  {
    value: "continents",
    label: "Continentes",
    icon: "🌍",
  },
] as const;

export default function CreateRoom() {
  const router = useRouter();

  const [mode, setMode] =
    useState<GeographyMode>("flags");

  const [isPublic, setIsPublic] =
    useState(true);

  const [questionsAmount, setQuestionsAmount] =
    useState(10);

  const [questionTime, setQuestionTime] =
    useState(15);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  function handlePlayerCreated(session: PlayerSession) {
    setError("");
    setLoading(true);

    socket.once("room:created", (room: RoomResponse) => {
      saveRoomSession({
        code: room.code,
      });

      router.push(`/room/${room.code}`);
    });


    socket.once("room:error", (payload: { message?: string }) => {
      setLoading(false);

      setError(
        payload.message ??
        "Não foi possível criar a sala."
      );
    });


    socket.emit("room:create", {
      hostId: session.playerId,
      category: "geography",
      mode,
      isPublic,
      questionsAmount,
      questionTime,
    });
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6 py-10">

      <section className="
        w-full max-w-xl
        rounded-3xl
        bg-(--bg-surface)
        border border-(--border-color)
        p-8
        shadow-xl
      ">

        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Criar Sala 🎮
          </h1>

          <p className="mt-2 text-sm text-(--text-secondary)">
            Configure sua partida e escolha seu perfil.
          </p>
        </header>

        <div className="space-y-5 mb-8">
          {/* Modo */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Modo de geografia
            </label>

            <div className="grid grid-cols-2 gap-3">
              {geographyModes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setMode(item.value)
                  }
                  className={`
                    rounded-xl border p-4
                    transition
                    ${mode === item.value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-(--border-color) hover:bg-black/5"
                    }
                  `}
                >
                  <span className="text-2xl font-bold">
                    {item.icon}
                  </span>
                  <p className="text-sm mt-1">
                    {item.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Visibilidade da sala
            </label>

            <select
              value={isPublic ? "public" : "private"}
              onChange={(event) =>
                setIsPublic(event.target.value === "public")
              }
              className="
                w-full rounded-xl
                border border-(--border-color)
                bg-(--background)
                p-3
                outline-none
                focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="public">
                Pública
              </option>
              <option value="private">
                Privada
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantidade */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Questões
              </label>

              <select
                value={questionsAmount}
                onChange={(e) =>
                  setQuestionsAmount(
                    Number(e.target.value)
                  )
                }
                className="
                  w-full rounded-xl
                  border border-(--border-color)
                  bg-(--background)
                  p-3
                "
              >
                <option value={5}>
                  5
                </option>
                <option value={10}>
                  10
                </option>
                <option value={20}>
                  20
                </option>
              </select>
            </div>

            {/* Tempo */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Tempo
              </label>

              <select
                value={questionTime}
                onChange={(e) =>
                  setQuestionTime(
                    Number(e.target.value)
                  )
                }
                className="
                  w-full rounded-xl
                  border border-(--border-color)
                  bg-(--background)
                  p-3
                "
              >
                <option value={10}>
                  10s
                </option>
                <option value={15}>
                  15s
                </option>
                <option value={30}>
                  30s
                </option>

              </select>
            </div>
          </div>
        </div>

        {error && (
          <p className="
            mb-5
            rounded-lg
            bg-red-500/10
            p-3
            text-sm
            text-red-500
          ">
            {error}
          </p>
        )}

        <div className="border-t border-(--border-color) pt-6">
          <h2 className="mb-5 text-lg font-semibold">
            Seu jogador
          </h2>

          <FormUser
            mode="create"
            onSubmit={handlePlayerCreated}
            loading={loading}
          />
        </div>
      </section>
    </main>
  );
}