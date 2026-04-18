"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { USERS_MOCK } from "@/src/_lib/auth-mock";

export type Role = "professor" | "aluno";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Para forçar o context a ser o único exportado e prevenir problemas de hydratação excessiva
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Roda somente no client para evitar hydration mismatch
    const storedUser = localStorage.getItem("luminar_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("luminar_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simula um delay da API
      setTimeout(() => {
        const foundUser = USERS_MOCK.find(
          (u) => u.email === email && u.password === password
        );
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role as Role,
          };
          setUser(userData);
          localStorage.setItem("luminar_user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error("Credenciais inválidas."));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("luminar_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
