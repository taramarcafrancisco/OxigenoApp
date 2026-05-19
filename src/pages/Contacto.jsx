import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppLayout from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Phone, ArrowLeft, Send, MessageSquare } from "lucide-react";

function ContactoContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const motivoParam = searchParams.get("motivo") || "ampliacion-cuenta";
  const state = location.state || {};

  const [form, setForm] = useState({
    nombre: state.nombre || "",
    email: state.email || "",
    telefono: state.telefono || "",
    producto: state.producto || "Buscador Campo Unico",
    motivo: motivoParam,
    mensaje:
      state.mensaje ||
      "Hola, quiero solicitar una ampliaciÃ³n de movimientos o un cambio de condicion comercial.",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const abrirMail = () => {
    if (!form.nombre.trim()) {
      toast.error("IngresÃ¡ tu nombre");
      return;
    }

    if (!form.email.trim()) {
      toast.error("IngresÃ¡ tu email");
      return;
    }

    const destinatario = "contacto@ferremanager.com.ar";
    const subject = encodeURIComponent("Solicitud de ampliaciÃ³n de movimientos / cambio de condicion comercial");
    const body = encodeURIComponent(
`Nombre: ${form.nombre}
Email: ${form.email}
TelÃ©fono: ${form.telefono}
Producto: ${form.producto}
Motivo: ${form.motivo}

Mensaje:
${form.mensaje}`
    );

    window.location.href = `mailto:${destinatario}?subject=${subject}&body=${body}`;
    toast.success("Se abriÃ³ tu cliente de correo.");
  };

  const abrirWhatsapp = () => {
    const numero = "541148046755"; // <-- cambiÃ¡ este nÃºmero
    const texto = encodeURIComponent(
`Hola, soy ${form.nombre || "un cliente"}.
Quiero solicitar una ampliaciÃ³n de movimientos o un cambio de condicion comercial.

Email: ${form.email}
TelÃ©fono: ${form.telefono}
Producto: ${form.producto}

Mensaje:
${form.mensaje}`
    );

    window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Contacto comercial
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            SolicitÃ¡ mÃ¡s movimientos o un cambio de condicion comercial
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre
              </label>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <Input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                TelÃ©fono
              </label>
              <Input
                name="telefono"
                value={form.telefono}
                onChange={onChange}
                placeholder="2954..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Producto
              </label>
              <Input
                name="Buscador Campo Unico"
                value={form.producto}
                onChange={onChange}
                readOnly
                className="bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Motivo
            </label>
            <Input
              name="motivo"
              value={form.motivo}
              onChange={onChange}
              readOnly
              className="bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={onChange}
              rows={7}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="EscribÃ­ tu solicitud..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <Button
              type="button"
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={abrirMail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar por email
            </Button>

            <Button
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={abrirWhatsapp}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar por WhatsApp
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Otras vÃ­as de contacto
          </h2>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-600" />
              <span>contacto@ferremanager.com.ar</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-600" />
              <span>+54 11 4804 6755</span>
            </div>

            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-600" />
              <span>AtenciÃ³n comercial para ampliaciÃ³n de movimientos y condiciones</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Contacto() {
  return <ContactoContent />;
}
