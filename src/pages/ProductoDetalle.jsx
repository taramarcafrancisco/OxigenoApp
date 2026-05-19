import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import Loader from "@/components/business/Loader";
import StockBadge from "@/components/business/StockBadge";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { productoService } from "@/services/productoService";
import { formatCurrency, getProductCategory, getProductStock, getProductStockMinimo, toDisplayText } from "@/utils/formatters";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { data: producto, isLoading } = useQuery({ queryKey: ["producto", id], queryFn: () => productoService.obtener(id) });

  if (isLoading) return <Loader label="Cargando producto..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title={producto?.nombre || "Producto"}
        description={`${toDisplayText(producto?.marca, "Sin marca")} · ${getProductCategory(producto)}`}
        actions={<Button asChild variant="outline"><Link to="/productos"><ArrowLeft className="h-4 w-4" /> Volver</Link></Button>}
      />
      <div className="grid gap-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[420px_1fr]">
        <img src={producto?.imagen} alt={producto?.nombre || "Producto"} className="aspect-[4/3] w-full rounded-md object-cover" />
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <BadgeEstado estado={producto?.estado} />
            <StockBadge stock={getProductStock(producto)} minimo={getProductStockMinimo(producto)} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Precio por {toDisplayText(producto?.unidad, "unidad")}</p>
            <p className="text-4xl font-black text-blue-950">{formatCurrency(producto?.precio)}</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Categoría" value={getProductCategory(producto)} />
            <Detail label="Marca" value={producto?.marca} />
            <Detail label="Stock mínimo" value={getProductStockMinimo(producto)} />
            <Detail label="Ubicación" value={producto?.ubicacion} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-900">{toDisplayText(value, "-")}</dd>
    </div>
  );
}
