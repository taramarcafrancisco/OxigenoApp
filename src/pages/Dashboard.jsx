import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardList, Package, Tags, Truck, Users } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import DashboardCard from "@/components/business/DashboardCard";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import StockBadge from "@/components/business/StockBadge";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { dashboardService } from "@/services/dashboardService";
import { getPedidoTotal } from "@/data/mockData";
import { formatCurrency, getProductCategory, getProductStock, getProductStockMinimo } from "@/utils/formatters";

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: dashboardService.obtener });

  if (isLoading) return <Loader label="Cargando dashboard..." />;

  const cards = [
    { title: "Productos", value: data?.productos || 0, icon: Package, tone: "blue", detail: "Catálogo administrativo activo" },
    { title: "Pedidos pendientes", value: data?.pedidosPendientes || 0, icon: ClipboardList, tone: "orange", detail: "Pendientes o en preparación" },
    { title: "Stock bajo", value: data?.stockBajo || 0, icon: Boxes, tone: "yellow", detail: "Requieren reposición" },
    { title: "Proveedores activos", value: data?.proveedoresActivos || 0, icon: Truck, tone: "slate", detail: "Habilitados para compra" },
  ];

  const quickActions = [
    { to: "/productos", label: "Productos", icon: Package },
    { to: "/clientes", label: "Clientes", icon: Users },
    { to: "/proveedores", label: "Proveedores", icon: Truck },
    { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
    { to: "/stock", label: "Stock bajo", icon: Boxes },
    { to: "/categorias", label: "Categorías", icon: Tags },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen operativo para ventas, pedidos, stock y proveedores del negocio."
        actions={<Button asChild className="bg-blue-900 hover:bg-blue-800"><Link to="/pedidos">Nuevo pedido</Link></Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-950">Últimos pedidos</h2>
          <DataTable
            rows={data?.ultimosPedidos || []}
            columns={[
              { key: "id", header: "Pedido", render: (row) => `#${row.id}` },
              { key: "cliente", header: "Cliente" },
              { key: "estado", header: "Estado", render: (row) => <BadgeEstado estado={row.estado} /> },
              { key: "total", header: "Total", render: (row) => formatCurrency(getPedidoTotal(row)) },
            ]}
            emptyTitle="No hay pedidos recientes"
          />
        </div>
        <aside className="space-y-4">
          <h2 className="text-lg font-black text-slate-950">Accesos rápidos</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-900">
                  <Icon className="h-5 w-5 text-orange-500" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-950">Alertas de stock</h2>
        <DataTable
          rows={data?.stockCritico || []}
          columns={[
            { key: "nombre", header: "Producto" },
            { key: "categoria", header: "Categoría", render: (row) => getProductCategory(row) },
            { key: "ubicacion", header: "Ubicación" },
            { key: "stock", header: "Estado", render: (row) => <StockBadge stock={getProductStock(row)} minimo={getProductStockMinimo(row)} /> },
          ]}
          emptyTitle="No hay alertas de stock"
        />
      </div>
    </section>
  );
}
