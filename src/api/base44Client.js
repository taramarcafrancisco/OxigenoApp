// src/api/base44Client.js
// ✅ "Shim" offline: no usa Base44 real.
// ✅ Devuelve SIEMPRE el usuario autenticado real del AuthContext (localStorage).
// ✅ Si no hay sesión, devuelve null o tira error (configurable).

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("token");
}

function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? safeJsonParse(raw) : null;
}

/**
 * Si querés mantener compatibilidad con UI vieja que esperaba:
 * { id, email, name, roles: [] }
 * podés mapear tu user real a esa forma.
 */
function toBase44UserShape(u) {
  if (!u) return null;

  const name =
    [u.nombre, u.apellido].filter(Boolean).join(" ") ||
    u.name ||
    u.email ||
    "Usuario";

  const role =
    u.role || (u.role_id === 1 ? "ADMIN" : "USER") || "USER";

  return {
    id: u.id ?? "local-user",
    email: u.email ?? "unknown@local",
    name,
    roles: Array.isArray(u.roles) ? u.roles : [role],
    // dejo también lo real por si querés usarlo
    ...u,
  };
}

export const base44 = {
  auth: {
    me: async () => {
      const u = getStoredUser();
      // si querés que "me" falle cuando no hay sesión:
      // if (!u) throw new Error("No autenticado");
      return toBase44UserShape(u);
    },
    logout: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    },
    redirectToLogin: () => {},
  },

  entities: {
    User: {
      me: async () => {
        const u = getStoredUser();
        return toBase44UserShape(u);
      },
    },
  },

  // (opcional) expone el token por compatibilidad si alguna parte lo usa
  get token() {
    return getStoredToken();
  },

  analytics: {
    trackBatch: async () => ({ ok: true }),
  },

  functions: new Proxy(
    {},
    {
      get: () => async () => ({ ok: true }),
    }
  ),
};
