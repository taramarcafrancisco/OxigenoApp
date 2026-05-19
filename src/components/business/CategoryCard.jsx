import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryCard({ categoria }) {
  const Icon = categoria?.icon;

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border ${categoria?.color || "bg-slate-50 text-slate-700 border-slate-200"}`}>
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <h3 className="text-lg font-bold text-slate-950">{categoria?.nombre}</h3>
      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500">{categoria?.descripcion}</p>
      <Link
        to={`/productos?categoria=${encodeURIComponent(categoria?.nombre || "")}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-orange-600"
      >
        Ver productos
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
