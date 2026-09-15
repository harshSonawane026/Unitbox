import React from 'react';
import { cn } from '../utils/utils';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className }) => {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};
