import React, { createContext, useState, ReactNode, useContext } from 'react';

type AuthContextType = {
  user: string | null;
  name: string | null;
  email: string | null;
  role: 'admin' | 'driver' | 'user' | null;
  setName: (name: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'driver' | 'user' }>;
  signup: (name: string, email: string, password: string, userRole?: 'driver' | 'user') => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'driver' | 'user' | null>(null);

  // Simple in-memory storage for demo purposes
  // In a real app, this would be handled by your backend
  const [userDatabase] = useState<Map<string, { name: string; password: string; role: 'driver' | 'user' }>>(new Map());

  const login = async (emailInput: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'driver' | 'user' }> => {
    // Check for admin credentials
    if (emailInput === 'admin123@gmail.com' && password === 'Admin123') {
      setUser(emailInput);
      setEmail(emailInput);
      setName('Admin');
      setRole('admin');
      return { success: true, role: 'admin' };
    }
    
    // Check for registered users from signup
    const registeredUser = userDatabase.get(emailInput);
    if (registeredUser && password) {
      setUser(emailInput);
      setEmail(emailInput);
      setName(registeredUser.name);
      setRole(registeredUser.role);
      return { success: true, role: registeredUser.role };
    }

    // Fallback: Mock login logic for drivers and users based on email pattern
    if (emailInput && password) {
      setUser(emailInput);
      setEmail(emailInput);
      setName(null);
      let userRole: 'driver' | 'user';
      if (emailInput.includes('driver')) {
        userRole = 'driver';
        setRole('driver');
      } else {
        userRole = 'user';
        setRole('user');
      }
      return { success: true, role: userRole };
    }
    return { success: false };
  };

  const signup = async (nameInput: string, emailInput: string, password: string, userRole: 'driver' | 'user' = 'user'): Promise<boolean> => {
    // Mock signup logic: accept any non-empty name/email/password
    if (nameInput && emailInput && password) {
      // Store user in our simple database
      userDatabase.set(emailInput, { name: nameInput, password, role: userRole });
      
      setUser(emailInput);
      setName(nameInput);
      setEmail(emailInput);
      setRole(userRole);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setName(null);
    setEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, name, email, role, setName, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
