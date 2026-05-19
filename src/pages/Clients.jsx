import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Loader2, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { UsersApi } from "../api/users";
import AppLayout from "../components/app/AppLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { api } from "../lib/api";
import { cn } from "../lib/utils";
import { createPageUrl } from "../utils";

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

  const filteredUsers = users.filter((user) =>
    `${user.nombre ?? ""} ${user.apellido ?? ""} ${user.email ?? ""} ${user.tel ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: ({ userData }) => UsersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setCreatingUser(false);
      toast.success("Cliente creado");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error al crear cliente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => UsersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      toast.success("Cliente actualizado");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error al actualizar cliente");
    },
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: ({ id, estado }) =>
      api.patch(`/usuarios/${id}/estado`, null, {
        params: { estado },
      }),
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

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-500/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.10),transparent_30%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-300/80">
              Gestion de clientes
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Clientes
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Organiza compradores frecuentes, obras y cuentas comerciales con
              una visual clara para la operacion diaria de la ferreteria.
            </p>
          </div>

          <Button
            onClick={() => setCreatingUser(true)}
            className="border border-orange-400/20 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 font-semibold text-black shadow-[0_12px_30px_rgba(249,115,22,0.35)] hover:from-orange-400 hover:via-amber-300 hover:to-orange-400"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar cliente
          </Button>
        </div>
      </section>

      <div className="hidden justify-between md:flex">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Base de clientes
          </h2>
        </div>
      </div>

      <Dialog open={creatingUser} onOpenChange={setCreatingUser}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-orange-500/10 bg-zinc-950 text-zinc-100 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-white">Agregar cliente</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const fd = new FormData(event.target);

              createMutation.mutate({
                userData: {
                  nombre: fd.get("nombre"),
                  apellido: fd.get("apellido"),
                  tel: fd.get("tel"),
                  email: fd.get("email"),
                  password: fd.get("password"),
                  estado: 1,
                  roles: [{ idRol: 2 }],
                },
              });
            }}
          >
            <Input
              name="nombre"
              placeholder="Nombre"
              required
              className="h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
            />
            <Input
              name="apellido"
              placeholder="Apellido"
              required
              className="h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
            />
            <Input
              name="tel"
              placeholder="Telefono"
              required
              className="h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
            />
            <Input
              name="email"
              type="email"
              placeholder="Mail"
              required
              className="h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
            />
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              className="h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreatingUser(false)}
                className="border-white/10 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-amber-400 font-semibold text-black hover:from-orange-400 hover:to-amber-300"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-orange-500/10 bg-zinc-950 text-zinc-100 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-white">Editar cliente</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const fd = new FormData(event.target);

                updateMutation.mutate({
                  id: editingUser.idUsuario,
                  data: {
                    nombre: fd.get("nombre"),
                    apellido: fd.get("apellido"),
                    tel: fd.get("tel"),
                    email: fd.get("email"),
                    roles: [
                      {
                        idRol: editingUser?.roles?.[0]?.idRol ?? 2,
                      },
                    ],
                  },
                });
              }}
            >
              <div>
                <Label className="text-zinc-300">Nombre</Label>
                <Input
                  name="nombre"
                  defaultValue={editingUser.nombre}
                  required
                  className="mt-2 h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Apellido</Label>
                <Input
                  name="apellido"
                  defaultValue={editingUser.apellido}
                  required
                  className="mt-2 h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Telefono</Label>
                <Input
                  name="tel"
                  defaultValue={editingUser.tel}
                  required
                  className="mt-2 h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Mail</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                  className="mt-2 h-11 rounded-xl border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-orange-400"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="border-white/10 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 font-semibold text-black hover:from-orange-400 hover:to-amber-300"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="border-orange-500/10 bg-zinc-950/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3">
          <Search className="h-4 w-4 text-orange-300" />
          <Input
            placeholder="Buscar por nombre, apellido, mail o telefono..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-auto border-0 bg-transparent px-0 py-0 text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-orange-500/10 bg-zinc-950/85 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
        <Table>
          <TableHeader className="bg-zinc-900/90">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="h-12 text-zinc-400">Nombre</TableHead>
              <TableHead className="text-zinc-400">Apellido</TableHead>
              <TableHead className="text-zinc-400">Mail</TableHead>
              <TableHead className="text-zinc-400">Telefono</TableHead>
              <TableHead className="text-zinc-400">Estado</TableHead>
              <TableHead className="text-zinc-400">Rol</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="py-10 text-center text-zinc-400">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.idUsuario}
                  className="border-white/10 text-zinc-100 transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-white">{user.nombre}</TableCell>
                  <TableCell>{user.apellido}</TableCell>
                  <TableCell className="text-zinc-300">{user.email || "-"}</TableCell>
                  <TableCell className="text-zinc-300">{user.tel || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        user.estado === 1
                          ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
                          : "border border-red-500/20 bg-red-500/15 text-red-300"
                      )}
                    >
                      {user.estado === 1 ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {user.roles?.[0]?.idRol === 1 ? (
                      <Badge className="border border-orange-500/20 bg-orange-500/15 text-orange-300">
                        ADMIN
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-zinc-900 text-zinc-300"
                      >
                        CLIENTE
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:bg-orange-500/10 hover:text-orange-200"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="border-orange-500/10 bg-zinc-950 text-zinc-100"
                      >
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to={`${createPageUrl("ClientDetail")}?id=${user.idUsuario}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate(`/user-plans/${user.idUsuario}`)}
                        >
                          Administrar planes
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setDeletingUser(user)}
                          className={
                            user.estado === 1 ? "text-red-400" : "text-emerald-400"
                          }
                        >
                          {user.estado === 1 ? "Dar de baja" : "Dar de alta"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={() => setDeletingUser(null)}
      >
        <AlertDialogContent className="border-orange-500/10 bg-zinc-950 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {deletingUser?.estado === 1
                ? "Dar de baja cliente?"
                : "Dar de alta cliente?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-zinc-400">
              {deletingUser?.estado === 1
                ? "El cliente pasara a estado inactivo."
                : "El cliente pasara a estado activo."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={toggleEstadoMutation.isPending}
              className="bg-gradient-to-r from-orange-500 to-amber-400 font-semibold text-black hover:from-orange-400 hover:to-amber-300"
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
