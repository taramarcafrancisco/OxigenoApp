// @ts-nocheck
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import logo from "../assets/logo.png";

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
  LayoutDashboard,
  CreditCard,
  Hammer,
  Users,
  Shield,
  FileText,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/app/ThemeToggle";

const userMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: createPageUrl("Dashboard") },
  { icon: CreditCard, label: "Mi Cuenta", to: createPageUrl("MyPlan") },
  { icon: Hammer, label: "Catalogo", to: createPageUrl("Usage") },
];

const adminMenuItems = [
  {
    icon: Shield,
    label: "Admin Dashboard",
    to: createPageUrl("AdminDashboard"),
  },
  { icon: Users, label: "Clientes", to: createPageUrl("Clients") },
  { icon: FileText, label: "Condiciones comerciales", to: createPageUrl("ManagePlans") },
];

export default function Header({ user, isAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fullName =
    [user?.nombre, user?.apellido].filter(Boolean).join(" ") || "Usuario";

  return (
    <header className="sticky top-0 z-40 border-b border-orange-500/10 bg-zinc-950/95 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-100 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 border-r border-orange-500/10 bg-zinc-950 p-0"
              >
                <div className="border-b border-orange-500/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="FerreManager Logo"
                      className="h-10 w-10 object-contain"
                    />
                    <span className="text-xl font-semibold text-white">FerreManager</span>
                  </div>
                </div>

                <nav className="space-y-1 p-4">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Principal
                  </p>

                  {userMenuItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-orange-500/10 hover:text-orange-200"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}

                  {isAdmin && (
                    <div className="mt-4 border-t border-orange-500/10 pt-4">
                      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Administracion
                      </p>

                      {adminMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-orange-500/10 hover:text-orange-200"
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <img
              src={logo}
              alt="FerreManager Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-semibold text-white">FerreManager</span>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full border border-orange-500/10 bg-zinc-900 text-zinc-400 hover:bg-orange-500/10 hover:text-orange-200"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 rounded-full border border-orange-500/10 bg-zinc-900/80 pl-2 pr-3 text-zinc-100 hover:bg-zinc-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-amber-400 to-red-500 text-sm font-medium text-black shadow-[0_0_20px_rgba(249,115,22,0.28)]">
                    {user?.nombre?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-tight text-white">
                      {fullName}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "h-5 rounded-full px-2 py-0 text-[11px]",
                        isAdmin
                          ? "border border-orange-500/20 bg-orange-500/15 text-orange-300"
                          : "border border-white/10 bg-zinc-800 text-zinc-300"
                      )}
                    >
                      {isAdmin ? "Admin" : "Cliente"}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 border-orange-500/10 bg-zinc-950 text-zinc-100"
              >
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-white">{fullName}</p>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild>
                  <Link
                    to={createPageUrl("Dashboard")}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings">Configuracion</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 focus:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

