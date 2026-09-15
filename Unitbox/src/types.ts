export type Unit = 'kg' | 'liter' | 'gram' | 'piece';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  price: number;
  category?: string;
  lowStockThreshold: number;
  createdAt: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  createdAt: number;
}

export interface Settings {
  lowStockThresholds: Record<string, number>;
}

export interface StoreData {
  storeId: string;
  products: Product[];
  sales: Sale[];
  settings: Settings;
}
