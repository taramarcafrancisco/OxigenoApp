import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientes, productos } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";

export default function PedidoForm({ pedido, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    clienteId: clientes[0]?.id,
    estado: "pendiente",
    observaciones: "",
    items: [{ productoId: productos[0]?.id, cantidad: 1, precioUnitario: productos[0]?.precio || 0 }],
    ...pedido,
  });

  const total = useMemo(
    () => form.items.reduce((sum, item) => sum + Number(item.cantidad || 0) * Number(item.precioUnitario || 0), 0),
    [form.items],
  );

  const updateItem = (index, field, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        if (field === "productoId") {
          const selected = productos.find((producto) => String(producto.id) === String(value));
          return { ...item, productoId: Number(value), nombre: selected?.nombre, precioUnitario: selected?.precio || 0 };
        }
        return { ...item, [field]: value };
      }),
    }));
  };

  const addItem = () =>
    setForm((current) => ({
      ...current,
      items: [...current.items, { productoId: productos[0]?.id, cantidad: 1, precioUnitario: productos[0]?.precio || 0 }],
    }));

  const removeItem = (index) =>
    setForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedClient = clientes.find((cliente) => String(cliente.id) === String(form.clienteId));
    onSubmit?.({
      ...form,
      cliente: selectedClient?.nombre || selectedClient?.razonSocial,
      fecha: new Date().toISOString().slice(0, 10),
      items: form.items.map((item) => {
        const selected = productos.find((producto) => String(producto.id) === String(item.productoId));
        return {
          ...item,
          nombre: item.nombre || selected?.nombre,
          cantidad: Number(item.cantidad || 0),
          precioUnitario: Number(item.precioUnitario || 0),
        };
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Cliente
          <select
            value={form.clienteId}
            onChange={(event) => setForm((current) => ({ ...current, clienteId: Number(event.target.value) }))}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
          >
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre || cliente.razonSocial}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Estado
          <select
            value={form.estado}
            onChange={(event) => setForm((current) => ({ ...current, estado: event.target.value }))}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
          >
            {["pendiente", "preparacion", "entregado", "cancelado"].map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-slate-950">Productos</h3>
          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        {form.items.map((item, index) => (
          <div key={`${item.productoId}-${index}`} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_90px_120px_44px]">
            <select
              value={item.productoId}
              onChange={(event) => updateItem(index, "productoId", event.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
            >
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(event) => updateItem(index, "cantidad", event.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <input
              type="number"
              value={item.precioUnitario}
              onChange={(event) => updateItem(index, "precioUnitario", event.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index)} disabled={form.items.length === 1} title="Quitar producto">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
        Observaciones
        <textarea
          value={form.observaciones}
          onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))}
          rows={3}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
        />
      </label>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <strong className="text-xl text-slate-950">Total: {formatCurrency(total)}</strong>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">Guardar pedido</Button>
        </div>
      </div>
    </form>
  );
}
