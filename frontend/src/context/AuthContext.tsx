import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, extractErrorMessage } from "@/api/client";
import type { User, AuthResponse } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      apiClient
        .get<User>("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistSession(data: AuthResponse) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const res = await apiClient.post<AuthResponse>("/auth/login", { email, password });
      persistSession(res.data);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function register(fullName: string, email: string, password: string) {
    setIsLoading(true);
    try {
      const res = await apiClient.post<AuthResponse>("/auth/register", {
        full_name: fullName,
        email,
        password,
      });
      persistSession(res.data);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
