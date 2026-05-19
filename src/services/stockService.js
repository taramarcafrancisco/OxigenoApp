import api from "./api";
import { productos } from "@/data/mockData";
import { withMockFallback } from "./serviceHelpers";

export const stockService = {
  listar: () => withMockFallback(() => api.get("/stock"), productos),
  ajustar: (productoId, payload) =>
    withMockFallback(() => api.post(`/stock/${productoId}/ajustes`, payload), { productoId, ...payload }),
};
