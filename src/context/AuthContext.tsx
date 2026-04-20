import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'STARTUP' | 'COMPANY';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  accessibleModules?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'agriconnect-company-auth';
const FLASH_KEY = 'agriconnect-company-flash';

// Mock users data
const mockUsers: User[] = [
  {
    id: 'USR-002',
    name: 'Empresa Parceira',
    email: 'empresa@agriconnect.ao',
    role: 'COMPANY',
    companyId: 'EMP-002',
    companyName: 'Ministério da Agricultura',
    accessibleModules: [
      'marketplace',
      'hubs',
      'monitoring',
      'loads',
      'team',
      'bi_overview',
      'bi_production',
      'bi_geo',
      'bi_producers',
      'bi_prices',
      'bi_reports',
    ],
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) as User : null;
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && pass === 'empresa123'
    );
    
    if (foundUser) {
      setUser(foundUser);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.setItem(FLASH_KEY, 'Sessão terminada com sucesso.');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
