import PageHeader from "@/components/business/PageHeader";
import CategoryCard from "@/components/business/CategoryCard";
import { categorias } from "@/data/mockData";

export default function Categorias() {
  return (
    <section className="space-y-6">
      <PageHeader title="Categorías" description="Rubros principales para materiales de agua, gas, cloaca, riego y sanitarios." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categorias.map((categoria) => (
          <CategoryCard key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </section>
  );
}
