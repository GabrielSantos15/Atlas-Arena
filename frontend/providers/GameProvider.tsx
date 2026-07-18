"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import socket from "@/lib/socket";
import { usePlayer } from "@/hooks/usePlayer";
import { getRoomSession, clearRoomSession, RoomSession } from "@/lib/storage/room-session";
import { usePathname, useRouter } from "next/navigation";
import { sortPlayersForRanking } from "@/lib/ranking";

import type { Room } from "@/interfaces/Room";
import type { PublicQuestion, QuestionResult } from "@/interfaces/Game";
import type { Player } from "@/interfaces/Player";

type GameContextData = {
  room: Room | null;

  currentQuestion: PublicQuestion | null;
  questionIndex: number | null;
  totalQuestions: number | null;

  result: QuestionResult | null;
  ranking: Player[];

  gameEnded: boolean;

  answered: boolean;
  selectedAnswer: string | null;

  timeLeft: number;

  answer(option: string): void;
};

const GameContext = createContext({} as GameContextData);

export function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, ready } = usePlayer();
  const router = useRouter();

  const [roomSession, setRoomSession] =
    useState<RoomSession | null>(null);


  useEffect(() => {
    setRoomSession(getRoomSession());
  }, []);

  const intervalRef = useRef<number | null>(null);

  // Room
  const [room, setRoom] = useState<Room | null>(null);

  // Question
  const [currentQuestion, setCurrentQuestion] =
    useState<PublicQuestion | null>(null);
  const [questionIndex, setQuestionIndex] =
    useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] =
    useState<number | null>(null);


  // Answer
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);
  const [answered, setAnswered] =
    useState(false);

  // Result
  const [result, setResult] =
    useState<QuestionResult | null>(null);
  const gameEnded = room?.status === "finished";

  // Timer
  const [timeLeft, setTimeLeft] =
    useState(0);

  const ranking = useMemo(
    () => sortPlayersForRanking(room?.players ?? []),
    [room?.players]
  );

  const resetGameState = useCallback(() => {
    setCurrentQuestion(null);
    setQuestionIndex(null);
    setTotalQuestions(null);

    setSelectedAnswer(null);
    setAnswered(false);

    setResult(null);

    setTimeLeft(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);


  const pathname = usePathname();

  // redireciona para paginas de acordo com status
  useEffect(() => {
    if (!room) return;

    const lobbyPath = `/room/${room.code}`;
    const gamePath = `/room/${room.code}/game`;

    if (room.status === "waiting") {
      if (pathname !== lobbyPath) {
        router.replace(lobbyPath);
      }

      return;
    }

    if (pathname !== gamePath) {
      router.replace(gamePath);
    }
  }, [room, pathname, router]);

  //sa
  useEffect(() => {
    setRoomSession(getRoomSession())
  }, [pathname]);
    useEffect(() => {
    if (!room) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      // Necessário para o Chrome exibir o alerta
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [room]);

  useEffect(() => {
    if (!ready || !session || !roomSession) {
      return;
    }

    console.log("JOIN vindo do GameProvider");
    socket.emit("room:join", {
      roomCode: roomSession.code,
      playerId: session.playerId,
    });

    function onRoomUpdate(room: Room) {
      setRoom(room);

      if (room.status !== "playing") {
        setCurrentQuestion(null);
        setResult(null);
        setAnswered(false);
        setSelectedAnswer(null);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setTimeLeft(0);
      }
    }

    function onQuestion(payload: {
      question: PublicQuestion;
      questionIndex: number;
      totalQuestions: number;
      timeLimit: number;
    }) {
      setResult(null);

      setCurrentQuestion(payload.question);
      setQuestionIndex(payload.questionIndex);
      setTotalQuestions(payload.totalQuestions);

      setAnswered(false);
      setSelectedAnswer(null);

      const deadline =
        Date.now() + payload.timeLimit * 1000;

      setTimeLeft(payload.timeLimit);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = window.setInterval(() => {
        const left = Math.max(
          0,
          Math.ceil(
            (deadline - Date.now()) / 1000
          )
        );

        setTimeLeft(left);

        if (left <= 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 250);
    }

    function onResult(result: QuestionResult) {
      setCurrentQuestion(null);
      setResult(result);
    }

    function onRestart() {
      resetGameState();
    }

    function onRoomError(data: { message: string }) {
      if (data.message === "Sala não encontrada.") {
        clearRoomSession();
        router.replace("/");
      }
    }

    socket.on("room:update", onRoomUpdate);
    socket.on("room:joined", onRoomUpdate);
    socket.on("room:restart", onRestart);
    socket.on("room:error", onRoomError);

    socket.on("game:question", onQuestion);
    socket.on("game:question-result", onResult);

    return () => {
      socket.off("room:update", onRoomUpdate);
      socket.off("room:joined", onRoomUpdate);
      socket.off("room:restart", onRestart);
      socket.off("room:error", onRoomError);

      socket.off("game:question", onQuestion);
      socket.off("game:question-result", onResult);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    ready,
    session,
    roomSession,
    resetGameState,
    router,
  ]);

  const answer = useCallback(
    (option: string) => {
      if (
        !session ||
        !roomSession ||
        answered ||
        questionIndex === null
      ) {
        return;
      }

      setAnswered(true);
      setSelectedAnswer(option);

      socket.emit("game:answer", {
        roomCode: roomSession.code,
        playerId: session.playerId,
        answer: option,
        questionIndex,
      });
    },
    [
      session,
      roomSession,
      answered,
      questionIndex,
    ]
  );

  return (
    <GameContext.Provider
      value={{
        room,

        currentQuestion,
        questionIndex,
        totalQuestions,

        result,
        ranking,

        answered,
        selectedAnswer,

        timeLeft,

        answer,

        gameEnded,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}