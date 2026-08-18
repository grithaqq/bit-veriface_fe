'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, UserInfo, MenuResponse } from '@/app/lib/types';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';

interface MenuContextType {
  navigation: MenuItem[];
  user: UserInfo | null;
  isLoading: boolean;
  fetchMenu: (token: string) => Promise<void>;
  clearMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_STORAGE_KEY = 'menu_navigation';
const USER_STORAGE_KEY = 'menu_user';

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [navigation, setNavigation] = useState<MenuItem[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedNav = localStorage.getItem(MENU_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedNav) setNavigation(JSON.parse(storedNav));
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchMenu = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/menu', {
        method: 'GET',
        headers: { accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch menu');

      const data: MenuResponse = await response.json();

      if (data.success) {
        setNavigation(data.navigation);
        setUser(data.user);
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data.navigation));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMenu = useCallback(() => {
    setNavigation([]);
    setUser(null);
    localStorage.removeItem(MENU_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  return (
    <MenuContext.Provider value={{ navigation, user, isLoading, fetchMenu, clearMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
