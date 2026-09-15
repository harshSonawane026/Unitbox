import React from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { Package, AlertTriangle, IndianRupee, ShoppingCart, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/utils';
import { Table } from '../components/Table';
import { Button } from '../components/Button';

export const Dashboard: React.FC<{ onNavigate: (tab: string, params?: any) => void }> = ({ onNavigate }) => {
  const { products, sales } = useAppContext();

  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold).length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSales = sales.length;

  const recentSales = [...sales].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const lowStockPreview = products
    .filter(p => p.quantity <= p.lowStockThreshold)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="indigo"
        />
        <div className="cursor-pointer" onClick={() => onNavigate('inventory', { filter: 'low-stock' })}>
          <SummaryCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={AlertTriangle}
            color="rose"
            description="Click to view items"
          />
        </div>
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          color="emerald"
        />
        <SummaryCard
          title="Total Sales"
          value={totalSales}
          icon={ShoppingCart}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Sales</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Table headers={['Date', 'Items', 'Total']}>
            {recentSales.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No sales yet</td>
              </tr>
            ) : (
              recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(sale.createdAt)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(sale.totalAmount)}</td>
                </tr>
              ))
            )}
          </Table>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Low Stock Alerts</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('inventory')} className="gap-2">
              Manage <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Table headers={['Product', 'Stock', 'Threshold']}>
            {lowStockPreview.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">All stock levels are healthy</td>
              </tr>
            ) : (
              lowStockPreview.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/30 px-2 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                      {product.quantity} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.lowStockThreshold} {product.unit}</td>
                </tr>
              ))
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};
