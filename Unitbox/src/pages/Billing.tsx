import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Receipt, Plus, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/utils';
import { BillModal } from '../components/BillModal';

export const Billing: React.FC = () => {
  const { sales } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentSales = [...sales].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Receipt className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start a New Transaction</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Select products from your inventory to create a new bill and automatically update stock levels.
          </p>
        </div>
        <Button size="lg" onClick={() => setIsModalOpen(true)} className="gap-2 px-8">
          <Plus className="h-5 w-5" />
          Create New Bill
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        </div>
        <Table headers={['Date & Time', 'Items', 'Total Amount']}>
          {recentSales.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No transactions yet</td>
            </tr>
          ) : (
            recentSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formatDate(sale.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {sale.items.map((item, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(sale.totalAmount)}</td>
              </tr>
            ))
          )}
        </Table>
      </div>

      <BillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
