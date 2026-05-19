import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categorias } from "@/data/mockData";

const initial = {
  nombre: "",
  marca: "",
  categoria: "Agua",
  precio: "",
  unidad: "unidad",
  stock: "",
  stockMinimo: "",
  ubicacion: "",
  estado: "activo",
};

export default function ProductoForm({ producto, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initial, ...producto });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.nombre?.trim() || !form.marca?.trim()) return;
    onSubmit?.({
      ...form,
      precio: Number(form.precio || 0),
      stock: Number(form.stock || 0),
      stockMinimo: Number(form.stockMinimo || 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" value={form.nombre} onChange={(value) => update("nombre", value)} required />
      <Field label="Marca" value={form.marca} onChange={(value) => update("marca", value)} required />
      <Select label="Categoría" value={form.categoria} onChange={(value) => update("categoria", value)} options={categorias.map((item) => item.nombre)} />
      <Field label="Precio" type="number" value={form.precio} onChange={(value) => update("precio", value)} />
      <Field label="Unidad" value={form.unidad} onChange={(value) => update("unidad", value)} />
      <Field label="Stock" type="number" value={form.stock} onChange={(value) => update("stock", value)} />
      <Field label="Stock mínimo" type="number" value={form.stockMinimo} onChange={(value) => update("stockMinimo", value)} />
      <Field label="Ubicación" value={form.ubicacion} onChange={(value) => update("ubicacion", value)} />
      <Actions onCancel={onCancel} />
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      <input
        required={required}
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Actions({ onCancel }) {
  return (
    <div className="flex justify-end gap-2 sm:col-span-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
        Guardar
      </Button>
    </div>
  );
}
