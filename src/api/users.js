// src/api/UsersApi.js
import { apiFetch } from "./apiClient";

export const UsersApi = {
  // =========================
  // AUTH
  // =========================

  login: (email, password) =>
    apiFetch("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch("auth/me"),

  // =========================
  // USERS
  // =========================

  list: async () => {
    const res = await apiFetch("usuarios");
    return res?.content ?? res;
  },

  create: (data) =>
    apiFetch("usuarios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

      updateMe: (data) =>
    apiFetch("auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  // DESACTIVAR (estado = 0)

  deactivate: (id) =>
    apiFetch(`usuarios/${id}/deactivate`, {
      method: "PUT",
    }),

  // ELIMINAR DE LA BASE

  delete: (id) =>
    apiFetch(`usuarios/${id}`, {
      method: "DELETE",
    }),

  // CAMBIAR PLAN

  changePlan: (usuarioId, planId) =>
    apiFetch(`usuarios/${usuarioId}/plan/${planId}`, {
      method: "PUT",
    }),

  // CONSULTAS EXTRA

  addConsultasExtra: (usuarioId, cantidad) =>
    apiFetch(`usuarios/${usuarioId}/consultasExtra?cantidad=${cantidad}`, {
      method: "PUT",
    }),

  changePassword: (data) =>
    apiFetch("auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),



};
