import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import SearchInput from "@/components/business/SearchInput";
import DataTable from "@/components/business/DataTable";
import Loader from "@/components/business/Loader";
import FormDialog from "@/components/business/FormDialog";
import ProveedorForm from "@/components/business/ProveedorForm";
import BadgeEstado from "@/components/business/BadgeEstado";
import { Button } from "@/components/ui/button";
import { proveedorService } from "@/services/proveedorService";
import { matchesSearch } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";

export default function Proveedores() {
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data = [], isLoading } = useQuery({ queryKey: ["proveedores"], queryFn: proveedorService.listar });

  const rows = useMemo(
    () => data.filter((proveedor) => matchesSearch(proveedor, query, ["razonSocial", "cuit", "email", "rubro"])),
    [data, query],
  );

  const save = async (payload) => {
    if (payload.id) {
      await proveedorService.actualizar(payload.id, payload);
      toast({ title: "Proveedor actualizado" });
    } else {
      await proveedorService.crear(payload);
      toast({ title: "Proveedor creado" });
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const toggle = async (proveedor) => {
    const estado = proveedor.estado === "activo" ? "inactivo" : "activo";
    await proveedorService.cambiarEstado(proveedor.id, estado);
    toast({ title: "Estado actualizado", description: `${proveedor.razonSocial} ahora está ${estado}.` });
  };

  if (isLoading) return <Loader label="Cargando proveedores..." />;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Proveedores"
        description="Gestión de fabricantes, distribuidores y contactos comerciales por rubro."
        actions={<Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> Nuevo proveedor</Button>}
      />
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar por razón social, CUIT, email o rubro" />
      <DataTable
        rows={rows}
        emptyTitle="No hay proveedores"
        columns={[
          { key: "razonSocial", header: "Razón social" },
          { key: "cuit", header: "CUIT" },
          { key: "email", header: "Email" },
          { key: "rubro", header: "Rubro" },
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
      <FormDialog open={dialogOpen} title={editing ? "Editar proveedor" : "Nuevo proveedor"} onClose={() => setDialogOpen(false)}>
        <ProveedorForm proveedor={editing} onSubmit={save} onCancel={() => setDialogOpen(false)} />
      </FormDialog>
    </section>
  );
}
