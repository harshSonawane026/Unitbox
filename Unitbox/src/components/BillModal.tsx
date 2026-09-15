import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Product, Sale, SaleItem } from '../types';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus, Search } from 'lucide-react';
import { formatCurrency } from '../utils/utils';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillModal: React.FC<BillModalProps> = ({ isOpen, onClose }) => {
  const { products, addSale } = useAppContext();
  const [billItems, setBillItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.quantity > 0
  );

  const addItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} ${product.unit} available in stock.`);
      return;
    }

    const existingItemIndex = billItems.findIndex(item => item.productId === product.id);
    if (existingItemIndex > -1) {
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setBillItems(updatedItems);
    } else {
      setBillItems([...billItems, {
        productId: product.id,
        name: product.name,
        quantity: quantity,
        price: product.price
      }]);
    }

    setSelectedProductId('');
    setQuantity(1);
    setSearchTerm('');
  };

  const removeItem = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const totalAmount = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCreateBill = () => {
    if (billItems.length === 0) return;

    const sale: Sale = {
      id: crypto.randomUUID(),
      items: billItems,
      totalAmount,
      createdAt: Date.now(),
    };

    addSale(sale);
    setBillItems([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Bill"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateBill} disabled={billItems.length === 0}>
            Complete Sale ({formatCurrency(totalAmount)})
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7">
              <Select
                options={[
                  { value: '', label: 'Select Product' },
                  ...filteredProducts.map(p => ({ value: p.id, label: `${p.name} (${p.quantity} ${p.unit} left)` }))
                ]}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Button onClick={addItem} className="w-full h-full" disabled={!selectedProductId}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Items</h4>
          {billItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
              <p className="text-sm">No items added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {billItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(i)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
