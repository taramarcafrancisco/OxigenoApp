import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Calendar as CalendarIcon,
  CreditCard,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

import { API_BASE_URL } from "@/constants"; // si lo tenés así
import axios from "axios";
const safeDate = (value) => {
  if (!value) return null;

  const d = new Date(value);
  return isNaN(d) ? null : d;
};
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function ClientDetailContent({ user, isAdmin }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get client ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("id");

  const {
    data: client,
    isLoading: clientLoading,
    isError: clientError,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const res = await api.get(`/usuarios/${clientId}`);
      return res.data;
    },
    enabled: !!clientId,
  });

  const { data: clientQueries = [], isLoading: queriesLoading } = useQuery({
    queryKey: ["client-queries", clientId],
    queryFn: async () => {
      const res = await api.get(`/consultas/usuario/${clientId}`);
      return res.data;
    },
    enabled: !!clientId,
  });

  const { data: assignedPlans = [], isLoading: assignedPlansLoading } =
    useQuery({
      queryKey: ["client-assigned-plans", clientId],
      queryFn: async () => {
        const res = await api.get(`/usuarios-planes/usuario/${clientId}`);
        return res.data;
      },
      enabled: !!clientId,
    });

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/planes");
      return res.data;
    },
  });

  const activeAssignedPlans = assignedPlans.filter((p) => {
    if (!p?.activo && p?.activo !== undefined) return false;

    if (!p?.fechaFin) return true;

    return new Date(p.fechaFin) >= new Date();
  });

  const getPlanEndDate = (item) => {
    return item?.fechaFin || item?.fecha_fin || item?.vencimiento || null;
  };

  const getNearestPlanExpiration = (plans) => {
    const validDates = plans
      .map((item) => getPlanEndDate(item))
      .filter(Boolean)
      .map((value) => new Date(value))
      .filter((date) => !isNaN(date));

    if (!validDates.length) return null;

    validDates.sort((a, b) => a - b);
    return validDates[0];
  };

  const totalQueriesLimit = activeAssignedPlans.reduce((acc, item) => {
    const limite =
      item?.plan?.limiteConsultas ??
      item?.plan?.queries_limit ??
      item?.limiteConsultas ??
      0;

    return acc + Number(limite || 0);
  }, 0);

  const assignedPlanNames = activeAssignedPlans.map(
    (item) => item?.plan?.nombre || item?.plan?.name || "Plan sin nombre",
  );

  // Filter queries by selected date
  const filteredQueries = selectedDate
    ? clientQueries.filter((q) =>
        isSameDay(new Date(q.created_date), selectedDate),
      )
    : clientQueries;

  const productUsage = clientQueries.reduce((acc, q) => {
    const rawType = q.tipo_producto || q.tipoProducto || "SIN_PRODUCTO";

    const tipo = String(rawType).trim().toUpperCase();

    if (!acc[tipo]) {
      acc[tipo] = {
        tipoProducto: tipo,
        total: 0,
        exitosas: 0,
        errores: 0,
      };
    }

    acc[tipo].total += 1;

    const esExitosa = q.validada === true || q.status === "success";

    if (esExitosa) {
      acc[tipo].exitosas += 1;
    } else {
      acc[tipo].errores += 1;
    }

    return acc;
  }, {});

  const productUsageList = Object.values(productUsage).sort(
    (a, b) => b.total - a.total,
  );

  const nearestExpiration = getNearestPlanExpiration(activeAssignedPlans);

  const getPlanStartDate = (item) => {
    return item?.fechaInicio || item?.fecha_inicio || null;
  };

  const isPlanExpired = (item) => {
    const fechaFin = getPlanEndDate(item);
    if (!fechaFin) return false;

    const fin = new Date(fechaFin);
    if (isNaN(fin)) return false;

    return fin < new Date();
  };

  const getPlanStatusLabel = (item) => {
    if (isPlanExpired(item)) return "Vencido";
    return "Activo";
  };
  const formatProductName = (tipo) => {
    const map = {
      DESARROLLADORES: "Desarrolladores",
      BUSCADOR_CAMPO_UNICO: "Buscador Campo Único",
      BUSCADOR_MASIVO_LOTES: "Buscador Masivo Lotes",
      ESTRUCTURADA: "Búsqueda Estructurada",
      SIN_PRODUCTO: "Sin producto",
    };

    return map[tipo] || tipo.replaceAll("_", " ");
  };
  // Stats
  const successfulQueries = clientQueries.filter(
    (q) => q.status === "success",
  ).length;
  const errorQueries = clientQueries.filter((q) => q.status === "error").length;
  const successRate =
    clientQueries.length > 0
      ? Math.round((successfulQueries / clientQueries.length) * 100)
      : 0;

  // Chart data (last 7 days)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayQueries = clientQueries.filter((q) =>
      isSameDay(new Date(q.created_date), date),
    );
    chartData.push({
      date: format(date, "EEE", { locale: es }),
      consultas: dayQueries.length,
    });
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">
            No tienes permisos para ver esta página
          </p>
        </div>
      </div>
    );
  }

  if (clientLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (clientError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Error al cargar cliente</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return <div className="text-center">Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl("Clients")}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {client.full_name || "Cliente"}
          </h1>
          <p className="text-slate-500">Detalle del cliente</p>
        </div>
      </div>

      {/* Client Info Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {client.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              {client.company && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-4 h-4" />
                  <span>{client.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  Registrado:{" "}
                  {client.created_date && !isNaN(new Date(client.created_date))
                    ? format(
                        new Date(client.created_date),
                        "d 'de' MMMM yyyy",
                        { locale: es },
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                client.status === "inactive"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200",
              )}
            >
              {client.status === "inactive" ? "Inactivo" : "Activo"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Planes:{" "}
              {assignedPlanNames.length > 0
                ? assignedPlanNames.join(" - ")
                : "Sin planes"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total consultas</p>
          <p className="text-2xl font-bold text-slate-900">
            {clientQueries.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Exitosas</p>
          <p className="text-2xl font-bold text-green-600">
            {successfulQueries}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-500">Tasa de éxito</p>
          <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-900">Planes asignados</h3>
        </div>

        {assignedPlansLoading ? (
          <p className="text-sm text-slate-500">Cargando planes...</p>
        ) : assignedPlans.length === 0 ? (
          <p className="text-sm text-slate-500">
            El cliente no tiene planes asignados.
          </p>
        ) : (
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignedPlans.map((item) => {
              const planNombre =
                item?.plan?.nombre || item?.plan?.name || "Plan sin nombre";

              const planLimite =
                item?.plan?.limiteConsultas ??
                item?.plan?.queries_limit ??
                item?.limiteConsultas ??
                0;

              const fechaInicio = getPlanStartDate(item);
              const fechaFin = getPlanEndDate(item);
              const vencido = isPlanExpired(item);
              const estado = getPlanStatusLabel(item);

              return (
                <Card
                  key={item.id || `${planNombre}-${fechaInicio || "sin-fecha"}`}
                  className="p-4 border border-slate-200 shadow-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {planNombre}
                        </p>
                        <p className="text-sm text-slate-500">
                          {planLimite} consultas
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          vencido
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200",
                        )}
                      >
                        {estado}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between gap-3">
                        <span className="font-medium">Inicio</span>
                        <span>
                          {fechaInicio
                            ? format(new Date(fechaInicio), "d/MM/yyyy")
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="font-medium">Finalización</span>
                        <span>
                          {fechaFin
                            ? format(new Date(fechaFin), "d/MM/yyyy")
                            : "Sin vencimiento"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
      {/* Usage Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-900">Consumo por producto</h3>
        </div>

        {productUsageList.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay consumo registrado por producto.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {productUsageList.map((item) => {
              const tasaExito =
                item.total > 0
                  ? Math.round((item.exitosas / item.total) * 100)
                  : 0;

              return (
                <Card
                  key={item.tipoProducto}
                  className="p-4 border border-slate-200 shadow-none"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm text-slate-500">Producto</p>
                      <p className="text-base font-semibold text-slate-900">
                        {formatProductName(item.tipoProducto)}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {item.total} consultas
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Exitosas</span>
                      <span className="font-medium text-green-600">
                        {item.exitosas}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Errores</span>
                      <span className="font-medium text-red-600">
                        {item.errores}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Tasa de éxito</span>
                      <span className="font-medium text-slate-900">
                        {tasaExito}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress value={tasaExito} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Tabs for Chart and History */}
      <Tabs defaultValue="chart">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Actividad (últimos 7 días)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar
                    dataKey="consultas"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="overflow-hidden">
            {/* Date Filter */}
            <div className="p-4 border-b border-slate-100">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedDate
                      ? format(selectedDate, "d 'de' MMMM", { locale: es })
                      : "Filtrar por fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                  />
                  {selectedDate && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedDate(null)}
                      >
                        Limpiar filtro
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Tiempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-slate-500"
                    >
                      No hay consultas para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueries.slice(0, 20).map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="text-sm text-slate-500">
                        {(() => {
                          const d = safeDate(query.created_date);
                          return d
                            ? format(d, "d MMM, HH:mm", { locale: es })
                            : "--";
                        })()}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 max-w-xs truncate">
                        {query.input_address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            query.status === "success"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200",
                          )}
                        >
                          {query.status === "success" ? "Exitosa" : "Error"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500">
                        {query.response_time_ms || "--"}ms
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ClientDetail() {
  const user = JSON.parse(localStorage.getItem("user")); // o desde contexto
  const isAdmin = user?.role === "ADMIN";

  return (
    <AppLayout>
      <ClientDetailContent user={user} isAdmin={isAdmin} />
    </AppLayout>
  );
}
