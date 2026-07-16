import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-start p-6 md:p-24 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/flat.png')" }}>
      <section className="flex w-full max-w-xl flex-col gap-8 relative z-10">
        
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tigh">
            Atlas Arena
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            De capitais a fronteiras. Desafie seus amigos em partidas
            simultâneas e descubra quem é o verdadeiro mestre do mapa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/create"
            className="flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full shadow-lg hover:bg-[var(--color-primary-hover)] hover:-translate-y-1 transition-all duration-200"
          >
            Começar uma Partida
          </Link>
          
          <Link
            href="/join"
            className="flex items-center justify-center px-8 py-4 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-full shadow-lg hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-1 transition-all duration-200"
          >
            Entrar em uma Sala
          </Link>
        </div>
        
      </section>
    </main>
  );
}