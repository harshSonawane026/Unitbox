import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { formatCurrency } from '../utils/utils';
import { Table } from '../components/Table';
import { format, startOfDay, subDays, isSameDay } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Analysis: React.FC = () => {
  const { sales, products } = useAppContext();

  // 1. Top 5 Most Sold Products
  const productSalesMap: Record<string, { name: string; quantity: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.name, quantity: 0 };
      }
      productSalesMap[item.productId].quantity += item.quantity;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const leastProducts = Object.values(productSalesMap)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  // 2. Sales per Category
  const categorySalesMap: Record<string, number> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const category = product?.category || 'Uncategorized';
      categorySalesMap[category] = (categorySalesMap[category] || 0) + (item.price * item.quantity);
    });
  });

  const categoryData = Object.entries(categorySalesMap).map(([name, value]) => ({ name, value }));

  // 3. Weekly Sales Chart (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'MMM dd'),
      fullDate: date,
      amount: 0
    };
  }).reverse();

  last7Days.forEach(day => {
    sales.forEach(sale => {
      if (isSameDay(new Date(sale.createdAt), day.fullDate)) {
        day.amount += sale.totalAmount;
      }
    });
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Weekly Sales Chart */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Weekly Sales Revenue</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                  itemStyle={{ color: '#1e293b' }}
                  formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Sales by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                  itemStyle={{ color: '#1e293b' }}
                  formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top 5 Most Sold Products</h3>
          <Table headers={['Product', 'Quantity Sold']}>
            {topProducts.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-400">No sales data available</td>
              </tr>
            ) : (
              topProducts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {p.quantity} units
                    </span>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>

        {/* Least Sold Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Least Sold Products</h3>
          <Table headers={['Product', 'Quantity Sold']}>
            {leastProducts.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-400">No sales data available</td>
              </tr>
            ) : (
              leastProducts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/30 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      {p.quantity} units
                    </span>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};
