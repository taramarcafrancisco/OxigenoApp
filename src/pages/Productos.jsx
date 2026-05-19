import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Grid2X2, List, Plus } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import ProductCard from "@/components/business/ProductCard";
import SearchInput from "@/components/business/SearchInput";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import EmptyState from "@/components/business/EmptyState";
import FormDialog from "@/components/business/FormDialog";
import ProductoForm from "@/components/business/ProductoForm";
import BadgeEstado from "@/components/business/BadgeEstado";
import StockBadge from "@/components/business/StockBadge";
import { Button } from "@/components/ui/button";
import { categorias } from "@/data/mockData";
import { productoService } from "@/services/productoService";
import { formatCurrency, getProductCategory, getProductStock, getProductStockMinimo, matchesSearch, toDisplayText } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

export default function Productos() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState(params.get("categoria") || "Todas");
  const [marca, setMarca] = useState("Todas");
  const [view, setView] = useState("cards");
  const [editing, setEditing] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data = [], isLoading } = useQuery({ queryKey: ["productos"], queryFn: productoService.listar });

  const marcas = useMemo(
    () => ["Todas", ...new Set(data.map((producto) => toDisplayText(producto?.marca)).filter(Boolean))],
    [data],
  );

  const filtered = useMemo(
    () =>
      data.filter((producto) => {
        const bySearch = matchesSearch(producto, query, ["nombre", "marca", "categoria"]);
        const byCategory = categoria === "Todas" || getProductCategory(producto) === categoria;
        const byBrand = marca === "Todas" || toDisplayText(producto?.marca) === marca;
        return bySearch && byCategory && byBrand;
      }),
    [data, query, categoria, marca],
  );

  const saveProduct = async (payload) => {
    if (payload.id) {
      await productoService.actualizar(payload.id, payload);
      toast({ title: "Producto actualizado", description: "Los cambios quedaron registrados." });
    } else {
      await productoService.crear(payload);
      toast({ title: "Producto creado", description: "El producto se agregó correctamente." });
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const toggleProduct = async (producto) => {
    const nextState = producto?.estado === "activo" ? "inactivo" : "activo";
    await productoService.cambiarEstado(producto.id, nextState);
    toast({ title: "Estado actualizado", description: `${producto.nombre} ahora está ${nextState}.` });
  };

  if (isLoading) return <Loader label="Cargando productos..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Productos"
        description="Listado comercial con búsqueda, filtros, stock, precio y estado de cada producto."
        actions={
          <>
            <Button type="button" variant={view === "cards" ? "default" : "outline"} size="icon" onClick={() => setView("cards")} title="Ver cards">
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant={view === "table" ? "default" : "outline"} size="icon" onClick={() => setView("table")} title="Ver tabla">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          </>
        }
      />

      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_220px]">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por producto, marca o categoría" />
        <Filter value={categoria} onChange={setCategoria} options={["Todas", ...categorias.map((item) => item.nombre)]} />
        <Filter value={marca} onChange={setMarca} options={marcas} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No hay productos" description="Probá limpiar filtros o crear un nuevo producto." />
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEdit={(item) => { setEditing(item); setDialogOpen(true); }}
              onToggle={toggleProduct}
            />
          ))}
        </div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: "nombre", header: "Producto" },
            { key: "marca", header: "Marca" },
            { key: "categoria", header: "Categoría", render: (row) => getProductCategory(row) },
            { key: "precio", header: "Precio", render: (row) => formatCurrency(row.precio) },
            { key: "stock", header: "Stock", render: (row) => <StockBadge stock={getProductStock(row)} minimo={getProductStockMinimo(row)} /> },
            { key: "estado", header: "Estado", render: (row) => <BadgeEstado estado={row.estado} /> },
            {
              key: "acciones",
              header: "Acciones",
              render: (row) => (
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => { setEditing(row); setDialogOpen(true); }}>Editar</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggleProduct(row)}>{row.estado === "activo" ? "Desactivar" : "Activar"}</Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <FormDialog open={dialogOpen} title={editing ? "Editar producto" : "Nuevo producto"} onClose={() => setDialogOpen(false)}>
        <ProductoForm producto={editing} onSubmit={saveProduct} onCancel={() => setDialogOpen(false)} />
      </FormDialog>
    </section>
  );
}

function Filter({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
