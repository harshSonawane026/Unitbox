import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Product, Unit } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const unitOptions = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'liter', label: 'Liter (l)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece (pc)' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addProduct, updateProduct } = useAppContext();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    quantity: 0,
    unit: 'kg',
    price: 0,
    category: '',
    lowStockThreshold: 5,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        quantity: 0,
        unit: 'kg',
        price: 0,
        category: '',
        lowStockThreshold: 5,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct: Product = {
      id: product?.id || crypto.randomUUID(),
      name: formData.name || '',
      quantity: Number(formData.quantity) || 0,
      unit: (formData.unit as Unit) || 'kg',
      price: Number(formData.price) || 0,
      category: formData.category || '',
      lowStockThreshold: Number(formData.lowStockThreshold) || 0,
      createdAt: product?.createdAt || Date.now(),
    };

    if (product) {
      updateProduct(finalProduct);
    } else {
      addProduct(finalProduct);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{product ? 'Update' : 'Add'} Product</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            required
          />
          <Select
            label="Unit"
            options={unitOptions}
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (per unit)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
        <Input
          label="Low Stock Threshold"
          type="number"
          value={formData.lowStockThreshold}
          onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
          required
        />
      </form>
    </Modal>
  );
};
