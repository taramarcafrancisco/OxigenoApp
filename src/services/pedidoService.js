import api from "./api";
import { pedidos } from "@/data/mockData";
import { createMockCrudService, withMockFallback } from "./serviceHelpers";

export const pedidoService = {
  ...createMockCrudService("/pedidos", api, pedidos),
  cancelar: (id) => withMockFallback(() => api.patch(`/pedidos/${id}/cancelar`), { id, estado: "cancelado" }),
};
