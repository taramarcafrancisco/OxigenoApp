import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const userMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'Dashboard' },
  { icon: CreditCard, label: 'Mi Plan', page: 'MyPlan' },
  { icon: BarChart3, label: 'Rutina', page: 'Usage' },
];

const adminMenuItems = [
  { icon: Shield, label: 'Admin Dashboard', page: 'AdminDashboard' },
  { icon: Users, label: 'Clientes', page: 'Clients' },
  { icon: FileText, label: 'Gestión Planes', page: 'ManagePlans' },
];

export default function Sidebar({ user, isAdmin }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const MenuItem = ({ item }) => {
    if (item.hasSubmenu) {
      const isOpen = openSubmenu === item.label;
      const isAnySubmenuActive = item.submenu.some(sub => currentPath.includes(sub.page));

      return (
        <div>
          <button
            onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border",
              isAnySubmenuActive
                ? "bg-lime-400/10 border-lime-400/20 text-lime-300"
                : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:border-white/10 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", isAnySubmenuActive && "text-lime-400")} />
            <span className="flex-1 text-left">{item.label}</span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isOpen && (
            <div className="ml-6 mt-2 space-y-2">
              {item.submenu.map((subItem) => {
                const isActive = currentPath.includes(subItem.page);
                return (
                  <Link
                    key={subItem.label}
                    to={createPageUrl(subItem.page)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border",
                      isActive
                        ? "bg-lime-400/10 border-lime-400/20 text-lime-300 font-medium"
                        : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900 hover:border-white/10 hover:text-white"
                    )}
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = currentPath.includes(item.page);

    return (
      <Link
        to={createPageUrl(item.page)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border",
          isActive
            ? "bg-lime-400/10 border-lime-400/20 text-lime-300 shadow-[0_0_0_1px_rgba(163,230,53,0.08)]"
            : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:border-white/10 hover:text-white"
        )}
      >
        <item.icon className={cn("w-5 h-5", isActive ? "text-lime-400" : "text-zinc-500")} />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-black border-r border-white/10 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="oxigeno Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-semibold text-white tracking-tight">oxigeno</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
            Principal
          </p>
          {userMenuItems.map((item) => (
            <MenuItem key={item.page} item={item} />
          ))}
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-white/10">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
              Administración
            </p>
            {adminMenuItems.map((item) => (
              <MenuItem key={item.page} item={item} />
            ))}
          </div>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-orange-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
            {user?.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email || 'Usuario'}
            </p>
            <p className="text-xs text-zinc-500">
              {isAdmin ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}