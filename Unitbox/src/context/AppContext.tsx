import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, StoreData } from '../types';
import { dataService } from '../services/dataService';

interface AppContextType {
  products: Product[];
  sales: Sale[];
  refreshData: () => void;
  addProduct: (product: Product) => StoreData;
  updateProduct: (product: Product) => StoreData;
  deleteProduct: (id: string) => StoreData;
  addSale: (sale: Sale) => StoreData;
  resetAll: () => void;
  clearDaily: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StoreData>(dataService.getData());

  const refreshData = () => {
    setData(dataService.getData());
  };

  const addProduct = (product: Product) => {
    const updatedData = dataService.addProduct(product);
    setData(updatedData);
    return updatedData;
  };

  const updateProduct = (product: Product) => {
    const updatedData = dataService.updateProduct(product);
    setData(updatedData);
    return updatedData;
  };

  const deleteProduct = (id: string) => {
    const updatedData = dataService.deleteProduct(id);
    setData(updatedData);
    return updatedData;
  };

  const addSale = (sale: Sale) => {
    const updatedData = dataService.addSale(sale);
    setData(updatedData);
    return updatedData;
  };

  const resetAll = () => {
    const updatedData = dataService.resetAllData();
    setData(updatedData);
  };

  const clearDaily = () => {
    const updatedData = dataService.clearDailyCache();
    setData(updatedData);
  };

  return (
    <AppContext.Provider value={{
      products: data.products,
      sales: data.sales,
      refreshData,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      resetAll,
      clearDaily
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
