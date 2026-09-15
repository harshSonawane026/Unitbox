import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './Button';
import { RefreshCw, Trash2, Eraser, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { resetAll, clearDaily } = useAppContext();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleResetAll = () => {
    resetAll();
    setActiveTab('dashboard');
  };

  const handleClearDaily = () => {
    clearDaily();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">{activeTab}</h2>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full p-2 text-slate-500 dark:text-slate-400"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearDaily} className="gap-2 text-amber-600 border-amber-100 hover:bg-amber-50 dark:border-amber-900/30 dark:hover:bg-amber-900/20">
              <Eraser className="h-4 w-4" />
              Clear Daily Cache
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetAll} className="gap-2 text-rose-600 border-rose-100 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20">
              <Trash2 className="h-4 w-4" />
              Reset All Data
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
