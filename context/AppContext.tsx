
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product } from '../types';

interface RememberedAccount {
  id: string;
  fullName: string;
  phone: string;
  photo?: string;
}

interface SystemSettings {
  appName: string;
  systemOpen: boolean;
  usersCount: number;
  lastAction: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  cart: { product: Product; qty: number }[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateBalance: (newBalance: number) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  rememberedAccounts: RememberedAccount[];
  addRememberedAccount: (user: User) => void;
  removeRememberedAccount: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved as 'ar' | 'en') || 'ar';
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('system-settings');
    return saved ? JSON.parse(saved) : {
      appName: "BRAND STORE",
      systemOpen: true,
      usersCount: 150,
      lastAction: "بدء النظام"
    };
  });

  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>(() => {
    const saved = localStorage.getItem('remembered_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('system-settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'en' : 'ar');

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { product, qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, walletBalance: newBalance });
    }
  };

  const addRememberedAccount = (u: User) => {
    setRememberedAccounts(prev => {
      if (prev.find(acc => acc.id === u.id)) return prev;
      const newAccounts = [...prev, { id: u.id, fullName: u.fullName, phone: u.phone, photo: u.personalPhoto }];
      localStorage.setItem('remembered_accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
  };

  const removeRememberedAccount = (id: string) => {
    setRememberedAccounts(prev => {
      const newAccounts = prev.filter(acc => acc.id !== id);
      localStorage.setItem('remembered_accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      user, setUser, loading, setLoading, cart, addToCart, removeFromCart, clearCart, updateBalance, logout,
      theme, toggleTheme, language, toggleLanguage, systemSettings, updateSystemSettings,
      rememberedAccounts, addRememberedAccount, removeRememberedAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
