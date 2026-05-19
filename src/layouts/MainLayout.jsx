import { NavLink, Outlet } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Menu,
  Package,
  Tags,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/clientes", label: "Clientes", icon: UserRound },
  { to: "/proveedores", label: "Proveedores", icon: Truck },
  { to: "/stock", label: "Stock", icon: Boxes },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/catalogo", label: "Catálogo", icon: Gauge },
];

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} title="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
            <Brand />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">Gestión comercial</span>
            <span className="text-sm font-medium text-slate-500">Materiales sanitarios e instalaciones</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
          <SidebarContent />
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/50" type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
            <aside className="relative h-full w-80 max-w-[86vw] bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <Brand />
                <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} title="Cerrar menú">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-950 text-sm font-black text-white">
        FS
      </span>
      <div>
        <p className="text-base font-black leading-tight text-blue-950">materiales butalo</p>
        <p className="text-xs font-semibold text-slate-500">Agua · Gas · Cloaca · Riego</p>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${
                isActive ? "bg-blue-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
      <div className="mt-6 rounded-md border border-orange-100 bg-orange-50 p-4">
        <p className="text-sm font-bold text-orange-800">Modo desarrollo</p>
        <p className="mt-1 text-xs leading-5 text-orange-700">Si el backend no responde, el sistema usa datos mock para mantener la operación visible.</p>
      </div>
    </nav>
  );
}
