import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
import { PlansApi } from "../api/PlansApi";
import { UsersApi } from "../api/users";
import { useAuth } from "../lib/AuthContext";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

import { toast } from "sonner";

export default function Planes() {


  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);


  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: PlansApi.list,
    staleTime: 60000,
  });

  const changePlanMutation = useMutation({
    mutationFn: ({ usuarioId, planId }) =>
      UsersApi.cambiarPlan(usuarioId, planId),

    onSuccess: () => {
      toast.success("Plan actualizado correctamente");

      queryClient.invalidateQueries(["currentUser"]);

      setIsDialogOpen(false); // 🔥 Cierra el dialogo
      setSelectedPlan(null);
    },

    onError: (err) => {
      toast.error(err?.message || "Error cambiando el plan");
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <p className="text-center mt-10 text-slate-500">
          Cargando planes...
        </p>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <p className="text-center mt-10 text-red-500">
          Error cargando planes: {error?.message}
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Planes disponibles
          </h1>
          <p className="text-slate-500 mt-2">
            Elegí el plan que mejor se adapte a tu volumen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const nombre = plan.nombre ?? plan.name ?? "Sin nombre";
            const precio = plan.precio ?? plan.price ?? 0;
            const consultas = Number(plan.consultas ?? 0);

            const isCurrent =
              Number(user?.plan?.idPlan) === Number(plan.idPlan);

            return (
              <Card
                key={plan.idPlan}
                className="p-6 space-y-5 border border-slate-200 shadow-md"
              >
                {isCurrent && (
                  <Badge className="bg-green-500 text-white w-fit">
                    Plan actual
                  </Badge>
                )}

                <h2 className="text-xl font-bold">{nombre}</h2>

                <div>
                  <span className="text-4xl font-bold">
                    ${Number(precio).toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm ml-1">
                    / mes
                  </span>
                </div>

                <div className="text-slate-600 font-medium">
                  {consultas.toLocaleString()} consultas
                </div>
                <Button
                  disabled={isCurrent}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDialogOpen(true);
                  }}
                >
                  Elegir plan
                </Button>

              </Card>
            );
          })}
        </div>

        {/* ==========================
           DIALOG CONFIRMAR CAMBIO
        ========================== */}

        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar cambio de plan</DialogTitle>
            </DialogHeader>

            {selectedPlan && (
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas cambiar al plan{" "}
                  <span className="font-bold">
                    {selectedPlan.nombre}
                  </span>?
                </p>

                <div className="bg-slate-100 p-4 rounded-lg">
                  <p className="text-lg font-semibold">
                    Nuevo costo mensual:
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${Number(selectedPlan.precio).toLocaleString()} / mes
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  El cambio de plan se aplicará inmediatamente.
                </p>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedPlan(null)}
              >
                Cancelar
              </Button>

              <Button
                onClick={() => {
                  changePlanMutation.mutate(
                    {
                      usuarioId: user.idUsuario,
                      planId: selectedPlan.idPlan,
                    },
                    {
                      onSuccess: () => {
                        setOpen(false); // 🔥 Cierra el dialog
                      },
                    }
                  );
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
