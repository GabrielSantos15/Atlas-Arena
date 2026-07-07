import { getOrCreatePlayerId } from "@/lib/player";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Quiz Multiplayer</h1>

      <p className="text-lg ">
        Teste seus conhecimentos e desafie seus amigos em tempo real!
      </p>
      <div className="flex gap-2">
        <Link
          href="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Criar
        </Link>
        <Link
          href="/join"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
