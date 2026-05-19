import api from "./api";
import { dashboard, pedidos, productos, proveedores } from "@/data/mockData";
import { withMockFallback } from "./serviceHelpers";

export const dashboardService = {
  obtener: () =>
    withMockFallback(() => api.get("/dashboard"), {
      ...dashboard,
      ultimosPedidos: pedidos.slice(0, 5),
      stockCritico: productos.filter((producto) => producto.stock <= producto.stockMinimo),
      proveedores: proveedores.filter((proveedor) => proveedor.estado === "activo"),
    }),
};
