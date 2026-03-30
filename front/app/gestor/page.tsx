"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CardTareas } from "../components/cardTareas";

export interface Task {
  id: number;
  estado: string;
  crateAt: string;
  title: string;
  description?: string | null;
}

export default function GestorPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estado, setEstado] = useState<Task["estado"]>("pendiente");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_DATOS}/tasks/`,
        );
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const resumen = useMemo(() => {
    const pendiente = tasks.filter((task) => task.estado === "pendiente").length;
    const completado = tasks.filter(
      (task) => task.estado === "completado",
    ).length;
    const finalizado = tasks.filter(
      (task) => task.estado === "finalizado",
    ).length;
    return { pendiente, completado, finalizado };
  }, [tasks]);

  const actualizarEstado = async (id: number, nuevoEstado: Task["estado"]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_DATOS}/tasks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );
      if (!response.ok) {
        throw new Error("No se pudo actualizar la tarea.");
      }
      const updated = (await response.json()) as Task;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado al actualizar.",
      );
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_DATOS}/tasks/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error("No se pudo eliminar la tarea.");
      }
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado al eliminar.",
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_DATOS}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            estado,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("No se pudo guardar la tarea.");
      }
      const nueva = (await response.json()) as Task;
      setTasks((prev) => [nueva, ...prev]);
      setTitle("");
      setDescription("");
      setEstado("pendiente");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado al guardar.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-10 md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              Panel principal
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Gestor de tareas
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Organiza tu día con estados claros y una vista ligera.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
          >
            Volver al inicio
          </Link>
        </header>

        <section className="grid gap-4 rounded-3xl border border-black/5 bg-white/80 p-6 shadow-[0_18px_50px_rgba(28,26,25,0.08)] md:grid-cols-3">
          {[
            {
              label: "Pendientes",
              value: resumen.pendiente,
              tone: "text-orange-600",
            },
            {
              label: "Completadas",
              value: resumen.completado,
              tone: "text-blue-600",
            },
            {
              label: "Finalizadas",
              value: resumen.finalizado,
              tone: "text-emerald-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-black/5 bg-white px-4 py-5 text-center shadow-sm"
            >
              <p className={`text-3xl font-semibold ${item.tone}`}>
                {item.value}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
                Nueva tarea
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Crea una tarea rápida
              </h2>
            </div>
            <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              Estado inicial: {estado}
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-semibold">Título</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej: Preparar presentación"
                className="w-full rounded-2xl border border-black/10 bg-[var(--background)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-semibold">Estado</label>
              <select
                value={estado}
                onChange={(event) =>
                  setEstado(event.target.value as Task["estado"])
                }
                className="w-full rounded-2xl border border-black/10 bg-[var(--background)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Descripción</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Detalles clave, tiempos o notas..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-black/10 bg-[var(--background)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600 md:col-span-2">{error}</p>
            ) : null}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(47,107,255,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Guardando..." : "Crear tarea"}
              </button>
            </div>
          </form>
        </section>

        <CardTareas
          tareas={tasks}
          onCompletar={(id) => actualizarEstado(id, "completado")}
          onFinalizar={(id) => actualizarEstado(id, "finalizado")}
          onEliminar={eliminarTarea}
        />
      </div>
    </div>
  );
}
