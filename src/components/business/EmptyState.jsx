import { PackageSearch } from "lucide-react";

export default function EmptyState({ title = "Sin resultados", description = "No hay informacion para mostrar." }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
      <PackageSearch className="mb-3 h-10 w-10 text-slate-400" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
