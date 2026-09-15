import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'rose' | 'emerald' | 'amber';
  description?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}) => {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {description && <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl border', colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
