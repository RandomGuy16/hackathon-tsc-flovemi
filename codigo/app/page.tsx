export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Torneo de Vibecoding PUCP
      </h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Boilerplate listo. La lógica del reto se implementa dentro de{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
          codigo/
        </code>{" "}
        siguiendo Clean Architecture.
      </p>
    </main>
  );
}
