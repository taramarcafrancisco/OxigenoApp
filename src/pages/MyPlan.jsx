import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  Flame,
  Mail,
  Phone,
  ShieldCheck,
  Target,
} from "lucide-react";

import AppLayout from "../components/app/AppLayout";
import { PlansApi } from "../api/PlansApi";
import { RutinasApi } from "../api/RutinasApi";
import { UsersApi } from "../api/users";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-AR");
}

function getDaysRemaining(value) {
  if (!value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(value);
  if (Number.isNaN(end.getTime())) return null;
  end.setHours(0, 0, 0, 0);

  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
}

function MyPlanContent() {
  const {
    data: user,
    isLoading: loadingUser,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: UsersApi.me,
  });

  const {
    data: plans = [],
    isLoading: loadingPlans,
    isError: isPlansError,
    error: plansError,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: PlansApi.list,
  });

  const {
    data: routine,
    isLoading: loadingRoutine,
    isError: isRoutineError,
    error: routineError,
  } = useQuery({
    queryKey: ["my-routine"],
    queryFn: RutinasApi.getMyRoutine,
  });

  const assignedPlans = useMemo(() => {
    if (!user?.planes?.length) return [];

    return user.planes.map((userPlan) => {
      const planId =
        userPlan?.idPlan ??
        userPlan?.plan?.idPlan ??
        userPlan?.plan?.idPLan ??
        userPlan?.plan?.idplan ??
        userPlan?.id;

      const fullPlan = plans.find(
        (plan) => String(plan.idPlan ?? plan.idPLan ?? plan.idplan) === String(planId)
      );

      const endDate = userPlan?.fechaFin ?? null;
      const remainingDays = getDaysRemaining(endDate);
      const expired = remainingDays !== null && remainingDays < 0;

      return {
        id: userPlan?.id ?? planId,
        nombre:
          userPlan?.nombre ||
          userPlan?.plan?.nombre ||
          fullPlan?.nombre ||
          "Plan sin nombre",
        descripcion:
          fullPlan?.descripcion ??
          userPlan?.descripcion ??
          "Plan asignado a tu cuenta",
        precio: fullPlan?.precio ?? userPlan?.precio ?? 0,
        consultas: fullPlan?.consultas ?? userPlan?.consultas ?? 0,
        activo: (userPlan?.activo ?? true) && !expired,
        fechaInicio: userPlan?.fechaInicio ?? null,
        fechaFin: endDate,
        remainingDays,
      };
    });
  }, [plans, user]);

  const currentPlan = useMemo(() => {
    if (!assignedPlans.length) return null;

    const activePlans = assignedPlans.filter((plan) => plan.activo);
    const source = activePlans.length ? activePlans : assignedPlans;

    return [...source].sort((a, b) => {
      const aTime = a.fechaFin ? new Date(a.fechaFin).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.fechaFin ? new Date(b.fechaFin).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })[0];
  }, [assignedPlans]);

  const exercises = routine?.ejercicios ?? [];
  const firstName =
    user?.nombre?.trim()?.split(/\s+/)?.[0] ||
    user?.full_name?.trim()?.split(/\s+/)?.[0] ||
    user?.email ||
    "Alumno";

  const isLoading = loadingUser || loadingPlans;
  const isError = isUserError || isPlansError;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="border-orange-500/10 bg-zinc-950 p-6">
          <p className="text-zinc-400">Cargando tu informacion...</p>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="border-red-500/20 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">Error cargando tu plan</p>
          <p className="mt-1 text-sm text-red-200">
            {String(userError?.message || plansError?.message || "Error desconocido")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.10),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              <Dumbbell className="h-4 w-4" />
              Mi progreso
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Hola, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Aca tenes tu plan asignado, el detalle de tu rutina actual y datos
              clave para seguir tu entrenamiento de forma clara.
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
                Estado
              </div>
              <p className="text-2xl font-bold text-white">
                {currentPlan?.activo ? "Activo" : "Sin plan"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {(isRoutineError || routineError) && (
        <Card className="border-red-500/20 bg-red-500/10 p-4 text-red-200">
          No se pudo cargar tu rutina: {routineError?.message || "Error"}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Plan asignado</h2>
          </div>

          {!currentPlan ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
              <p className="text-lg font-semibold text-white">Sin plan asignado</p>
              <p className="mt-2 text-sm text-zinc-400">
                Todavia no tenes una membresia activa cargada en el sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-orange-500/10 bg-gradient-to-r from-zinc-900 to-zinc-950 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-2xl font-bold text-white">{currentPlan.nombre}</p>
                      <Badge
                        className={
                          currentPlan.activo
                            ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                        }
                      >
                        {currentPlan.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">{currentPlan.descripcion}</p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-zinc-500">Valor</p>
                    <p className="text-xl font-semibold text-white">
                      ${Number(currentPlan.precio || 0).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                    <CalendarDays className="h-4 w-4 text-orange-300" />
                    Inicio
                  </div>
                  <p className="font-semibold text-white">
                    {formatDate(currentPlan.fechaInicio)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                    <CalendarDays className="h-4 w-4 text-orange-300" />
                    Vencimiento
                  </div>
                  <p className="font-semibold text-white">
                    {formatDate(currentPlan.fechaFin)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Vigencia
                  </div>
                  <p className="font-semibold text-white">
                    {currentPlan.remainingDays === null
                      ? "Sin fecha limite"
                      : currentPlan.remainingDays >= 0
                        ? `${currentPlan.remainingDays} dias restantes`
                        : "Vencido"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Datos utiles</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4 text-orange-300" />
                Mail
              </div>
              <p className="text-sm font-medium text-white">{user?.email || "-"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4 text-orange-300" />
                Telefono
              </div>
              <p className="text-sm font-medium text-white">{user?.tel || "-"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-zinc-400">
                <BadgeCheck className="h-4 w-4 text-orange-300" />
                Planes asignados
              </div>
              <p className="text-sm font-medium text-white">{assignedPlans.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Mi rutina</h2>
          </div>

          {loadingRoutine ? (
            <p className="text-zinc-400">Cargando rutina...</p>
          ) : !routine ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
              <p className="text-lg font-semibold text-white">Sin rutina asignada</p>
              <p className="mt-2 text-sm text-zinc-400">
                Todavia no tenes una rutina cargada.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
                <h3 className="text-2xl font-bold text-white">
                  {routine.nombre || "Rutina personalizada"}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {routine.objetivo || "Rutina activa asignada para tu entrenamiento."}
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
                  <p className="mb-2 text-sm font-semibold text-white">Observaciones</p>
                  <p className="text-sm text-zinc-300">{routine.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Resumen rapido</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-sm text-zinc-400">Objetivo</p>
              <p className="mt-1 text-sm font-medium text-white">
                {routine?.objetivo || "Sin objetivo cargado"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-sm text-zinc-400">Nivel actual</p>
              <p className="mt-1 text-sm font-medium text-white">
                {routine?.nivel || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-sm text-zinc-400">Frecuencia</p>
              <p className="mt-1 text-sm font-medium text-white">
                {routine?.dias || "-"}
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
              Detalle de la rutina
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
                      {typeof exercise === "string" ? exercise : exercise.ejercicio}
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
    </div>
  );
}

export default function MyPlan() {
  return (
    <AppLayout>
      <MyPlanContent />
    </AppLayout>
  );
}
