import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProveedorForm({ proveedor, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    razonSocial: "",
    cuit: "",
    email: "",
    telefono: "",
    rubro: "",
    estado: "activo",
    ...proveedor,
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.razonSocial?.trim() || !form.email?.includes("@")) return;
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      {["razonSocial", "cuit", "email", "telefono", "rubro"].map((field) => (
        <label key={field} className="grid gap-1.5 text-sm font-semibold capitalize text-slate-700">
          {field === "razonSocial" ? "Razón social" : field}
          <input
            required={["razonSocial", "email"].includes(field)}
            type={field === "email" ? "email" : "text"}
            value={form[field] ?? ""}
            onChange={(event) => update(field, event.target.value)}
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
          />
        </label>
      ))}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-blue-900 hover:bg-blue-800">Guardar</Button>
      </div>
    </form>
  );
}
