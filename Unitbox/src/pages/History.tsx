import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Table } from '../components/Table';
import { formatCurrency, formatDate } from '../utils/utils';
import { ShoppingBag, Calendar } from 'lucide-react';

export const History: React.FC = () => {
  const { sales } = useAppContext();

  const sortedSales = [...sales].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales History</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Showing the last 10 transactions</p>
        </div>
      </div>

      <Table headers={['Date & Time', 'Transaction ID', 'Items Purchased', 'Total Amount']}>
        {sortedSales.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8 opacity-20" />
                <p>No transaction history found</p>
              </div>
            </td>
          </tr>
        ) : (
          sortedSales.map((sale) => (
            <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-white">{formatDate(sale.createdAt).split(',')[0]}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(sale.createdAt).split(',')[1]}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-mono text-slate-400 dark:text-slate-500">
                {sale.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2 max-w-xs">
                  {sale.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-1 last:border-0">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="text-slate-400 dark:text-slate-500">{formatCurrency(item.price)} x {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(sale.totalAmount)}</span>
              </td>
            </tr>
          ))
        )}
      </Table>
    </div>
  );
};
