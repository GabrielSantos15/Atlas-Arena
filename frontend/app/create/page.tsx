"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PlayerSession } from "@/lib/storage/player-session";
import { saveRoomSession } from "@/lib/storage/room-session";
import socket from "@/lib/socket";
import FormUser from "@/components/setup/FormUser";

type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";

type Difficulty = "easy" | "medium" | "hard";

interface RoomResponse {
  code: string;
}

const operations = [
  {
    value: "addition",
    label: "Adição",
    icon: "+",
  },
  {
    value: "subtraction",
    label: "Subtração",
    icon: "-",
  },
  {
    value: "multiplication",
    label: "Multiplicação",
    icon: "×",
  },
  {
    value: "division",
    label: "Divisão",
    icon: "÷",
  },
] as const;

export default function CreateRoom() {
  const router = useRouter();

  const [operation, setOperation] =
    useState<Operation>("addition");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

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
      operation,
      difficulty,
      questionsAmount,
      questionTime,
    });
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6 py-10">

      <section className="
        w-full max-w-xl
        rounded-3xl
        bg-[var(--bg-surface)]
        border border-[var(--border-color)]
        p-8
        shadow-xl
      ">

        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Criar Sala 🎮
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Configure sua partida e escolha seu perfil.
          </p>
        </header>

        <div className="space-y-5 mb-8">
          {/* Operação */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Operação
            </label>

            <div className="grid grid-cols-2 gap-3">
              {operations.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setOperation(item.value)
                  }
                  className={`
                    rounded-xl border p-4
                    transition
                    ${operation === item.value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-[var(--border-color)] hover:bg-black/5"
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
          {/* Dificuldade */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Dificuldade
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as Difficulty
                )
              }
              className="
                w-full rounded-xl
                border border-[var(--border-color)]
                bg-[var(--background)]
                p-3
                outline-none
                focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="easy">
                Fácil
              </option>
              <option value="medium">
                Médio
              </option>
              <option value="hard">
                Difícil
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
                  border border-[var(--border-color)]
                  bg-[var(--background)]
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
                  border border-[var(--border-color)]
                  bg-[var(--background)]
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

        <div className="border-t border-[var(--border-color)] pt-6">
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