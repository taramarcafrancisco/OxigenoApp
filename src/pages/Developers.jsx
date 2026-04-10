import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import AppLayout from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants.js";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (config.headers?.set) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const full = new URL(
    config.url ?? "",
    config.baseURL ?? window.location.origin,
  ).toString();

  console.log("AXIOS REQ =>", {
    method: config.method,
    full,
    hasAuth: !!token,
  });

  return config;
});

/* =========================
   HELPERS
========================= */
const buildBody = (query) => ({
  query,
  threshold_abs_list: [0.0],
  thresholds_rel_list: [0.5],
  max_addresses_to_show_list: [5],
});

const buildLabelFromApi = (item) => {
  const calle =
    item.NOM_CALLE_ABR_C || item.NOM_CALLE || item.NOM_CALLE_2 || "SIN NOMBRE";

  const desde = item.COD_DESDE ?? "";
  const hasta = item.COD_HASTA ?? "";
  const alturaValida = !(Number(desde) === 0 && Number(hasta) === 0);

  const altura =
    alturaValida && (desde !== "" || hasta !== "") ? `${desde}-${hasta}` : "";

  const localidad = item.LOCALIDAD || item.localidad_original || "";
  const provincia = item.PROVINCIA || "";

  return [calle, altura, localidad, provincia].filter(Boolean).join(", ");
};

const normalizeFromApi = (item) => {
  const calle =
    item.NOM_CALLE_ABR_C || item.NOM_CALLE || item.NOM_CALLE_2 || "";

  const alturaDesde = item.COD_DESDE ?? "";
  const alturaHasta = item.COD_HASTA ?? "";
  const alturaValida = !(
    Number(alturaDesde) === 0 && Number(alturaHasta) === 0
  );

  return {
    direccion: buildLabelFromApi(item),

    provincia: item.PROVINCIA || "",
    partido: item.PARTIDO || "",
    localidad: item.LOCALIDAD || item.localidad_original || "",
    municipio: item.MUNICIPIO ?? "",
    cp: item.CPA || "",
    barrio: item.BAR_NOMBRE || "",

    calle,
    altura: alturaValida ? `${alturaDesde}-${alturaHasta}` : "",
    alturaDesde: alturaValida ? String(alturaDesde) : "",
    alturaHasta: alturaValida ? String(alturaHasta) : "",

    lat: item.LATITUD ?? null,
    lon: item.LONGITUD ?? null,

    similarity: item.similarity ?? item.SIMILARITY ?? null,
  };
};

const isAbortError = (err) =>
  err?.name === "CanceledError" ||
  err?.code === "ERR_CANCELED" ||
  axios.isCancel?.(err);

function DevelopersContent({ user }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [queriesUsed, setQueriesUsed] = useState(0);
  const abortRef = useRef(null);

  console.log("USER DESDE APP LAYOUT:", user);

  const fetchQueriesUsed = async () => {
    const userId = user?.idUsuario || user?.id || user?.usuarioId;

    if (!userId) {
      console.warn("No se encontró id de usuario", user);
      return 0;
    }

    const res = await api.get(
      `${API_ENDPOINTS.CONSULTAS}/usuario/${userId}/count`,
      {
        params: { tipoProducto: "DESARROLLADORES" },
      }
    );

    console.log("RESPUESTA COUNT:", res.data);
    return res.data ?? 0;
  };

  const refreshQueriesUsed = async () => {
    try {
      const total = await fetchQueriesUsed();
      setQueriesUsed(Number(total || 0));
    } catch (err) {
      console.error("Error refrescando consultas usadas:", err);
    }
  };

  useEffect(() => {
    const userId = user?.idUsuario || user?.id || user?.usuarioId;
    if (!userId) return;

    const loadQueries = async () => {
      try {
        const total = await fetchQueriesUsed();
        console.log("CONSULTAS USADAS:", total);
        setQueriesUsed(Number(total || 0));
      } catch (err) {
        console.error("Error cargando consultas:", err);
      }
    };

    loadQueries();
  }, [user]);

  const validateMutation = useMutation({
    mutationFn: async (address) => {
      const startedAt = performance.now();

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let res;
      try {
        res = await api.post(
          API_ENDPOINTS.QUERY_UNSTRUCTURED,
          buildBody(address),
          { signal: controller.signal },
        );
      } catch (err) {
        if (isAbortError(err)) {
          throw new Error("Consulta cancelada");
        }
        throw err;
      }

      const responseTimeMs = Math.round(performance.now() - startedAt);
      const payload = res?.data;

      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload?.items)
              ? payload.items
              : [];

      if (!list.length) {
        const emptyResult = {
          validated: false,
          status: "no_results",
          input: address,
          normalized_address: "",
          components: {},
          coordinates: null,
          confidence: 0.0,
          timestamp: new Date().toISOString(),
          response_time_ms: responseTimeMs,
          raw: payload ?? null,
        };

        try {
          await api.post(API_ENDPOINTS.CONSULTAS, {
            consulta: address,
            direccionNormalizada: "",
            latitud: null,
            longitud: null,
            confianza: 0,
            validada: false,
            respuestaCompleta: JSON.stringify(emptyResult),
            tipoProducto: "DESARROLLADORES",
          });
          await refreshQueriesUsed();

        } catch (saveError) {
          if (saveError.response?.status === 403) {
            toast.error("Has alcanzado el límite de consultas de tu plan.");
            throw new Error("Has alcanzado el límite de consultas de tu plan.");
          }
          console.error("Error guardando consulta vacía:", saveError);
        }

        return emptyResult;
      }

      const bestRaw = list[0];
      const selectedItem = normalizeFromApi(bestRaw);

      const validated = !!(selectedItem.lat && selectedItem.lon);

      const confidence =
        selectedItem.similarity != null
          ? Math.max(0, Math.min(1, Number(selectedItem.similarity)))
          : validated
            ? 0.75
            : 0.0;

      const inputNumberMatch = address.match(/\d+/);
      const inputNumber = inputNumberMatch ? inputNumberMatch[0] : "";

      const normalizedAddressWithNumber = inputNumber
        ? `${selectedItem.calle} ${inputNumber}, ${selectedItem.localidad}, ${selectedItem.provincia}${selectedItem.cp ? `, CP ${selectedItem.cp}` : ""}`
        : `${selectedItem.direccion}${selectedItem.cp ? `, CP ${selectedItem.cp}` : ""}`;

      const result = {
        validated,
        status: validated ? "success" : "partial",
        input: address,
        normalized_address: normalizedAddressWithNumber,
        components: {
          street: selectedItem.calle || "",
          number: inputNumber,
          barrio: selectedItem.barrio || "",
          localidad: selectedItem.localidad || "",
          postal_code: selectedItem.cp || "",
          partido: selectedItem.partido || "",
          provincia: selectedItem.provincia || "",
          rango: selectedItem.altura || "",
        },
        coordinates: validated
          ? {
              lat: Number(selectedItem.lat),
              lng: Number(selectedItem.lon),
            }
          : null,
        confidence,
        timestamp: new Date().toISOString(),
        response_time_ms: responseTimeMs,
        raw: {
          best: bestRaw,
          list_size: list.length,
        },
      };

      try {
        await api.post(API_ENDPOINTS.CONSULTAS, {
          consulta: address,
          direccionNormalizada: result.normalized_address,
          latitud: result.coordinates?.lat ?? null,
          longitud: result.coordinates?.lng ?? null,
          confianza: result.confidence,
          validada: result.validated,
          respuestaCompleta: JSON.stringify(result.raw),
          tipoProducto: "DESARROLLADORES",
        });

        await refreshQueriesUsed();
      } catch (saveError) {
        if (saveError.response?.status === 403) {
          toast.error("Has alcanzado el límite de consultas de tu plan.");
          throw new Error("Has alcanzado el límite de consultas de tu plan.");
        }

        console.error("Error guardando consulta:", saveError);
      }

      return result;
    },
  });

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();

    if (cmd === "clear") {
      setHistory([]);
      setCommand("");
      return;
    }

    setHistory((prev) => [...prev, { type: "command", content: cmd }]);

    if (cmd.startsWith("validate ")) {
      const address = cmd.replace("validate ", "").trim();

      setHistory((prev) => [
        ...prev,
        { type: "loading", content: "Procesando consulta..." },
      ]);

      try {
        const result = await validateMutation.mutateAsync(address);

        setHistory((prev) => {
          const next = [...prev];
          next.pop();
          next.push({ type: "response", content: result });
          return next;
        });

        toast.success("Consulta realizada exitosamente");
      } catch (error) {
        setHistory((prev) => {
          const next = [...prev];
          next.pop();
          next.push({
            type: "error",
            content: { error: error?.message || "Validation failed" },
          });
          return next;
        });

        toast.error(error?.message || "Error al consultar");
      }
    } else if (cmd === "help") {
      setHistory((prev) => [
        ...prev,
        {
          type: "help",
          content: {
            commands: [
              {
                cmd: "validate <address>",
                desc: "Valida y normaliza una dirección",
              },
              { cmd: "cancel", desc: "Cancela una consulta en curso" },
              { cmd: "clear", desc: "Limpia la terminal" },
              { cmd: "help", desc: "Muestra esta ayuda" },
            ],
          },
        },
      ]);
    } else if (cmd === "cancel") {
      if (abortRef.current) abortRef.current.abort();

      setHistory((prev) => [
        ...prev,
        {
          type: "response",
          content: { ok: true, canceled: true, message: "Consulta cancelada" },
        },
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: "error",
          content: {
            error: `Comando desconocido: ${cmd}. Usa 'help' para ver comandos disponibles.`,
          },
        },
      ]);
    }

    setCommand("");
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedIndex(index);
    toast.success("JSON copiado al portapapeles");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const statusBadge = useMemo(() => {
    if (validateMutation.isPending) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Consultando…
        </Badge>
      );
    }

    if (validateMutation.isError) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300">Error</Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-700 border-green-300">
        Operacional
      </Badge>
    );
  }, [validateMutation.isPending, validateMutation.isError]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Developer Console
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Interfaz de línea de comandos para validación de direcciones
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Consultas usadas
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {queriesUsed}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            API Base
          </div>
          <div className="text-sm font-mono text-slate-900 dark:text-white break-all">
            {API_BASE_URL}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Estado
          </div>
          {statusBadge}
        </Card>
      </div>

      <Card className="bg-slate-950 dark:bg-slate-950 border-slate-800 overflow-hidden">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2">oxigeno-cli</span>
          <span className="text-xs text-slate-600 ml-auto">
            {validateMutation.isPending ? "RUNNING" : "IDLE"}
          </span>
        </div>

        <div className="p-6 font-mono text-sm max-h-[600px] overflow-y-auto">
          {history.length === 0 && (
            <div className="text-green-400 mb-4">
              <div>oxigeno Developer Console v1.0</div>
              <div className="text-slate-500 mt-2">
                Escribe <span className="text-cyan-400">help</span> para ver
                comandos disponibles
              </div>
              <div className="text-slate-500 mt-1">
                Tip: <span className="text-cyan-400">cancel</span> aborta una
                consulta en curso
              </div>
            </div>
          )}

          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index}>
                {item.type === "command" && (
                  <div className="text-cyan-400">
                    <span className="text-green-400">$</span> {item.content}
                  </div>
                )}

                {item.type === "loading" && (
                  <div className="text-yellow-400 animate-pulse">
                    ⏳ {item.content}
                  </div>
                )}

                {item.type === "response" && (
                  <div className="relative group">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(item.content, index)}
                      className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-green-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(item.content, null, 2)}
                    </pre>
                  </div>
                )}

                {item.type === "error" && (
                  <pre className="text-red-400 bg-red-950/30 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(item.content, null, 2)}
                  </pre>
                )}

                {item.type === "help" && (
                  <div className="text-slate-300 space-y-2">
                    <div className="text-cyan-400 font-semibold mb-3">
                      Comandos disponibles:
                    </div>
                    {item.content.commands.map((cmd, i) => (
                      <div key={i} className="ml-4">
                        <span className="text-green-400">{cmd.cmd}</span>
                        <span className="text-slate-500 ml-4">
                          - {cmd.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent outline-none text-cyan-400"
                placeholder="Escribe un comando..."
                autoFocus
              />
            </div>
          </form>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          📖 Ejemplos de uso
        </h3>
        <div className="space-y-3 font-mono text-sm">
          <div>
            <code className="block bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-slate-700 dark:text-slate-300">
              validate Av. Corrientes 1234
            </code>
          </div>
          <div>
            <code className="block bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-slate-700 dark:text-slate-300">
              validate Av. Santa Fe 2500, CABA
            </code>
          </div>
          <div>
            <code className="block bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-slate-700 dark:text-slate-300">
              cancel
            </code>
          </div>
          <div>
            <code className="block bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-slate-700 dark:text-slate-300">
              clear
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Developers() {
  return (
    <AppLayout>
      <DevelopersContent />
    </AppLayout>
  );
}
