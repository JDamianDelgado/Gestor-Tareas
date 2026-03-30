import { useMemo, useState } from "react";
import { Task } from "../gestor/page";

interface Props {
  tareas: Task[];
  onCompletar: (id: number) => void;
  onFinalizar: (id: number) => void;
  onEliminar: (id: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  completado: "Completado",
  pendiente: "Pendiente",
  finalizado: "Finalizado",
};

const STATUS_STYLES: Record<string, string> = {
  completado: "bg-blue-100 text-blue-700",
  pendiente: "bg-orange-100 text-orange-700",
  finalizado: "bg-emerald-100 text-emerald-700",
};

export function CardTareas({
  tareas,
  onCompletar,
  onFinalizar,
  onEliminar,
}: Props) {
  const [seeMore, setSeeMore] = useState<string>("pendiente");

  const grupos = useMemo(() => {
    return {
      completado: tareas.filter((task) => task.estado === "completado"),
      pendiente: tareas.filter((task) => task.estado === "pendiente"),
      finalizado: tareas.filter((task) => task.estado === "finalizado"),
    };
  }, [tareas]);

  const listado = grupos[seeMore as keyof typeof grupos] ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {(["pendiente", "completado", "finalizado"] as const).map((estado) => (
          <button
            key={estado}
            onClick={() => setSeeMore(estado)}
            className={`flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
              seeMore === estado ? "ring-2 ring-[var(--ring)]" : ""
            }`}
          >
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[estado]}`}
            >
              {STATUS_LABELS[estado]}
            </span>
            <p className="text-3xl font-semibold text-[var(--foreground)]">
              {grupos[estado].length}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {estado === "pendiente"
                ? "Por organizar"
                : estado === "completado"
                  ? "En progreso"
                  : "Cerradas"}
            </p>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Detalle
            </p>
            <h3 className="mt-2 text-2xl font-semibold">
              {STATUS_LABELS[seeMore]}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[seeMore]}`}
          >
            {listado.length} tareas
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {listado.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-[var(--background)] px-4 py-6 text-sm text-[var(--muted)]">
              Todavía no hay tareas en este estado.
            </div>
          ) : (
            listado.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-[var(--background)] px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {task.title}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {task.crateAt ? `Creada: ${task.crateAt}` : "Sin fecha"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {task.estado !== "completado" ? (
                    <button
                      onClick={() => onCompletar(task.id)}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5"
                    >
                      Marcar completado
                    </button>
                  ) : null}
                  {task.estado !== "finalizado" ? (
                    <button
                      onClick={() => onFinalizar(task.id)}
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      Finalizar
                    </button>
                  ) : null}
                  {task.estado === "finalizado" ? (
                    <button
                      onClick={() => onEliminar(task.id)}
                      className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      Eliminar
                    </button>
                  ) : null}
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
                    {STATUS_LABELS[task.estado] ?? task.estado}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
