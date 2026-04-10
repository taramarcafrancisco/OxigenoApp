import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function UsageProgress({ used, total, label, showPercentage = true }) {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  
  const getProgressColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-blue-500";
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {showPercentage && (
          <span className={cn(
            "text-sm font-semibold px-2 py-0.5 rounded-full",
            percentage >= 90 ? "bg-red-100 text-red-600" :
            percentage >= 70 ? "bg-orange-100 text-orange-600" :
            "bg-blue-100 text-blue-600"
          )}>
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-slate-100"
        />
        <div 
          className={cn("absolute top-0 left-0 h-3 rounded-full transition-all duration-500", getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-slate-500">
          {used.toLocaleString()} de {total.toLocaleString()}
        </span>
        <span className="text-slate-400">
          {(total - used).toLocaleString()} disponibles
        </span>
      </div>
    </div>
  );
}