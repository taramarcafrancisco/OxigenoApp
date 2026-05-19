import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import SearchInput from "@/components/business/SearchInput";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import StockBadge from "@/components/business/StockBadge";
import { Button } from "@/components/ui/button";
import { stockService } from "@/services/stockService";
import { getProductCategory, getProductStock, getProductStockMinimo, matchesSearch, toDisplayText } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

export default function Stock() {
  const [query, setQuery] = useState("");
  const { data = [], isLoading } = useQuery({ queryKey: ["stock"], queryFn: stockService.listar });

  const rows = useMemo(
    () => data.filter((producto) => matchesSearch(producto, query, ["nombre", "marca", "categoria", "ubicacion"])),
    [data, query],
  );

  const adjust = async (producto) => {
    await stockService.ajustar(producto.id, { cantidad: getProductStock(producto), motivo: "Ajuste manual" });
    toast({ title: "Ajuste registrado", description: `Stock revisado para ${toDisplayText(producto.nombre, "el producto")}.` });
  };

  if (isLoading) return <Loader label="Cargando stock..." />;

  return (
    <section className="space-y-6">
      <PageHeader title="Stock" description="Control de stock actual, mínimos, ubicación y alertas de reposición." />
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar por producto, marca, categoría o ubicación" />
      <DataTable
        rows={rows}
        emptyTitle="No hay productos en stock"
        columns={[
          { key: "nombre", header: "Producto" },
          { key: "categoria", header: "Categoría", render: (row) => getProductCategory(row) },
          { key: "stock", header: "Stock actual", render: (row) => <StockBadge stock={getProductStock(row)} minimo={getProductStockMinimo(row)} /> },
          { key: "stockMinimo", header: "Mínimo", render: (row) => getProductStockMinimo(row) },
          { key: "ubicacion", header: "Ubicación" },
          {
            key: "alerta",
            header: "Alerta",
            render: (row) => (Number(getProductStock(row)) <= Number(getProductStockMinimo(row)) ? "Reponer" : "Normal"),
          },
          {
            key: "acciones",
            header: "Acciones",
            render: (row) => (
              <Button type="button" variant="outline" size="sm" onClick={() => adjust(row)}>
                <SlidersHorizontal className="h-4 w-4" />
                Ajustar
              </Button>
            ),
          },
        ]}
      />
    </section>
  );
}
