export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const matchesSearch = (item, query, fields) => {
  const search = normalizeText(query);

  if (!search) return true;

  return fields.some((field) => normalizeText(toDisplayText(item?.[field])).includes(search));
};

export const toDisplayText = (value, fallback = "") => {
  if (value == null || value === "") return fallback;
  if (typeof value !== "object") return String(value);

  return (
    value.nombre ||
    value.name ||
    value.descripcion ||
    value.productoNombre ||
    value.razonSocial ||
    fallback
  );
};

export const getProductCategory = (producto) =>
  toDisplayText(producto?.categoria, producto?.categoriaNombre || "Sin categoría");

export const getProductStock = (producto) => {
  const stock = producto?.stock;
  if (stock && typeof stock === "object") {
    return stock.cantidadDisponible ?? stock.cantidad ?? stock.stock ?? 0;
  }

  return stock ?? producto?.cantidadDisponible ?? 0;
};

export const getProductStockMinimo = (producto) => {
  const stock = producto?.stock;
  if (stock && typeof stock === "object") {
    return stock.stockMinimo ?? stock.minimo ?? 0;
  }

  return producto?.stockMinimo ?? 0;
};
