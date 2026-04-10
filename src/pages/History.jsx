import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  Search,
  CalendarIcon,
  Download,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * Ajustá este fetch a tu backend real.
 * Espera devolver un array de items con forma:
 * {
 *   id: string|number,
 *   created_date: string (ISO),
 *   input_address: string,
 *   status: 'success'|'error'|'pending',
 *   response_time_ms: number,
 *   result?: object
 * }
 */
async function fetchHistory({ token, limit = 1000 }) {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.CONSULTAS_MIAS}?limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error HTTP ${res.status}`);
  }

  const data = await res.json();

  // 🔥 Adaptamos backend → formato que usa la tabla
  return data.map((c) => ({
    id: c.idConsulta,
    created_date: c.fecha,
    input_address: c.consulta,
    status: c.validada ? "success" : "pending",
    response_time_ms: null,
    result: c.respuestaCompleta
      ? JSON.parse(c.respuestaCompleta)
      : null,
  }));
}


function toCsv(rows) {
  const header = Object.keys(rows[0] ?? {
    id: "",
    created_date: "",
    input_address: "",
    status: "",
    response_time_ms: "",
  });

  return [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((k) => {
          const val = String(r[k] ?? "");
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");
}

function downloadCsv({ filename, rows }) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function HistoryContent() {
  const { token } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const {
    data: queries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["queries-history"],
    enabled: !!token,
queryFn: () => fetchHistory({ token }),

    staleTime: 30_000,
  });

  const statusConfig = {
    success: {
      icon: CheckCircle,
      label: "Exitosa",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    error: {
      icon: XCircle,
      label: "Error",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    pending: {
      icon: Clock,
      label: "Pendiente",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
  };

  // Filter queries
  const filteredQueries = useMemo(() => {
    return (queries ?? []).filter((query) => {
      const matchesSearch =
        !searchTerm ||
        query.input_address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !selectedDate || isSameDay(new Date(query.created_date), selectedDate);

      return matchesSearch && matchesDate;
    });
  }, [queries, searchTerm, selectedDate]);

const handleExport = () => {
  const rows = filteredQueries.map((q) => ({
    id: q.id,
    created_date: q.created_date,
    input_address: q.input_address,
    status: q.status,
    response_time_ms: q.response_time_ms ?? "",

    // datos del resultado
    direccion: q.result?.direccion ?? "",
    provincia: q.result?.provincia ?? "",
    partido: q.result?.partido ?? "",
    localidad: q.result?.localidad ?? "",
    municipio: q.result?.municipio ?? "",
    cp: q.result?.cp ?? "",
    barrio: q.result?.barrio ?? "",
    calle: q.result?.calle ?? "",
    altura: q.result?.altura ?? "",
    alturaDesde: q.result?.alturaDesde ?? "",
    alturaHasta: q.result?.alturaHasta ?? "",
    lat: q.result?.lat ?? "",
    lon: q.result?.lon ?? "",

    // opcional: json completo
    result_json: q.result ? JSON.stringify(q.result) : "",
  }));

  downloadCsv({
    filename: `historial_${format(new Date(), "yyyyMMdd_HHmm")}.csv`,
    rows,
  });
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Historial
          </h1>
          <p className="text-slate-500 mt-1">
            Consulta tus validaciones anteriores
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={filteredQueries.length === 0 || isLoading || isError}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <Card className="p-6 border border-red-200">
          <p className="font-semibold text-red-700">Error cargando historial</p>
          <p className="text-sm text-red-600 mt-1">
            {String(error?.message || "Error desconocido")}
          </p>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start"
                disabled={isLoading}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {selectedDate
                  ? format(selectedDate, "d 'de' MMMM", { locale: es })
                  : "Filtrar por fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
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
      </Card>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Mostrando {filteredQueries.length} de {queries.length} consultas
      </p>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección consultada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Tiempo</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-slate-100 rounded w-48 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-slate-100 rounded w-12 animate-pulse ml-auto" />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
              ) : filteredQueries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        No se encontraron consultas
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {searchTerm || selectedDate
                          ? "Intenta ajustar los filtros"
                          : "Aún no has realizado ninguna consulta"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueries.map((query) => {
                  const status =
                    statusConfig[query.status] || statusConfig.pending;

                  return (
                    <TableRow
                      key={query.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelectedQuery(query)}
                    >
                      <TableCell className="text-sm text-slate-500">
                        {format(new Date(query.created_date), "d MMM yyyy, HH:mm", {
                          locale: es,
                        })}
                      </TableCell>

                      <TableCell className="font-medium text-slate-900 max-w-xs">
                        <span className="truncate block">
                          {query.input_address}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right text-sm text-slate-500">
                        {query.response_time_ms ?? "--"}ms
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuery(query);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Query Detail Modal */}
      <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de consulta</DialogTitle>
          </DialogHeader>

          {selectedQuery && (
            <div className="space-y-6">
              {/* Status badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-sm",
                  (statusConfig[selectedQuery.status] || statusConfig.pending)
                    .className
                )}
              >
                {(statusConfig[selectedQuery.status] || statusConfig.pending)
                  .label || "Desconocido"}
              </Badge>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Fecha y hora</p>
                  <p className="font-medium text-slate-900">
                    {format(
                      new Date(selectedQuery.created_date),
                      "d 'de' MMMM yyyy, HH:mm:ss",
                      { locale: es }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tiempo de respuesta</p>
                  <p className="font-medium text-slate-900">
                    {selectedQuery.response_time_ms ?? "--"}ms
                  </p>
                </div>
              </div>

              {/* Input */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Dirección enviada</p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-slate-900">{selectedQuery.input_address}</p>
                </div>
              </div>

              {/* Result */}
              {selectedQuery.result && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Resultado</p>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-100">
                      {JSON.stringify(selectedQuery.result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function History() {
  return (
    <AppLayout>
      <HistoryContent />
    </AppLayout>
  );
}
