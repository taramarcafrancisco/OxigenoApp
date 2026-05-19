import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Hammer,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  Target,
} from "lucide-react";

import AppLayout from "../components/app/AppLayout";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { PlansApi } from "../api/PlansApi";
import { RutinasApi } from "../api/RutinasApi";
import { UsersApi } from "../api/users";

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
    data: catalog,
    isLoading: loadingCatalog,
    isError: isCatalogError,
    error: catalogError,
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
          "Cuenta comercial sin nombre",
        descripcion:
          fullPlan?.descripcion ??
          userPlan?.descripcion ??
          "Cuenta comercial asignada",
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

  const products = catalog?.ejercicios ?? [];
  const firstName =
    user?.nombre?.trim()?.split(/\s+/)?.[0] ||
    user?.full_name?.trim()?.split(/\s+/)?.[0] ||
    user?.email ||
    "Cliente";

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
          <p className="font-semibold text-red-300">Error cargando tu cuenta</p>
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
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              <Hammer className="h-4 w-4" />
              Mi cuenta ferretera
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Hola, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Aca tenes tu cuenta comercial, catalogo asignado y datos utiles
              para seguir tus compras y pedidos.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                <Package className="h-4 w-4 text-orange-400" />
                Productos
              </div>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Estado
              </div>
              <p className="text-2xl font-bold text-white">
                {currentPlan?.activo ? "Activo" : "Sin cuenta"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isCatalogError && (
        <Card className="border-red-500/20 bg-red-500/10 p-4 text-red-200">
          No se pudo cargar tu catalogo: {catalogError?.message || "Error"}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Cuenta asignada</h2>
          </div>

          {!currentPlan ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
              <p className="text-lg font-semibold text-white">Sin cuenta asignada</p>
              <p className="mt-2 text-sm text-zinc-400">
                Todavia no tenes una cuenta comercial activa cargada en el sistema.
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
                Cuentas asignadas
              </div>
              <p className="text-sm font-medium text-white">{assignedPlans.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Hammer className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Mi catalogo</h2>
          </div>

          {loadingCatalog ? (
            <p className="text-zinc-400">Cargando catalogo...</p>
          ) : !catalog ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
              <p className="text-lg font-semibold text-white">Sin catalogo asignado</p>
              <p className="mt-2 text-sm text-zinc-400">
                Todavia no tenes un catalogo cargado.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
                <h3 className="text-2xl font-bold text-white">
                  {catalog.nombre || "Lista comercial personalizada"}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {catalog.objetivo || "Catalogo activo para tu abastecimiento."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Rubro</p>
                  <p className="mt-1 text-lg font-semibold text-orange-300">
                    {catalog.nivel || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Dias de entrega</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {catalog.dias || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Productos</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {products.length}
                  </p>
                </div>
              </div>
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
              <p className="text-sm text-zinc-400">Necesidad</p>
              <p className="mt-1 text-sm font-medium text-white">
                {catalog?.objetivo || "Sin necesidad cargada"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-sm text-zinc-400">Rubro actual</p>
              <p className="mt-1 text-sm font-medium text-white">
                {catalog?.nivel || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-sm text-zinc-400">Frecuencia</p>
              <p className="mt-1 text-sm font-medium text-white">
                {catalog?.dias || "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {products.length > 0 && (
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">
              Detalle del catalogo
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((product, index) => (
              <div
                key={product.idRutinaEjercicio || index}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {typeof product === "string" ? product : product.ejercicio}
                    </p>

                    {typeof product !== "string" && (
                      <div className="mt-3 space-y-1 text-sm text-zinc-400">
                        <p>Presentacion: {product.series ?? "-"}</p>
                        <p>Cantidad sugerida: {product.repeticiones ?? "-"}</p>
                        <p>Ubicacion: {product.descanso ?? "-"}</p>
                      </div>
                    )}
                  </div>

                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-xs text-orange-300">
                    #{product.orden ?? index + 1}
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
