// src/api/PlansApi.js
import { apiFetch } from "./apiClient";

export const PlansApi = {
  list: async () => {
    const res = await apiFetch("planes");
    return res?.content ?? res; // ✅ soporta paginado o lista directa
  },

  getById: (id) => apiFetch(`planes/${id}`),

  create: (data) =>
    apiFetch("planes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`planes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`planes/${id}`, {
      method: "DELETE",
    }),
};
