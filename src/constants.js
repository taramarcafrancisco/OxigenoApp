// src/constants/constants.js

// Backend REAL
//export const API_BASE_URL = "https://webservice.startb.com.ar/oxigeno-webservice/api/";
export const API_BASE_URL = "http://localhost:5388/api/";

// Endpoints relativos al API_BASE_URL
export const API_ENDPOINTS = {
  LOGIN: "auth/login",
  ME: "auth/me",
  QUERY_UNSTRUCTURED: "query/unstructured",

  CONSULTAS: "consultas",
  CONSULTAS_MIAS: "consultas/mias",

  ADMIN_USUARIOS: "admin/usuarios",
  ADMIN_CONSULTAS: "admin/consultas",
};

// Flags
export const OFFLINE_MODE = true;