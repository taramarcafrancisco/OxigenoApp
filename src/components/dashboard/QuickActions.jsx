import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, History, TrendingUp, ArrowRight } from 'lucide-react';

const actions = [
  {
    icon: Search,
    title: 'Nueva movimiento',
    description: 'Validar una direcciÃ³n',
    page: 'NewQuery',
    color: 'blue'
  },
  {
    icon: History,
    title: 'Ver historial',
    description: 'movimientos recientes',
    page: 'History',
    color: 'purple'
  },
  {
    icon: TrendingUp,
    title: 'Ver consumo',
    description: 'EstadÃ­sticas detalladas',
    page: 'Usage',
    color: 'green'
  }
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-500 group-hover:bg-blue-100",
  purple: "bg-purple-50 text-purple-500 group-hover:bg-purple-100",
  green: "bg-green-50 text-green-500 group-hover:bg-green-100"
};

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones rÃ¡pidas</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.page}
            to={createPageUrl(action.page)}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colorClasses[action.color]}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{action.title}</p>
              <p className="text-xs text-slate-500">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
