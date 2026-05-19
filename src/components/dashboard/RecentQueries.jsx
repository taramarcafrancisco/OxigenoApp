import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "../../components/ui/badge";
import { CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { cn } from "../../lib/utils";

const statusConfig = {
  success: {
    icon: CheckCircle,
    label: 'Exitosa',
    className: 'bg-green-100 text-green-700 border-green-200'
  },
  error: {
    icon: XCircle,
    label: 'Error',
    className: 'bg-red-100 text-red-700 border-red-200'
  },
  pending: {
    icon: Clock,
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }
};

export default function RecentQueries({ queries = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">movimientos recientes</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-4 p-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">movimientos recientes</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">Sin movimientos aÃºn</p>
          <p className="text-sm text-slate-500 mt-1">Tus movimientos aparecerÃ¡n aquÃ­</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">movimientos recientes</h3>
      <div className="space-y-3">
        {queries.slice(0, 5).map((query) => {
          const status = statusConfig[query.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div
              key={query.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                query.status === 'success' ? 'bg-green-50' :
                  query.status === 'error' ? 'bg-red-50' : 'bg-slate-50'
              )}>
                <StatusIcon className={cn(
                  "w-5 h-5",
                  query.status === 'success' ? 'text-green-500' :
                    query.status === 'error' ? 'text-red-500' : 'text-slate-400'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {query.input_address}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {query.fecha &&
                    format(new Date(query.fecha), "d 'de' MMM, HH:mm", { locale: es })}

                </p>
              </div>
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
