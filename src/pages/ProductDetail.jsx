import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AppLayout from "../components/app/AppLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { PlansApi } from "../api/PlansApi";
import { UsersApi } from "../api/users";
import { createPageUrl } from "../utils";

function ProductDetailContent() {
  const { productId } = useParams();

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

  const isPlanExpired = (fechaFin) => {
    if (!fechaFin) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(fechaFin);
    if (Number.isNaN(endDate.getTime())) return false;
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
        (plan) => String(plan.idPlan ?? plan.idPLan ?? plan.idplan) === String(planId)
      );

      const expired = isPlanExpired(userPlan?.fechaFin);

      return {
        id: userPlan?.id ?? planId,
        idPlan: planId,
        nombre:
          userPlan?.nombre ||
          userPlan?.plan?.nombre ||
          fullPlan?.nombre ||
          "Cuenta comercial sin nombre",
        precio: fullPlan?.precio ?? userPlan?.precio ?? 0,
        consultas: fullPlan?.consultas ?? userPlan?.consultas ?? 0,
        descripcion:
          fullPlan?.descripcion ??
          userPlan?.descripcion ??
          userPlan?.tipoProducto ??
          "Sin descripcion",
        activo: (userPlan?.activo ?? true) && !expired,
        fechaInicio: userPlan?.fechaInicio ?? null,
        fechaFin: userPlan?.fechaFin ?? null,
      };
    });
  }, [user, plans]);

  const product = useMemo(() => {
    return assignedPlans.find((plan) => String(plan.id) === String(productId));
  }, [assignedPlans, productId]);

  const isLoading = loadingUser || loadingPlans;
  const isError = isUserError || isPlansError;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="p-6">
          <p className="text-slate-500">Cargando detalle...</p>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-red-200 p-6">
          <p className="font-semibold text-red-700">
            Error cargando detalle del producto
          </p>
          <p className="mt-1 text-sm text-red-600">
            {String(userError?.message || plansError?.message || "Error desconocido")}
          </p>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="p-6">
          <p className="text-slate-500">Producto no encontrado</p>
          <Link to={createPageUrl("MyPlan")}>
            <Button variant="outline" className="mt-4">
              Volver
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Detalle del producto
        </h1>
        <p className="mt-1 text-slate-500">
          Informacion completa de la cuenta comercial asignada
        </p>
      </div>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{product.nombre}</h2>

          <Badge
            className={
              product.activo
                ? "bg-orange-500 text-white"
                : "bg-slate-200 text-slate-700"
            }
          >
            {product.activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        <p className="mb-6 text-slate-600">{product.descripcion}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <p className="text-sm text-slate-500">Costo</p>
            <p className="text-3xl font-bold text-slate-900">
              ${Number(product.precio || 0).toLocaleString("es-AR")}
              <span className="text-lg font-normal text-slate-500">/mes</span>
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-slate-500">Movimientos incluidos</p>
            <p className="text-3xl font-bold text-slate-900">
              {Number(product.consultas || 0).toLocaleString("es-AR")}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-slate-500">Fecha de inicio</p>
            <p className="text-lg font-semibold text-slate-900">
              {product.fechaInicio || "Sin inicio"}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-slate-500">Fecha de finalizacion</p>
            <p className="text-lg font-semibold text-slate-900">
              {product.fechaFin || "Sin fin"}
            </p>
          </Card>
        </div>
      </Card>

      <Link to={createPageUrl("MyPlan")}>
        <Button variant="outline">Volver a mi cuenta</Button>
      </Link>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <AppLayout>
      <ProductDetailContent />
    </AppLayout>
  );
}
