import React, { useMemo, useState, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../components/app/AppLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";

import { es } from "date-fns/locale";
import { TrendingUp, Download } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

/* ==============================
   FETCH BACKEND REAL
============================== */
async function fetchQueries({ token }) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CONSULTAS_MIAS}?limit=500`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error HTTP ${res.status}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error HTTP ${res.status}`);
  }

  const data = await res.json();

  return data.map((c) => ({
    id: c.idConsulta,
    created_date: c.fecha,
    input_address: c.consulta,
    status: c.validada ? "success" : "error",
    response_time_ms: null,
    result: c.respuestaCompleta
      ? JSON.parse(c.respuestaCompleta)
      : null,
  }));
}

/* ==============================
   COMPONENT
============================== */

function UsageContent() {
  const { token } = useAuth();

  const [dateRange, setDateRange] = useState("7d");
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());

  const {
    data: queries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["queries-usage", token],
    enabled: !!token,
    queryFn: () => fetchQueries({ token }),
    staleTime: 30000,
  });

  /* ==============================
     PRESET FECHAS
  ============================== */
  const handlePresetChange = (preset) => {
    setDateRange(preset);
    const now = new Date();

    switch (preset) {
      case "7d":
        setStartDate(subDays(now, 7));
        break;
      case "30d":
        setStartDate(subDays(now, 30));
        break;
      case "90d":
        setStartDate(subDays(now, 90));
        break;
      default:
        setStartDate(subDays(now, 7));
    }

    setEndDate(now);
  };

  /* ==============================
     FILTRADO POR FECHA
  ============================== */
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const queryDate = new Date(q.created_date);
      return isWithinInterval(queryDate, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
    });
  }, [queries, startDate, endDate]);

  const totalQueries = filteredQueries.length;

  const successRate =
    totalQueries > 0
      ? Math.round(
          (filteredQueries.filter((q) => q.status === "success").length /
            totalQueries) *
            100
        )
      : 0;

  /* ==============================
     CHART DATA
  ============================== */
  const chartData = useMemo(() => {
    const data = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      const dayStart = startOfDay(current);
      const dayEnd = endOfDay(current);

      const dayQueries = filteredQueries.filter((q) => {
        const qDate = new Date(q.created_date);
        return isWithinInterval(qDate, { start: dayStart, end: dayEnd });
      });

      data.push({
        date: format(current, "d MMM", { locale: es }),
        consultas: dayQueries.length,
        exitosas: dayQueries.filter((q) => q.status === "success").length,
        errores: dayQueries.filter((q) => q.status === "error").length,
      });

      current = new Date(current.setDate(current.getDate() + 1));
    }

    return data;
  }, [filteredQueries, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consumo</h1>

        <Tabs value={dateRange} onValueChange={handlePresetChange}>
          <TabsList>
            <TabsTrigger value="7d">7 días</TabsTrigger>
            <TabsTrigger value="30d">30 días</TabsTrigger>
            <TabsTrigger value="90d">90 días</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading && <Card className="p-6">Cargando...</Card>}

      {isError && (
        <Card className="p-6 border border-red-200">
          Error: {String(error?.message)}
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          {/* STATS */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-sm text-slate-500">Total consultas</p>
              <p className="text-3xl font-bold">{totalQueries}</p>
            </Card>

            <Card className="p-5">
              <p className="text-sm text-slate-500">Tasa de éxito</p>
              <p className="text-3xl font-bold text-green-600">
                {successRate}%
              </p>
            </Card>
          </div>

          {/* BAR CHART */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Consultas por día</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consultas" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
     
          {/* LINE CHART 
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Exitosas vs Errores</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="exitosas" stroke="#22c55e" />
                  <Line type="monotone" dataKey="errores" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
        </>
      )}
    </div>
  );
}

export default function Usage() {
  return (
    <AppLayout>
      <UsageContent />
    </AppLayout>
  );
}
