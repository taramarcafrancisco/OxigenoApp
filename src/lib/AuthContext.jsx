// src/lib/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

const AuthContext = createContext(null);

async function readRes(res) {
  const text = await res.text().catch(() => "");
  let json = null;

  if (text && (text.trim().startsWith("{") || text.trim().startsWith("["))) {
    try {
      json = JSON.parse(text);
    } catch {}
  }

  return { text, json };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // termina loading inicial
  useEffect(() => {
    setIsLoadingAuth(false);
  }, []);

  // =========================
  // /me -> user FULL
  // =========================
  const fetchMe = async (jwtParam) => {
    const jwt = jwtParam || localStorage.getItem("token");
    console.log("[auth] fetchMe token:", jwt);
    if (!jwt) return null;

    // ✅ asegurate de tener ME en constants:
    // API_ENDPOINTS.ME = "auth/me"
    const url = `${API_BASE_URL}${API_ENDPOINTS.ME}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });
    console.log("[auth] /auth/me status:", res.status, res.statusText);

    const { text, json } = await readRes(res);
    console.log("[auth] /auth/me raw response:", text);
    console.log("[auth] /auth/me parsed response:", json);

    if (!res.ok) {
      const msg = text || `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    // tu /me devuelve el user directo (no {user:...})
    const u = json?.user ?? json?.usuario ?? json ?? null;

    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    }

    return u;
  };

  // =========================
  // login -> token -> /me
  // =========================
  const login = async (email, password) => {
    const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
    console.log("[auth] login request url:", url);
    console.log("[auth] login payload:", { email, password });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("[auth] /auth/login status:", res.status, res.statusText);

    const { text, json } = await readRes(res);
    console.log("[auth] /auth/login raw response:", text);
    console.log("[auth] /auth/login parsed response:", json);

    if (!res.ok) {
      const msg = text || `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    const data = json ?? {};

    const jwt =
      data.token ??
      data.jwt ??
      data.access_token ??
      data.accessToken ??
      data.accessTokenJwt ??
      null;

    if (!jwt) {
      throw new Error("Login OK pero no vino token");
    }
    console.log("[auth] token extracted:", jwt);

    // guardo token
    localStorage.setItem("token", jwt);
    setToken(jwt);
    console.log("[auth] token saved in localStorage:", localStorage.getItem("token"));

    // ✅ SIEMPRE pedir user full
    const fullUser = await fetchMe(jwt);
    console.log("[auth] full user from /me:", fullUser);

    // fallback: si por alguna razón /me no devolvió user, guardo el mini
    if (!fullUser) {
      const uMini = data.user ?? data.usuario ?? null;
      console.log("[auth] fallback user from login response:", uMini);
      if (uMini) {
        localStorage.setItem("user", JSON.stringify(uMini));
        setUser(uMini);
        return uMini;
      }
      return { token: jwt };
    }

    return fullUser;
  };

  // =========================
  // logout
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // =========================
  // al cargar: si hay token, intentar /me
  // (para refrescar user al recargar la página)
  // =========================
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) return;

    // opcional: solo si querés refrescar el user automáticamente
    fetchMe(jwt).catch(() => {
      // si el token murió, limpiamos
      logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isLoadingAuth,
      login,
      me: fetchMe, // por compatibilidad, mantenemos "me"
      refreshMe: fetchMe,
      logout,
    }),
    [token, user, isLoadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
