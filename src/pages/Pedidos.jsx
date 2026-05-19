import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, Plus } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import SearchInput from "@/components/business/SearchInput";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import FormDialog from "@/components/business/FormDialog";
import PedidoForm from "@/components/business/PedidoForm";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { getPedidoTotal } from "@/data/mockData";
import { pedidoService } from "@/services/pedidoService";
import { formatCurrency, matchesSearch } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

export default function Pedidos() {
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data = [], isLoading } = useQuery({ queryKey: ["pedidos"], queryFn: pedidoService.listar });

  const rows = useMemo(() => data.filter((pedido) => matchesSearch(pedido, query, ["cliente", "estado", "fecha"])), [data, query]);

  const save = async (payload) => {
    await pedidoService.crear(payload);
    toast({ title: "Pedido creado", description: "El pedido quedó listo para preparación." });
    setDialogOpen(false);
  };

  const changeState = async (pedido, estado) => {
    await pedidoService.cambiarEstado(pedido.id, estado);
    toast({ title: "Estado actualizado", description: `Pedido #${pedido.id}: ${estado}.` });
  };

  if (isLoading) return <Loader label="Cargando pedidos..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Pedidos"
        description="Listado, creación, detalle, cambio de estado y cancelación de pedidos."
        actions={<Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Nuevo pedido</Button>}
      />
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar por cliente, fecha o estado" />
      <DataTable
        rows={rows}
        emptyTitle="No hay pedidos"
        columns={[
          { key: "id", header: "Pedido", render: (row) => `#${row.id}` },
          { key: "cliente", header: "Cliente" },
          { key: "fecha", header: "Fecha" },
          { key: "estado", header: "Estado", render: (row) => <BadgeEstado estado={row.estado} /> },
          { key: "total", header: "Total", render: (row) => formatCurrency(getPedidoTotal(row)) },
          {
            key: "acciones",
            header: "Acciones",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm"><Link to={`/pedidos/${row.id}`}><Eye className="h-4 w-4" /> Ver</Link></Button>
                <Button type="button" variant="outline" size="sm" onClick={() => changeState(row, "preparacion")}>Preparar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => changeState(row, "cancelado")}>Cancelar</Button>
              </div>
            ),
          },
        ]}
      />
      <FormDialog open={dialogOpen} title="Nuevo pedido" onClose={() => setDialogOpen(false)}>
        <PedidoForm onSubmit={save} onCancel={() => setDialogOpen(false)} />
      </FormDialog>
    </section>
  );
}
