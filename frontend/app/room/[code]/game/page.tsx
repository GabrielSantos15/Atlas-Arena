"use client";

import { useGame } from "@/providers/GameProvider";

import Quiz from "@/components/game/Quiz";
import Timer from "@/components/game/Timer";
import Ranking from "@/components/game/Ranking";
import QuestionResultPage from "@/components/game/QuestionResultPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GameEndedPage from "@/components/game/GameEndedPage";
import socket from "@/lib/socket";
import { getOrCreatePlayerId } from "@/lib/player";

export default function GamePage() {
    const {
        room,
        result,
        currentQuestion,
        questionIndex,
        totalQuestions,
        timeLeft,
        ranking,
        gameEnded,
    } = useGame();
    const router = useRouter()

    useEffect(() => {
        if (!room) { router.replace("/join"); }
        if (room?.status == "waiting") router.replace(`/room/${room.code}`)
    }, [room, router]);


    if (!room) {
        return null;
    }

    if (gameEnded) {
        return (
            <GameEndedPage
                ranking={ranking}
                onPlayAgain={() => socket.emit("room:restart", {
                    roomCode: room.code,
                    playerId: getOrCreatePlayerId(),
                })}
                onBack={() => router.push(`/`)}
            />
        );
    }

    return (
        <div className="w-full max-w-[1500px] p-4 md:p-8 m-auto">
            <div className="bg-[var(--bg-secondary)] h-2 w-full m-auto rounded-full overflow-hidden">
                {questionIndex != null && totalQuestions != null && (
                    <div
                        className="bg-[var(--color-primary)] h-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                )}
            </div>
            <div className="grid min-h-screen w-full grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_2fr_1fr]">
                <aside className="order-last hidden flex-col gap-6 self-start pt-4 md:order-first md:flex">
                    <div>
                        <h1 className="text-2xl font-bold drop-shadow-sm">
                            Sala {room.code}
                        </h1>
                        {currentQuestion && (
                            <p className="text-sm font-medium text-[var(--text-secondary)]">
                                Pergunta {(questionIndex ?? 0) + 1} de {totalQuestions}
                            </p>
                        )}
                    </div>
                    <Ranking ranking={ranking} />
                </aside>
                <main className="order-2 flex w-full max-w-3xl flex-col self-start justify-self-center">
                    {result ? (
                        <QuestionResultPage result={result} />
                    ) : (
                        <Quiz />
                    )}
                </main>
                <div className="order-first flex flex-col items-end gap-4 self-start pt-4 md:order-last">
                    {currentQuestion && (
                        <Timer
                            timeLeft={timeLeft}
                            timeLimit={room?.questionTime}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}