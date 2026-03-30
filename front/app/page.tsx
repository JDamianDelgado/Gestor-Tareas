import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="px-6 pt-8 pb-6 md:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(47,107,255,0.25)]">
              GT
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
                Gestor
              </p>
              <p className="text-lg font-semibold">Tareas Claras</p>
            </div>
          </div>
          <Link
            href="/gestor"
            className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(28,26,25,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(28,26,25,0.12)]"
          >
            Ir al tablero
          </Link>
        </div>
      </header>

      <main className="px-6 pb-20 md:px-12 lg:px-20">
        <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Ordena tu día con un gestor que se siente ligero, rápido y humano.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              Convierte ideas en acciones. Visualiza tareas en segundos, divide
              lo complejo en pasos claros y celebra cada avance con claridad.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/gestor"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(47,107,255,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Pruebalo
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 pt-6 text-sm text-[var(--muted)]">
              <div>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  3 estados
                </p>
                <p>controlados</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  1 panel
                </p>
                <p>sin ruido</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  0 fricción
                </p>
                <p>para arrancar</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-40 w-40 rounded-full bg-orange-300/40 blur-3xl" />
            <div className="relative space-y-4 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(28,26,25,0.12)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  Tablero de hoy
                </p>
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  08:00 - 18:00
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "Preparar propuesta",
                    desc: "Diseño y tiempos finales",
                    status: "En progreso",
                  },
                  {
                    title: "Revisión con equipo",
                    desc: "Compartir avances",
                    status: "Pendiente",
                  },
                  {
                    title: "Entrega final",
                    desc: "Enviar al cliente",
                    status: "Finalizado",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[var(--background)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-[var(--muted)]">
                <div className="rounded-2xl bg-white py-3 shadow-sm">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    6
                  </p>
                  <p>Pendientes</p>
                </div>
                <div className="rounded-2xl bg-white py-3 shadow-sm">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    3
                  </p>
                  <p>En curso</p>
                </div>
                <div className="rounded-2xl bg-white py-3 shadow-sm">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    12
                  </p>
                  <p>Finalizadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 grid w-full max-w-6xl gap-6 rounded-3xl border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(28,26,25,0.08)] md:grid-cols-3">
          {[
            {
              title: "Prioriza sin estrés",
              desc: "Visualiza lo importante y asigna energía a lo que mueve la aguja.",
            },
            {
              title: "Claridad inmediata",
              desc: "Estados simples: pendiente, completado y finalizado.",
            },
            {
              title: "Ritmo constante",
              desc: "Tu avance queda visible y eso se siente bien.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-16 grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(28,26,25,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              Tecnologias{" "}
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Una vista, tres tecnologias.
            </h2>
            <p className="mt-4 text-sm text-[var(--muted)]">
              El tablero se realiza con diferentes tecnologías, cada una elegida
              para aportar simplicidad y velocidad.
            </p>
            <div className="mt-6 space-y-4 text-sm text-[var(--muted)]">
              {[
                "Captura la tarea en segundos.",
                "Disenos claros y sencillos.",
                "Velocidad y eficiencia.",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Backend ligero",
                desc: "Se usa python por su simplicidad.",
                color: "bg-red-200 text-orange-700",
              },
              {
                title: "Frontend ágil",
                desc: "Next.js y Tailwind para una experiencia fluida.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                title: "Diseño funcional",
                desc: "Con Tailwind, cada componente es claro y directo.",
                color: "bg-violet-100 text-violet-700",
              },
              {
                title: "Base de datos confiable",
                desc: "PostgreSQL con supabase para datos seguros y rápidos.",
                color: "bg-emerald-100 text-emerald-700",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}
                >
                  {item.title}
                </span>
                <p className="mt-4 text-sm text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
