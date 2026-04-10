import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { UsersApi } from "../api/users";
import { PlansApi } from "../api/PlansApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { api } from "../lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { toast } from "sonner";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
  UserPlus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { cn } from "../lib/utils";

function ClientsContent() {
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: UsersApi.list,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["planes"],
    queryFn: PlansApi.list,
  });

  const filteredUsers = users.filter((u) =>
    `${u.nombre ?? ""} ${u.apellido ?? ""} ${u.email ?? ""} ${u.cuit ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getActivePlans = (user) =>
    (user?.planes || []).filter((p) => p?.activo && p?.plan);

  const getPlanSummary = (user) => {
    const activePlans = getActivePlans(user);
    if (activePlans.length === 0) return [];
    return activePlans.map((up) => up.plan.nombre);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const updatedUser = await UsersApi.update(id, data);


      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      toast.success("Usuario actualizado");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error al actualizar usuario");
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ userData }) => {
      const createdUser = await UsersApi.create(userData);

      const createdId =
        createdUser?.idUsuario ||
        createdUser?.id ||
        createdUser?.data?.idUsuario ||
        createdUser?.data?.id;

      return createdUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setCreatingUser(false);
      toast.success("Usuario creado");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error al crear usuario");
    },
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      return api.patch(`/usuarios/${id}/estado`, null, {
        params: { estado },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeletingUser(null);
      toast.success("Estado actualizado");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Error al cambiar estado");
    },
  });


  const consultasExtraMutation = useMutation({
    mutationFn: ({ id, cantidad }) => UsersApi.addConsultasExtra(id, cantidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Consultas extra agregadas");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al agregar consultas extra");
    },
  });

  const handleAgregarConsultas = (idUsuario) => {
    const cantidad = prompt("Cantidad de consultas extra:");
    if (!cantidad) return;

    consultasExtraMutation.mutate({
      id: idUsuario,
      cantidad: Number(cantidad),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-slate-500">Gestiona los usuarios</p>
        </div>

        <Button
          onClick={() => setCreatingUser(true)}
          className="bg-blue-500 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Crear usuario
        </Button>
      </div>

      <Dialog open={creatingUser} onOpenChange={setCreatingUser}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear usuario</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);

              const userData = {
                nombre: fd.get("nombre"),
                apellido: fd.get("apellido"),
                email: fd.get("email"),
                password: fd.get("password"),
                cuit: fd.get("cuit"),
                razonSocial: fd.get("razonSocial"),
                tel: fd.get("tel"),
                direccion: fd.get("direccion") || "",
                estado: 1,
                roles: [
                  {
                    idRol: Number(fd.get("rolId")),
                  },
                ],
              };

              const planId = fd.get("planId");
              const fechaInicio = fd.get("fechaInicio");
              const fechaFin = fd.get("fechaFin");

              const calcularMeses = (desde, hasta) => {
                if (!desde || !hasta) return 1;

                const d1 = new Date(desde);
                const d2 = new Date(hasta);

                const diffMeses =
                  (d2.getFullYear() - d1.getFullYear()) * 12 +
                  (d2.getMonth() - d1.getMonth());

                return diffMeses > 0 ? diffMeses : 1;
              };

              const planData = planId
                ? {
                  idPlan: Number(planId),
                  meses: calcularMeses(fechaInicio, fechaFin),
                }
                : null;

              createMutation.mutate({
                userData,
                planData,
              });
            }}
          >
            <Input name="nombre" placeholder="Nombre" required />
            <Input name="apellido" placeholder="Apellido" required />
            <Input name="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" />
            <Input name="cuit" placeholder="CUIT" />
            <Input name="razonSocial" placeholder="Razón Social" />
            <Input name="tel" placeholder="Teléfono" />
            <Input name="direccion" placeholder="Dirección" />
             <div className="space-y-2">
              <Label>Rol</Label>
              <select
                name="rolId"
                defaultValue="2"
                className="w-full border rounded-md p-2"
              >
                <option value="2">Usuario</option>
                <option value="1">Administrador</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreatingUser(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Crear usuario
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);

                updateMutation.mutate({
                  id: editingUser.idUsuario,
                  data: {
                    nombre: fd.get("nombre"),
                    apellido: fd.get("apellido"),
                    password: fd.get("password"),
                    direccion: fd.get("direccion"),
                    email: fd.get("email"),
                    cuit: fd.get("cuit"),
                    razonSocial: fd.get("razonSocial"),
                    tel: fd.get("tel"),
                    roles: [
                      {
                        idRol: Number(fd.get("rolId")),
                      },
                    ],
                  },
                  
                });
              }}
            >
              <div>
                <Label>Nombre</Label>
                <Input name="nombre" defaultValue={editingUser.nombre} />
              </div>

              <div>
                <Label>Apellido</Label>
                <Input name="apellido" defaultValue={editingUser.apellido} />
              </div>

              <div>
                <Label>Email</Label>
                <Input name="email" defaultValue={editingUser.email} />
              </div>

              <div>
                <Label>Contraseña</Label>
                <Input
                  name="password"
                  type="text"
                  defaultValue={editingUser.password ?? ""}
                  placeholder="Contraseña"
                />
              </div>

              <div>
                <Label>CUIT</Label>
                <Input name="cuit" defaultValue={editingUser.cuit} />
              </div>

              <div>
                <Label>Razón Social</Label>
                <Input
                  name="razonSocial"
                  defaultValue={editingUser.razonSocial}
                />
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
                  name="direccion"
                  defaultValue={editingUser.direccion ?? ""}
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input name="tel" defaultValue={editingUser.tel} />
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <select
                  name="rolId"
                  defaultValue={editingUser?.roles?.[0]?.idRol ?? 2}
                  className="w-full border rounded-md p-2"
                >
                  <option value="2">Usuario</option>
                  <option value="1">Administrador</option>
                </select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>

                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="p-4">
        <Input
          placeholder="Buscar por nombre, email o CUIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CUIT</TableHead>
              <TableHead>Razón Social</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10}>Cargando...</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const planNames = getPlanSummary(u);

                return (
                  <TableRow key={u.idUsuario}>
                    <TableCell>{u.nombre}</TableCell>
                    <TableCell>{u.apellido}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.cuit || "-"}</TableCell>
                    <TableCell>{u.razonSocial || "-"}</TableCell>
                    <TableCell>{u.tel || "-"}</TableCell>

            
                    <TableCell>
                      <Badge
                        className={cn(
                          u.estado === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {u.estado === 1 ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {u.roles?.[0]?.idRol === 1 ? (
                        <Badge className="bg-purple-100 text-purple-700">
                          ADMIN
                        </Badge>
                      ) : (
                        <Badge variant="outline">USER</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(u)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              to={`${createPageUrl("ClientDetail")}?id=${u.idUsuario}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Link>

                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/user-plans/${u.idUsuario}`)}
                          >
                            📊 Administrar planes
                          </DropdownMenuItem>
                          {/* 
                          <DropdownMenuItem
                            onClick={() => handleAgregarConsultas(u.idUsuario)}
                          >
                            ➕ Consultas extra
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => setDeletingUser(u)}
                            className={u.estado === 1 ? "text-red-600" : "text-green-600"}
                          >
                            {/* <Trash2 className="w-4 h-4 mr-2" /> */}
                            {u.estado === 1 ? "Dar de baja" : "Dar de alta"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={() => setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deletingUser?.estado === 1
                ? "¿Dar de baja usuario?"
                : "¿Dar de alta usuario?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {deletingUser?.estado === 1
                ? "El usuario pasará a estado inactivo."
                : "El usuario pasará a estado activo."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              disabled={toggleEstadoMutation.isPending}
              onClick={() =>
                toggleEstadoMutation.mutate({
                  id: deletingUser.idUsuario,
                  estado: deletingUser.estado === 1 ? 0 : 1,
                })
              }
            >
              {toggleEstadoMutation.isPending
                ? "Procesando..."
                : deletingUser?.estado === 1
                  ? "Desactivar"
                  : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Clients() {
  return (
    <AppLayout>
      <ClientsContent />
    </AppLayout>
  );
}