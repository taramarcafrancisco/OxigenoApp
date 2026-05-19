import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Hammer, Package, ShieldCheck, Target } from "lucide-react";

import AppLayout from "../components/app/AppLayout";
import { Card } from "../components/ui/card";
import { RutinasApi } from "../api/RutinasApi";

function UsageContent() {
  const {
    data: catalog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-routine"],
    queryFn: RutinasApi.getMyRoutine,
  });

  const products = catalog?.ejercicios ?? [];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              <Hammer className="h-4 w-4" />
              Mi catalogo
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Catalogo de productos
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Visualiza tu lista comercial actual, el rubro de trabajo y el detalle
              de cada producto en una sola pantalla.
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
                Rubro
              </div>
              <p className="text-2xl font-bold text-white">{catalog?.nivel || "-"}</p>
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6 text-zinc-400">
          Cargando catalogo...
        </Card>
      )}

      {isError && (
        <Card className="border-red-500/20 bg-red-500/10 p-6 text-red-200">
          No se pudo cargar el catalogo: {String(error?.message || "Error")}
        </Card>
      )}

      {!isLoading && !isError && !catalog && (
        <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
          <p className="text-lg font-semibold text-white">Sin catalogo asignado</p>
          <p className="mt-2 text-sm text-zinc-400">
            Todavia no hay una lista comercial cargada para este usuario.
          </p>
        </Card>
      )}

      {!isLoading && !isError && catalog && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="border-orange-500/10 bg-zinc-950/90 p-6 xl:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">
                  Resumen del catalogo
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
                  <h3 className="text-2xl font-bold text-white">
                    {catalog.nombre || "Lista comercial personalizada"}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    {catalog.objetivo || "Catalogo activo para abastecimiento actual."}
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
            </Card>

            <Card className="border-orange-500/10 bg-zinc-950/90 p-6">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Vista rapida</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Necesidad</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {catalog.objetivo || "Sin necesidad cargada"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Frecuencia</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {catalog.dias || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Carga actual</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {products.length} productos planificados
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
                  Detalle de productos
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
