export default function Loader({ label = "Cargando informacion..." }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-md border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-800 border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
