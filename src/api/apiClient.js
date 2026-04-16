// src/api/apiClient.js
import { API_BASE_URL } from "../constants.js";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const {
    method = "GET",
    body,
    headers: customHeaders = {},
  } = options;

  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token && endpoint !== "auth/login") {
    headers.Authorization = `Bearer ${token}`;
  }

  const finalBody =
    body === undefined || body === null
      ? undefined
      : typeof body === "string"
      ? body
      : JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    ...(finalBody !== undefined && { body: finalBody }),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;

    try {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        message = json.message || json.error || text || message;
      } catch {
        message = text || message;
      }
    } catch {
      // no-op
    }

    throw new Error(message);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return res.json();
}
