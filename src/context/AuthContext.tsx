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
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(u => u.email === email && pass === 'empresa123');
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
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
