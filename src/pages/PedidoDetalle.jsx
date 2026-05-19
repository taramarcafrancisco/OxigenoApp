import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { getPedidoTotal } from "@/data/mockData";
import { pedidoService } from "@/services/pedidoService";
import { formatCurrency } from "@/utils/formatters";

export default function PedidoDetalle() {
  const { id } = useParams();
  const { data: pedido, isLoading } = useQuery({ queryKey: ["pedido", id], queryFn: () => pedidoService.obtener(id) });

  if (isLoading) return <Loader label="Cargando pedido..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Pedido #${pedido?.id || id}`}
        description={pedido?.cliente ? `Cliente: ${pedido.cliente}` : "Detalle no disponible"}
        actions={<Button asChild variant="outline"><Link to="/pedidos"><ArrowLeft className="h-4 w-4" /> Volver</Link></Button>}
      />

      <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-4">
        <Info label="Fecha" value={pedido?.fecha || "-"} />
        <Info label="Estado" value={<BadgeEstado estado={pedido?.estado} />} />
        <Info label="Observaciones" value={pedido?.observaciones || "Sin observaciones"} />
        <Info label="Total" value={formatCurrency(getPedidoTotal(pedido))} strong />
      </div>

      <DataTable
        rows={pedido?.items || []}
        emptyTitle="El pedido no tiene productos"
        columns={[
          { key: "nombre", header: "Producto" },
          { key: "cantidad", header: "Cantidad" },
          { key: "precioUnitario", header: "Precio unitario", render: (row) => formatCurrency(row.precioUnitario) },
          { key: "subtotal", header: "Subtotal", render: (row) => formatCurrency(Number(row.cantidad || 0) * Number(row.precioUnitario || 0)) },
        ]}
      />
    </section>
  );
}

function Info({ label, value, strong }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <div className={`mt-2 text-sm ${strong ? "text-xl font-black text-blue-950" : "font-semibold text-slate-800"}`}>{value}</div>
    </div>
  );
}
