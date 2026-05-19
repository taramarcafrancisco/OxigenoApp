import { useMemo, useState } from "react";
import { ArrowRight, Droplets, Flame, Leaf, Package, Pipette } from "lucide-react";
import PageHeader from "@/components/business/PageHeader";
import SearchInput from "@/components/business/SearchInput";
import ProductCard from "@/components/business/ProductCard";
import CategoryCard from "@/components/business/CategoryCard";
import { categorias, productos } from "@/data/mockData";
import { matchesSearch } from "@/utils/formatters";

const banners = [
  { title: "Materiales para agua", text: "Termofusion, llaves, conexiones y cañerías para instalaciones eficientes.", icon: Droplets, className: "bg-blue-950 text-white" },
  { title: "Materiales para gas", text: "Sistemas aprobados, válvulas, caños y accesorios para gas.", icon: Flame, className: "bg-slate-900 text-white" },
  { title: "Materiales para cloaca", text: "Tubos y accesorios para desagues cloacales y pluviales.", icon: Pipette, className: "bg-zinc-800 text-white" },
  { title: "Riego", text: "Soluciones para jardines, parques, obras y mantenimiento.", icon: Leaf, className: "bg-emerald-700 text-white" },
  { title: "Redes de gas", text: "Materiales para tendidos, conexiones y proyectos de red.", icon: Flame, className: "bg-orange-600 text-white" },
  { title: "Tanques y accesorios", text: "Reserva de agua, flotantes, bases, tapas y conexiones.", icon: Package, className: "bg-cyan-700 text-white" },
];

export default function Catalogo() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const filtered = useMemo(
    () =>
      productos.filter((producto) => {
        const bySearch = matchesSearch(producto, query, ["nombre", "marca", "categoria"]);
        const byCategory = categoria === "Todas" || producto.categoria === categoria;
        return bySearch && byCategory;
      }),
    [query, categoria],
  );

  return (
    <section className="space-y-8">
      <PageHeader title="Catálogo visual" description="Vista comercial para consultar rubros destacados, productos y materiales por instalación." />

      <div className="grid gap-4 lg:grid-cols-3">
        {banners.map((banner) => {
          const Icon = banner.icon;
          return (
            <article key={banner.title} className={`rounded-md p-5 shadow-sm ${banner.className}`}>
              <Icon className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-black">{banner.title}</h2>
              <p className="mt-2 text-sm leading-6 opacity-85">{banner.text}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                Ver rubro <ArrowRight className="h-4 w-4" />
              </span>
            </article>
          );
        })}
      </div>

      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_240px]">
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar en catálogo" />
        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
        >
          {["Todas", ...categorias.map((item) => item.nombre)].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-950">Categorías destacadas</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categorias.slice(0, 8).map((item) => (
            <CategoryCard key={item.id} categoria={item} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-950">Productos destacados</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>
    </section>
  );
}
