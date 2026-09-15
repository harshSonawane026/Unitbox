import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Search, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { formatCurrency, cn } from '../utils/utils';
import { ProductModal } from '../components/ProductModal';
import { Product } from '../types';
import { Select } from '../components/Select';

interface InventoryProps {
  initialFilter?: 'low-stock' | null;
}

export const Inventory: React.FC<InventoryProps> = ({ initialFilter = null }) => {
  const { products, deleteProduct } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(initialFilter === 'low-stock');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    if (initialFilter === 'low-stock') {
      setShowLowStockOnly(true);
    }
  }, [initialFilter]);

  // Dynamically generate categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    const matchesLowStock = !showLowStockOnly || p.quantity <= p.lowStockThreshold;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setShowLowStockOnly(false);
  };

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all' || showLowStockOnly;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            options={categories.map(c => ({ value: c || '', label: c === 'all' ? 'All Categories' : c || '' }))}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />

          <Button
            variant={showLowStockOnly ? 'primary' : 'outline'}
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className="gap-2"
          >
            <AlertCircle className={cn("h-4 w-4", showLowStockOnly ? "text-white" : "text-rose-500")} />
            Low Stock
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        
        <Button onClick={handleAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Search: {searchTerm}
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Category: {categoryFilter}
            </span>
          )}
          {showLowStockOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
              Filter: Low Stock
            </span>
          )}
        </div>
      )}

      <Table headers={['Product', 'Category', 'Stock', 'Price', 'Threshold', 'Actions']}>
        {filteredProducts.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
              {searchTerm ? 'No products match your search' : 'No products in inventory yet'}
            </td>
          </tr>
        ) : (
          filteredProducts.map((product) => {
            const isLowStock = product.quantity <= product.lowStockThreshold;
            return (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-left min-w-[200px]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {product.name || 'Unnamed Product'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {product.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={isLowStock ? 'font-bold text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}>
                      {product.quantity} {product.unit}
                    </span>
                    {isLowStock && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.lowStockThreshold} {product.unit}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-indigo-600 hover:bg-indigo-50">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-rose-600 hover:bg-rose-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </Table>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </div>
  );
};
