import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import SearchInput from "@/components/business/SearchInput";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import FormDialog from "@/components/business/FormDialog";
import ClienteForm from "@/components/business/ClienteForm";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { clienteService } from "@/services/clienteService";
import { matchesSearch } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

export default function Clientes() {
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data = [], isLoading } = useQuery({ queryKey: ["clientes"], queryFn: clienteService.listar });

  const rows = useMemo(
    () => data.filter((cliente) => matchesSearch(cliente, query, ["nombre", "razonSocial", "cuit", "email"])),
    [data, query],
  );

  const save = async (payload) => {
    if (payload.id) {
      await clienteService.actualizar(payload.id, payload);
      toast({ title: "Cliente actualizado" });
    } else {
      await clienteService.crear(payload);
      toast({ title: "Cliente creado" });
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const toggle = async (cliente) => {
    const estado = cliente.estado === "activo" ? "inactivo" : "activo";
    await clienteService.cambiarEstado(cliente.id, estado);
    toast({ title: "Estado actualizado", description: `${cliente.nombre} ahora está ${estado}.` });
  };

  if (isLoading) return <Loader label="Cargando clientes..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Alta, edición, búsqueda y activación de clientes comerciales o instaladores."
        actions={<Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> Nuevo cliente</Button>}
      />
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nombre, razón social, CUIT o email" />
      <DataTable
        rows={rows}
        emptyTitle="No hay clientes"
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "razonSocial", header: "Razón social" },
          { key: "cuit", header: "CUIT" },
          { key: "email", header: "Email" },
          { key: "estado", header: "Estado", render: (row) => <BadgeEstado estado={row.estado} /> },
          {
            key: "acciones",
            header: "Acciones",
            render: (row) => (
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { setEditing(row); setDialogOpen(true); }}>Editar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => toggle(row)}>{row.estado === "activo" ? "Desactivar" : "Activar"}</Button>
              </div>
            ),
          },
        ]}
      />
      <FormDialog open={dialogOpen} title={editing ? "Editar cliente" : "Nuevo cliente"} onClose={() => setDialogOpen(false)}>
        <ClienteForm cliente={editing} onSubmit={save} onCancel={() => setDialogOpen(false)} />
      </FormDialog>
    </section>
  );
}
