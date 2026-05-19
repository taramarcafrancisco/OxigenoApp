import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AppLayout from "../components/app/AppLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { PlansApi } from "../api/PlansApi";
import { UsersApi } from "../api/users";
import { useAuth } from "../lib/AuthContext";

export default function Planes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: PlansApi.list,
    staleTime: 60_000,
  });

  const changePlanMutation = useMutation({
    mutationFn: ({ usuarioId, planId }) => UsersApi.changePlan(usuarioId, planId),
    onSuccess: () => {
      toast.success("Condicion comercial actualizada");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSelectedPlan(null);
    },
    onError: (err) => {
      toast.error(err?.message || "Error cambiando la condicion comercial");
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <p className="mt-10 text-center text-slate-500">Cargando condiciones...</p>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <p className="mt-10 text-center text-red-500">
          Error cargando condiciones: {error?.message}
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Condiciones comerciales disponibles
          </h1>
          <p className="mt-2 text-slate-500">
            Elegi la cuenta que mejor se adapte al volumen de tu ferreteria.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const nombre = plan.nombre ?? plan.name ?? "Sin nombre";
            const precio = plan.precio ?? plan.price ?? 0;
            const movimientos = Number(plan.consultas ?? 0);
            const planId = plan.idPlan ?? plan.idPLan ?? plan.idplan;
            const isCurrent = Number(user?.plan?.idPlan) === Number(planId);

            return (
              <Card key={planId} className="space-y-5 border border-slate-200 p-6 shadow-md">
                {isCurrent && (
                  <Badge className="w-fit bg-green-500 text-white">Cuenta actual</Badge>
                )}

                <h2 className="text-xl font-bold">{nombre}</h2>

                <div>
                  <span className="text-4xl font-bold">
                    ${Number(precio).toLocaleString("es-AR")}
                  </span>
                  <span className="ml-1 text-sm text-slate-500">/ mes</span>
                </div>

                <div className="font-medium text-slate-600">
                  {movimientos.toLocaleString("es-AR")} movimientos
                </div>

                <Button disabled={isCurrent} onClick={() => setSelectedPlan(plan)}>
                  Elegir condicion
                </Button>
              </Card>
            );
          })}
        </div>

        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar cambio de condicion comercial</DialogTitle>
            </DialogHeader>

            {selectedPlan && (
              <div className="space-y-4">
                <p>
                  Estas seguro que deseas cambiar a{" "}
                  <span className="font-bold">{selectedPlan.nombre}</span>?
                </p>

                <div className="rounded-lg bg-slate-100 p-4">
                  <p className="text-lg font-semibold">Nuevo costo mensual:</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${Number(selectedPlan.precio).toLocaleString("es-AR")} / mes
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  El cambio se aplicara inmediatamente.
                </p>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Cancelar
              </Button>

              <Button
                disabled={changePlanMutation.isPending}
                onClick={() => {
                  changePlanMutation.mutate({
                    usuarioId: user.idUsuario,
                    planId: selectedPlan.idPlan ?? selectedPlan.idPLan ?? selectedPlan.idplan,
                  });
                }}
              >
                Confirmar cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
