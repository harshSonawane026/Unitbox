import { StoreData, Product, Sale } from '../types';

const STORAGE_KEY = 'unitbox_data';

const initialData: StoreData = {
  storeId: 'local-default',
  products: [],
  sales: [],
  settings: {
    lowStockThresholds: {},
  },
};

export const dataService = {
  getData(): StoreData {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const freshData = JSON.parse(JSON.stringify(initialData));
      this.saveData(freshData);
      return freshData;
    }
    return JSON.parse(data);
  },

  saveData(data: StoreData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Products
  getProducts(): Product[] {
    return this.getData().products;
  },

  addProduct(product: Product): StoreData {
    const data = this.getData();
    data.products.push(product);
    this.saveData(data);
    return data;
  },

  updateProduct(updatedProduct: Product): StoreData {
    const data = this.getData();
    data.products = data.products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    this.saveData(data);
    return data;
  },

  deleteProduct(id: string): StoreData {
    const data = this.getData();
    console.log("Before:", data);
    data.products = data.products.filter((p) => p.id !== id);
    this.saveData(data);
    console.log("After:", data);
    console.log("Product deleted:", id);
    return data;
  },

  // Sales
  getSales(): Sale[] {
    return this.getData().sales;
  },

  addSale(sale: Sale): StoreData {
    const data = this.getData();
    data.sales.push(sale);
    
    // Reduce stock
    sale.items.forEach(item => {
      const product = data.products.find(p => p.id === item.productId);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
      }
    });

    this.saveData(data);
    return data;
  },

  // Reset
  resetAllData(): StoreData {
    // Strictly delete from localStorage as requested
    localStorage.removeItem(STORAGE_KEY);
    const freshData = JSON.parse(JSON.stringify(initialData));
    this.saveData(freshData);
    console.log("All data reset");
    return freshData;
  },

  clearDailyCache(): StoreData {
    const data = this.getData();
    console.log("Before:", data);
    // Reset ONLY sales-related data
    data.sales = [];
    // Keep products, categories, and thresholds (settings)
    this.saveData(data);
    console.log("After:", data);
    console.log("Daily cache cleared");
    return data;
  }
};
