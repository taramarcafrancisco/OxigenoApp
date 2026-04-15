import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Dumbbell,
  Flame,
  ShieldCheck,
  Target,
} from "lucide-react";

import AppLayout from "../components/app/AppLayout";
import { RutinasApi } from "../api/RutinasApi";
import { Card } from "../components/ui/card";

function UsageContent() {
  const {
    data: routine,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-routine"],
    queryFn: RutinasApi.getMyRoutine,
  });

  const exercises = routine?.ejercicios ?? [];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.10),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              <Dumbbell className="h-4 w-4" />
              Mi rutina
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Rutina de entrenamiento
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Visualiza tu plan de trabajo actual, el enfoque de entrenamiento y
              el detalle de cada ejercicio en una sola pantalla.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                <Flame className="h-4 w-4 text-orange-400" />
                Ejercicios
              </div>
              <p className="text-2xl font-bold text-white">{exercises.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Nivel
              </div>
              <p className="text-2xl font-bold text-white">
                {routine?.nivel || "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 text-zinc-400">
          Cargando rutina...
        </Card>
      )}

      {isError && (
        <Card className="border-red-500/20 bg-red-500/10 p-6 text-red-200">
          No se pudo cargar la rutina: {String(error?.message || "Error")}
        </Card>
      )}

      {!isLoading && !isError && !routine && (
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
          <p className="text-lg font-semibold text-white">Sin rutina asignada</p>
          <p className="mt-2 text-sm text-zinc-400">
            Todavia no hay una rutina cargada para este usuario.
          </p>
        </Card>
      )}

      {!isLoading && !isError && routine && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">
                  Resumen de la rutina
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
                  <h3 className="text-2xl font-bold text-white">
                    {routine.nombre || "Rutina personalizada"}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    {routine.objetivo ||
                      "Rutina activa asignada para tu entrenamiento actual."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                    <p className="text-sm text-zinc-400">Nivel</p>
                    <p className="mt-1 text-lg font-semibold text-orange-300">
                      {routine.nivel || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                    <p className="text-sm text-zinc-400">Dias</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {routine.dias || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                    <p className="text-sm text-zinc-400">Ejercicios</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {exercises.length}
                    </p>
                  </div>
                </div>

                {routine.observaciones && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="mb-2 text-sm font-semibold text-white">
                      Observaciones
                    </p>
                    <p className="text-sm text-zinc-300">
                      {routine.observaciones}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">
                  Vista rapida
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Objetivo</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {routine.objetivo || "Sin objetivo cargado"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Frecuencia</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {routine.dias || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Carga actual</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {exercises.length} ejercicios planificados
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {exercises.length > 0 && (
            <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">
                  Detalle de ejercicios
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.idRutinaEjercicio || index}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {typeof exercise === "string"
                            ? exercise
                            : exercise.ejercicio}
                        </p>

                        {typeof exercise !== "string" && (
                          <div className="mt-3 space-y-1 text-sm text-zinc-400">
                            <p>Series: {exercise.series ?? "-"}</p>
                            <p>Repeticiones: {exercise.repeticiones ?? "-"}</p>
                            <p>Descanso: {exercise.descanso ?? "-"}</p>
                          </div>
                        )}
                      </div>

                      <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-xs text-orange-300">
                        #{exercise.orden ?? index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default function Usage() {
  return (
    <AppLayout>
      <UsageContent />
    </AppLayout>
  );
}
