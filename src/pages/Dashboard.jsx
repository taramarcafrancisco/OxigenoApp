import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
 
import {
  Dumbbell,
  Flame,
  ShieldCheck,
  ActivitySquare,
  CalendarDays,
  Target,
  ClipboardList,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

import { PlansApi } from "../api/PlansApi";
import { UsersApi } from "../api/users";
import { RutinasApi } from "../api/RutinasApi";

function DashboardContent() {
  const { token, user: authUser, isLoadingAuth } = useAuth();

  /* ======================
     USUARIOS
  ======================= */
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    enabled: !!token && !isLoadingAuth,
    queryFn: UsersApi.list,
  });

  /* ======================
     PLANES
  ======================= */
  const {
    isError: plansError,
  } = useQuery({
    queryKey: ["plans"],
    enabled: !!token && !isLoadingAuth,
    queryFn: PlansApi.list,
    staleTime: 60_000,
  });

  /* ======================
     RUTINA ACTIVA
  ======================= */
  const {
    data: rutina,
    isLoading: rutinaLoading,
    isError: rutinaError,
    error: rutinaErrObj,
  } = useQuery({
    queryKey: ["my-routine", token],
    enabled: !!token && !isLoadingAuth,
    queryFn: RutinasApi.getMyRoutine,
    staleTime: 60_000,
  });

  /* ======================
     USUARIO REAL
  ======================= */
  const currentUser = useMemo(() => {
    if (!authUser || !users.length) return authUser;

    return (
      users.find((u) => String(u.idUsuario) === String(authUser.id)) || authUser
    );
  }, [authUser, users]);

  /* ======================
     MEMBRESÍA / PLAN ACTIVO
  ======================= */
  const assignedActivePlans = useMemo(() => {
    if (!currentUser?.planes?.length) return [];

    return currentUser.planes
      .filter((p) => p.activo)
      .map((p) => {
        const rawPlan = p.plan ?? p;

        return {
          id: p.id ?? rawPlan.idPlan ?? rawPlan.idplan,
          nombre: rawPlan.nombre || "Plan sin nombre",
          fechaInicio: p.fechaInicio || p.fecha_inicio || null,
          fechaFin: p.fechaFin || p.fecha_fin || null,
        };
      });
  }, [currentUser]);

  const currentActivePlan = useMemo(() => {
    if (!assignedActivePlans.length) return null;

    if (assignedActivePlans.length === 1) return assignedActivePlans[0];

    const sorted = [...assignedActivePlans].sort((a, b) => {
      const aTime = a?.fechaFin
        ? new Date(a.fechaFin).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b?.fechaFin
        ? new Date(b.fechaFin).getTime()
        : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

    return sorted[0];
  }, [assignedActivePlans]);

  /* ======================
     NOMBRE
  ======================= */
  const firstName =
    currentUser?.nombre?.trim()?.split(/\s+/)?.[0] ||
    currentUser?.full_name?.trim()?.split(/\s+/)?.[0] ||
    currentUser?.email ||
    "Usuario";

  const ejercicios = rutina?.ejercicios ?? [];

  return (
    <div className="min-h-full bg-black text-white">
      <div className="space-y-6 p-1 md:p-2">
        {/* HEADER */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-400/20 text-lime-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Dumbbell className="w-4 h-4" />
                Panel del cliente
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Bienvenido, {firstName}
              </h1>

              <p className="text-zinc-400 mt-2 text-base md:text-lg">
                Acá podés ver tu rutina actual y el estado de tu membresía.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Ejercicios
                </div>
                <p className="text-2xl font-bold">{ejercicios.length}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <ShieldCheck className="w-4 h-4 text-lime-400" />
                  Nivel
                </div>
                <p className="text-2xl font-bold">{rutina?.nivel || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ERRORES */}
        {rutinaError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            No se pudo cargar tu rutina: {rutinaErrObj?.message || "Error"}
          </div>
        )}

        {plansError && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-300">
            No se pudo cargar la membresía activa.
          </div>
        )}

        {/* RUTINA ACTIVA */}
   <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  {/* CARD PLAN ASIGNADO */}
  <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-lime-400 via-emerald-400 to-orange-500 p-[1px] shadow-2xl">
    <div className="rounded-3xl bg-zinc-950/95 p-6 md:p-8 h-full">
      <div className="inline-flex items-center gap-2 text-black bg-lime-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
        <BadgeCheck className="w-4 h-4" />
        Plan asignado
      </div>

      {!currentActivePlan ? (
        <>
          <p className="text-zinc-400 text-sm">Membresía actual</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Sin plan asignado
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Este cliente no tiene una membresía activa.
          </p>
        </>
      ) : (
        <>
          <p className="text-zinc-400 text-sm">Membresía actual</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            {currentActivePlan.nombre}
          </h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-zinc-400">Fecha de inicio</p>
              <p className="text-lg font-semibold text-white mt-1">
                {currentActivePlan.fechaInicio || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-zinc-400">Fecha de fin</p>
              <p className="text-lg font-semibold text-white mt-1">
                {currentActivePlan.fechaFin || "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-zinc-400">Estado</p>
            <p className="mt-1 inline-flex items-center gap-2 text-lime-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Activo
            </p>
          </div>
        </>
      )}
    </div>
  </div>

  {/* CARD RUTINA */}
  <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-lime-400 via-emerald-400 to-orange-500 p-[1px] shadow-2xl">
    <div className="rounded-3xl bg-zinc-950/95 p-6 md:p-8 h-full">
      <div className="inline-flex items-center gap-2 text-black bg-lime-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
        <Dumbbell className="w-4 h-4" />
        Rutina del cliente
      </div>

      {rutinaLoading ? (
        <>
          <p className="text-zinc-400 text-sm">Rutina actual</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Cargando rutina...
          </h2>
        </>
      ) : !rutina ? (
        <>
          <p className="text-zinc-400 text-sm">Rutina actual</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Sin rutina asignada
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Todavía no hay una rutina cargada para este cliente.
          </p>
        </>
      ) : (
        <>
          <p className="text-zinc-400 text-sm">Rutina actual</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            {rutina.nombre || "Rutina personalizada"}
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            {rutina.objetivo || "Rutina activa asignada para entrenamiento."}
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-zinc-400">Nivel</p>
              <p className="text-lg font-semibold text-lime-400 mt-1">
                {rutina.nivel || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-zinc-400">Días</p>
              <p className="text-lg font-semibold text-white mt-1">
                {rutina.dias || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-zinc-400">Ejercicios</p>
              <p className="text-lg font-semibold text-white mt-1">
                {ejercicios.length}
              </p>
            </div>
          </div>

          {rutina.observaciones && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-white mb-2">
                Observaciones
              </p>
              <p className="text-sm text-zinc-300">{rutina.observaciones}</p>
            </div>
          )}
        </>
      )}
    </div>
  </div>
</div>

{/* DETALLE DE EJERCICIOS */}
{ejercicios.length > 0 && (
  <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
    <div className="flex items-center gap-2 mb-4">
      <ClipboardList className="w-5 h-5 text-orange-400" />
      <h3 className="text-2xl font-bold text-white">
        Detalle de la rutina
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ejercicios.map((ej, index) => (
        <div
          key={ej.idRutinaEjercicio || index}
          className="rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-white text-lg">
                {typeof ej === "string" ? ej : ej.ejercicio}
              </p>

              {typeof ej !== "string" && (
                <div className="mt-3 space-y-1 text-sm text-zinc-400">
                  <p>Series: {ej.series ?? "-"}</p>
                  <p>Repeticiones: {ej.repeticiones ?? "-"}</p>
                  <p>Descanso: {ej.descanso ?? "-"}</p>
                </div>
              )}
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-lime-500/10 text-lime-300 border border-lime-400/20">
              #{ej.orden ?? index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* MEMBRESÍA */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="w-5 h-5 text-lime-400" />
            <h3 className="text-2xl font-bold text-white">Membresía activa</h3>
          </div>

          {!currentActivePlan ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-6 text-zinc-400">
              Este cliente no tiene una membresía activa asignada.
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Plan</p>
                  <p className="text-lg font-semibold text-white">
                    {currentActivePlan.nombre}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Inicio</p>
                  <p className="text-lg font-semibold text-white">
                    {currentActivePlan.fechaInicio || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Fin</p>
                  <p className="text-lg font-semibold text-white">
                    {currentActivePlan.fechaFin || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-4">
         
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}