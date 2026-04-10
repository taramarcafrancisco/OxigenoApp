import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
import { PlansApi } from "../api/PlansApi";
import { UsersApi } from "../api/users";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { toast } from "sonner";
import { Plus, Edit, Zap, Users, Loader2, Package } from "lucide-react";
import { cn } from "../lib/utils";

 

function ManagePlansContent() {
  const [editingPlan, setEditingPlan] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("BUSCADOR_CAMPO_UNICO");

  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: PlansApi.list,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: UsersApi.list,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id ? PlansApi.update(id, data) : PlansApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setEditingPlan(null);
      setCreating(false);
      setSelectedProduct("BUSCADOR_CAMPO_UNICO");
      toast.success("Plan guardado correctamente");
    },

    onError: (err) => {
      console.error(err);
      toast.error("Error al guardar el plan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => PlansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan eliminado correctamente");
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo eliminar el plan");
    },
  });

  const getUsersCount = (planId) =>
    users.filter((u) =>
      Array.isArray(u.planes)
        ? u.planes.some((up) => up.plan?.idPlan === planId && up.activo)
        : false
    ).length;

  const getProductLabel = (tipoProducto) => {
    return (
      PRODUCT_OPTIONS.find((p) => p.value === tipoProducto)?.label ||
      tipoProducto ||
      "Sin producto"
    );
  };

  const resetModal = () => {
    setEditingPlan(null);
    setCreating(false);
    setSelectedProduct("BUSCADOR_CAMPO_UNICO");
  };

  const openCreate = () => {
    setEditingPlan(null);
    setCreating(true);
    setSelectedProduct("BUSCADOR_CAMPO_UNICO");
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setCreating(false);
    setSelectedProduct(plan?.tipoProducto || "BUSCADOR_CAMPO_UNICO");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    saveMutation.mutate({
      id: editingPlan?.idPlan,
      data: {
        nombre: fd.get("nombre"),
        descripcion: fd.get("descripcion"),
        precio: Number(fd.get("precio")),
        consultas: Number(fd.get("consultas")),
        tipoProducto: selectedProduct,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Planes</h1>
          <p className="text-slate-500">Gestión de planes del sistema</p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo plan
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-6">Cargando planes...</Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.idPlan} className={cn("p-6")}>
              <div className="flex justify-between items-start mb-3 gap-3">
                <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                <Badge variant="outline">${plan.precio}</Badge>
              </div>

              <p className="text-sm text-slate-500 mb-4">{plan.descripcion}</p>

              <div className="flex items-center gap-2 text-violet-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getProductLabel(plan.tipoProducto)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Zap className="w-4 h-4" />
                {plan.consultas} consultas
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <Users className="w-4 h-4" />
                {getUsersCount(plan.idPlan)} usuarios
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => openEdit(plan)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>

              <Button
                variant="destructive"
                className="w-full mt-2"
                onClick={() => {
                  if (confirm("¿Seguro que querés eliminar este plan?")) {
                    deleteMutation.mutate(plan.idPlan);
                  }
                }}
              >
                Eliminar
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingPlan || creating}
        onOpenChange={(open) => {
          if (!open) resetModal();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Editar plan" : "Nuevo plan"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                name="nombre"
                defaultValue={editingPlan?.nombre || ""}
                required
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Input
                name="descripcion"
                defaultValue={editingPlan?.descripcion || ""}
              />
            </div>

            <div>
              <Label>Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_OPTIONS.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Precio</Label>
              <Input
                name="precio"
                type="number"
                step="0.01"
                defaultValue={editingPlan?.precio ?? 0}
              />
            </div>

            <div>
              <Label>Consultas</Label>
              <Input
                name="consultas"
                type="number"
                defaultValue={editingPlan?.consultas ?? 0}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetModal}>
                Cancelar
              </Button>

              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ManagePlans() {
  return (
    <AppLayout>
      <ManagePlansContent />
    </AppLayout>
  );
}