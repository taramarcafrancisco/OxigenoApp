import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

import { PlansApi } from "../api/PlansApi";
import { api } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

function UserPlans() {
  const { id } = useParams();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activo, setActivo] = useState(true);
  const [planId, setPlanId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-detail", id],
    enabled: !!id && !!token,
    queryFn: async () => {
      const res = await api.get(`/usuarios/${id}`, {
        headers: authHeaders,
      });
      return res.data;
    },
  });
  const resetForm = () => {
    setPlanId("");
    setFechaInicio("");
    setFechaFin("");
    setActivo(true);
    setEditingPlanId(null);
  };



  const formatDateForInput = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  const buildPayload = () => ({
    idPlan: Number(planId),
    fechaInicio,
    fechaFin: fechaFin || null,
    activo,
  });

  const clientName =
    userData?.razonSocial?.trim() ||
    [userData?.nombre, userData?.apellido].filter(Boolean).join(" ").trim() ||
    userData?.email ||
    `Cliente #${id}`;
  // =========================
  // GET Condiciones del cliente
  // =========================
  const {
    data: userPlans = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user-plans", id],
    enabled: !!id && !!token,
    queryFn: async () => {
      const res = await api.get(`/usuarios/${id}/planes`, {
        headers: authHeaders,
      });
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // =========================
  // GET TODOS LOS PLANES
  // =========================
  const { data: planes = [] } = useQuery({
    queryKey: ["planes"],
    enabled: !!token,
    queryFn: async () => {
      const res = await PlansApi.getAll(token);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // =========================
  // CREAR / Asignar condicion
  // =========================
  const asignarMutation = useMutation({
    mutationFn: async () => {
      return await api.post(
        `/usuarios-planes/usuario/${id}`,
        buildPayload(),
        { headers: authHeaders }
      );
    },
    onSuccess: () => {
      toast.success("Condicion asignada correctamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["user-plans", id] });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || "Error al asignar la condicion";
      toast.error(msg);
    },
  });

  // =========================
  // Editar condicion actual
  // =========================
  const editarMutation = useMutation({
    mutationFn: async () => {
      return await api.put(
        `/usuarios-planes/${editingPlanId}`,
        buildPayload(),
        { headers: authHeaders }
      );
    },
    onSuccess: () => {
      toast.success("Condicion actualizada correctamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["user-plans", id] });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || "Error al actualizar la condicion";
      toast.error(msg);
    },
  });

const activarMutation = useMutation({
  mutationFn: async (usuarioPlanId) => {
    return await api.put(
      `/usuarios-planes/${usuarioPlanId}/activar`,
      {},
      { headers: authHeaders }
    );
  },
  onSuccess: () => {
    toast.success("Condicion activada");
    queryClient.invalidateQueries({ queryKey: ["user-plans", id] });
  },
  onError: (error) => {
    const msg =
      error?.response?.data?.message || "Error al activar la condicion";
    toast.error(msg);
  },
});




// =========================
  // DESACTIVAR PLAN
  // =========================
  const desactivarMutation = useMutation({
    mutationFn: async (usuarioPlanId) => {
      return await api.put(
        `/usuarios-planes/${usuarioPlanId}/desactivar`,
        {},
        { headers: authHeaders }
      );
    },
    onSuccess: () => {
      toast.success("Condicion desactivada");
      queryClient.invalidateQueries({ queryKey: ["user-plans", id] });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || "Error al desactivar la condicion";
      toast.error(msg);
    },
  });


  
  const handleEdit = (p) => {
    setEditingPlanId(p.id);
    setPlanId(
      String(
        p?.plan?.idPlan ??
        p?.plan?.idPLan ??
        p?.idPlan ??
        ""
      )
    );
    setFechaInicio(formatDateForInput(p?.fechaInicio));
    setFechaFin(formatDateForInput(p?.fechaFin));
    setActivo(!!p.activo);
  };

  const validateForm = () => {
    if (!planId || Number(planId) <= 0) {
      toast.error("SeleccionÃ¡ un plan vÃ¡lido");
      return false;
    }

    if (!fechaInicio) {
      toast.error("IngresÃ¡ fecha de inicio");
      return false;
    }

    if (fechaFin && fechaFin < fechaInicio) {
      toast.error("La fecha fin no puede ser menor a la fecha inicio");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingPlanId) {
      editarMutation.mutate();
    } else {
      asignarMutation.mutate();
    }
  };

  const isSubmitting =
    asignarMutation.isPending ||
    editarMutation.isPending ||
    desactivarMutation.isPending;
     activarMutation.isPending;
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">AdministraciÃ³n de Planes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cliente: {isLoadingUser ? "Cargando..." : `${userData?.nombre || ""} ${userData?.apellido || ""}`.trim()}

          </p>
        </div>
        <Card className="p-4 space-y-4">
          <h2 className="font-semibold">
            Condiciones del cliente {isLoadingUser ? "" : `- ${clientName}`}
          </h2>
          {isLoading || isFetching ? (
            <p>Cargando...</p>
          ) : userPlans.length === 0 ? (
            <p>No tiene condiciones asignadas</p>
          ) : (
            <div className="space-y-3">
              {userPlans.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">
                      {p.plan?.nombre || "Condicion sin nombre"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.fechaInicio || "Sin inicio"} â†’ {p.fechaFin || "Sin fin"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={p.activo ? "default" : "secondary"}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </Button>
                    {p.activo ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => desactivarMutation.mutate(p.id)}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => activarMutation.mutate(p.id)}
                      >
                        Activar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="font-semibold">
            {editingPlanId ? "Editar condicion actual" : "Asignar nueva condicion"}
          </h2>

          <div className="space-y-2">
            <Label>Condicion</Label>
            <select
              className="w-full border rounded p-2"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              <option value="">Seleccionar condicion</option>
              {planes.map((p) => (
                <option
                  key={p.idPlan ?? p.idPLan}
                  value={p.idPlan ?? p.idPLan}
                >
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fecha inicio</Label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <Label>Fecha fin</Label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <select
              className="w-full border rounded p-2"
              value={activo ? "activo" : "inactivo"}
              onChange={(e) => setActivo(e.target.value === "activo")}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {editingPlanId ? "Guardar cambios" : "Asignar condicion"}
            </Button>

            {editingPlanId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default UserPlans;
