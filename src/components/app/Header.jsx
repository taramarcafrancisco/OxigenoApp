import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
  

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  History,
  Search,
  Users,
  Shield,
  FileText,
  Bell,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/app/ThemeToggle";

const logo = "/images/logo.png";

const userMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: createPageUrl("Dashboard") },
  { icon: CreditCard, label: "Mi Plan", to: createPageUrl("MyPlan") },
  { icon: BarChart3, label: "Consumo", to: createPageUrl("Usage") },
  { icon: History, label: "Historial", to: createPageUrl("History") },
];

const productMenuItems = [
  // Define product menu items here if needed, e.g.:
  // { tipoProducto: "tipo1", label: "Producto 1", to: "/product1" },
];

const adminMenuItems = [
  {
    icon: Shield,
    label: "Admin Dashboard",
    to: createPageUrl("AdminDashboard"),
  },
  { icon: Users, label: "Clientes", to: createPageUrl("Clients") },
  { icon: FileText, label: "Gestión Planes", to: createPageUrl("ManagePlans") },
];

export default function Header({ user, isAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fullName =
    [user?.nombre, user?.apellido].filter(Boolean).join(" ") || "Usuario";

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="Oxigeno Logo"
                      className="w-10 h-10 object-contain"
                    />
                    <span className="text-xl font-semibold text-slate-800 dark:text-white">
                      Oxigeno
                    </span>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Principal
                  </p>

                  {userMenuItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <span>Productos</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          mobileProductsOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {mobileProductsOpen && (
                      <div className="mt-1 ml-5 space-y-1">
                        {productMenuItems.map((item) => (
                          <Link
                            key={item.tipoProducto}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Administración
                      </p>

                      {adminMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Oxigeno Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              Oxigeno
            </span>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-600 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 pl-2 pr-3 h-10"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.nombre?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-700 leading-tight">
                      {fullName}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs px-1.5 py-0 h-4",
                        isAdmin
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {isAdmin ? "Admin" : "Usuario"}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-slate-900">
                    {fullName}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    to={createPageUrl("Dashboard")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings">Configuración</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
