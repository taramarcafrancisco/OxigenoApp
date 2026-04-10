import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";

import { UsersApi } from "../api/users";
import { PlansApi } from "../api/PlansApi";

import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

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

  useEffect(() => {
    console.log("USER:", user);
  }, [user]);

  const isPlanExpired = (fechaFin) => {
    if (!fechaFin) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(fechaFin);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today;
  };

  const assignedPlans = useMemo(() => {
    if (!user?.planes || user.planes.length === 0) return [];

    return user.planes.map((userPlan) => {
      const planId =
        userPlan?.idPlan ??
        userPlan?.plan?.idPlan ??
        userPlan?.plan?.idPLan ??
        userPlan?.plan?.idplan ??
        userPlan?.id;

      const fullPlan = plans.find(
        (p) => String(p.idPlan ?? p.idPLan ?? p.idplan) === String(planId),
      );

      const expired = isPlanExpired(userPlan?.fechaFin);

      return {
        id: userPlan?.id ?? planId,
        idPlan: planId,
        nombre:
          userPlan?.nombre ||
          userPlan?.plan?.nombre ||
          fullPlan?.nombre ||
          "Plan sin nombre",
        precio: fullPlan?.precio ?? userPlan?.precio ?? 0,
        consultas: fullPlan?.consultas ?? userPlan?.consultas ?? 0,
        descripcion:
          fullPlan?.descripcion ??
          userPlan?.descripcion ??
          userPlan?.tipoProducto ??
          "Sin descripción",
        activo: (userPlan?.activo ?? true) && !expired,
        fechaInicio: userPlan?.fechaInicio ?? null,
        fechaFin: userPlan?.fechaFin ?? null,
      };
    });
  }, [user, plans]);

  const isLoading = loadingUser || loadingPlans;
  const isError = isUserError || isPlansError;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <p className="text-slate-500">Cargando productos...</p>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-red-200">
          <p className="font-semibold text-red-700">Error cargando productos</p>
          <p className="text-sm text-red-600 mt-1">
            {String(
              userError?.message || plansError?.message || "Error desconocido",
            )}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Mis Productos
        </h1>
        <p className="text-slate-500 mt-1">
          Estos son los productos asignados a tu cuenta
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Productos asignados
        </h3>

        {assignedPlans.length === 0 ? (
          <p className="text-slate-500">No tienes productos asignados</p>
        ) : (
          <div className="space-y-3">
            {assignedPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{plan.nombre}</p>

                    <Badge
                      className={
                        plan.activo
                          ? "bg-blue-500 text-white"
                          : "bg-slate-200 text-slate-700"
                      }
                    >
                      {plan.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {plan.descripcion}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {plan.fechaInicio || "Sin inicio"} -{" "}
                    {plan.fechaFin || "Sin fin"}
                  </p>
                </div>

                <div className="text-left md:text-right space-y-2">
                  <p className="font-semibold text-slate-900">
                    ${Number(plan.precio || 0).toLocaleString("es-AR")}
                  </p>

                  <p className="text-sm text-slate-500">
                    {Number(plan.consultas || 0).toLocaleString("es-AR")}{" "}
                    consultas
                  </p>

                  <Link to="/consumo">
                    <Button variant="outline">Ver consumo</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
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
