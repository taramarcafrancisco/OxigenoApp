export default function StockBadge({ stock = 0, minimo = 0 }) {
  const isEmpty = Number(stock) <= 0;
  const isLow = !isEmpty && Number(stock) <= Number(minimo);
  const style = isEmpty
    ? "bg-red-50 text-red-700 border-red-200"
    : isLow
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const label = isEmpty ? "Sin stock" : isLow ? "Stock bajo" : "Disponible";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
      {label}: {stock}
    </span>
  );
}
