import { Edit3, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProductCategory, getProductStock, getProductStockMinimo, toDisplayText } from "@/utils/formatters";
import BadgeEstado from "./BadgeEstado";
import StockBadge from "./StockBadge";

export default function ProductCard({ producto, onEdit, onToggle }) {
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-100">
        <img
          src={producto?.imagen}
          alt={producto?.nombre || "Producto"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">{toDisplayText(producto?.marca, "Sin marca")}</p>
            <h3 className="mt-1 line-clamp-2 min-h-10 text-base font-bold text-slate-950">{toDisplayText(producto?.nombre, "Producto sin nombre")}</h3>
          </div>
          <BadgeEstado estado={producto?.estado} />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{getProductCategory(producto)}</span>
          <StockBadge stock={getProductStock(producto)} minimo={getProductStockMinimo(producto)} />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Precio por {toDisplayText(producto?.unidad, "unidad")}</p>
            <p className="text-xl font-bold text-slate-950">{formatCurrency(producto?.precio)}</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={() => onEdit?.(producto)} title="Editar producto">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => onToggle?.(producto)} title="Activar o desactivar">
              <Power className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
