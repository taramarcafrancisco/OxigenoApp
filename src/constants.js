// src/constants.js

const DEFAULT_API_BASE_URL = "http://localhost:5388/api/";

const normalizeApiBaseUrl = (url) => {
  if (!url) return DEFAULT_API_BASE_URL;
  return url.endsWith("/") ? url : `${url}/`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL
);

export const API_ENDPOINTS = {
  LOGIN: "auth/login",
  ME: "auth/me",
  QUERY_UNSTRUCTURED: "query/unstructured",
  CONSULTAS: "consultas",
  CONSULTAS_MIAS: "consultas/mias",
  ADMIN_USUARIOS: "admin/usuarios",
  ADMIN_CONSULTAS: "admin/consultas",
};

export const OFFLINE_MODE = false;
