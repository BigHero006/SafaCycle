import React, { createContext, useState, ReactNode, useContext } from 'react';

type AuthContextType = {
  user: string | null;
  name: string | null;
  email: string | null;
  setName: (name: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const login = async (emailInput: string, password: string): Promise<boolean> => {
    // Mock login logic: accept any non-empty email/password
    if (emailInput && password) {
      setUser(emailInput);
      setEmail(emailInput);
      // Name is not available on login, set to null or empty
      setName(null);
      return true;
    }
    return false;
  };

  const signup = async (nameInput: string, emailInput: string, password: string): Promise<boolean> => {
    // Mock signup logic: accept any non-empty name/email/password
    if (nameInput && emailInput && password) {
      setUser(emailInput);
      setName(nameInput);
      setEmail(emailInput);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setName(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ user, name, email, setName, login, signup, logout }}>
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
