import React from 'react';
import { cn } from "@/lib/utils";

export default function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendUp,
  colorClass = "blue" 
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
    sky: "bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trendUp ? "text-green-600" : "text-red-600"
            )}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[colorClass])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}