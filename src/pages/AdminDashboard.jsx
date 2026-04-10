import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants";
import AppLayout from "@/components/app/AppLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api.js";
import {
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  Crown,
} from "lucide-react";

import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";


function AdminDashboardContent() {
  const { isAdmin, token } = useAuth();

  if (isAdmin) {
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

  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.ADMIN_USUARIOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const { data: allQueries = [] } = useQuery({
    queryKey: ["admin-consultas"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.ADMIN_CONSULTAS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });


  const activeUsers = allUsers.filter(
    (u) => u.estado === 1 || u.estado == null
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const queriesToday = allQueries.filter(
    (q) => new Date(q.fecha) >= today
  ).length;

  const totalQueries = allQueries.length;

  const errorRate =
    totalQueries > 0
      ? Math.round(
        (allQueries.filter((q) => !q.validada).length /
          totalQueries) *
        100
      )
      : 0;

  /* =========================
     TOP CLIENTES
  ========================= */

  const clientQueries = {};
  allQueries.forEach((q) => {
    const userId = q.usuario?.idUsuario;
    if (!userId) return;
    clientQueries[userId] = (clientQueries[userId] || 0) + 1;
  });

  const topClients = Object.entries(clientQueries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([userId, count]) => {
      const u = allUsers.find(
        (x) => String(x.idUsuario) === String(userId)
      );
      return {
        name: u?.nombre || "Usuario",
        email: u?.email || "",
        queries: count,
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <Badge className="bg-purple-100 text-purple-700">Admin</Badge>
        </div>
        <p className="text-slate-500">Métricas globales de la plataforma</p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Usuarios activos"
          value={activeUsers}
          icon={Users}
          colorClass="blue"
        />
        <StatsCard
          title="Consultas hoy"
          value={queriesToday}
          icon={Activity}
          colorClass="green"
        />
        <StatsCard
          title="Total consultas"
          value={totalQueries}
          icon={TrendingUp}
          colorClass="purple"
        />

        {/*   <StatsCard
          title="Tasa de error"
          value={`${errorRate}%`}
          icon={AlertCircle}
          colorClass={errorRate > 10 ? "red" : "green"}
        /> */}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-slate-900">Top clientes</h3>
        </div>

        {topClients.length > 0 ? (
          topClients.map((c, i) => (
            <div
              key={i}
              className="flex justify-between p-3 bg-slate-50 rounded-xl mb-2"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-slate-500">{c.email}</p>
              </div>
              <Badge>{c.queries} consultas</Badge>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-center">Sin datos</p>
        )}
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AppLayout>
      <AdminDashboardContent />
    </AppLayout>
  );
}
