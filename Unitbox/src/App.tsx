/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Billing } from './pages/Billing';
import { Analysis } from './pages/Analysis';
import { History } from './pages/History';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabParams, setTabParams] = useState<any>(null);

  const handleNavigate = (tab: string, params?: any) => {
    setActiveTab(tab);
    setTabParams(params || null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'inventory':
        return <Inventory initialFilter={tabParams?.filter} />;
      case 'billing':
        return <Billing />;
      case 'analysis':
        return <Analysis />;
      case 'history':
        return <History />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => handleNavigate(tab)}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

