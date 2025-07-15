"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  getToken,
  logoutUser as logoutUtil,
} from "./auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
    if (useBackend) {
      try {
        await loginUser(username, password);
        setIsAuthenticated(true);
        localStorage.setItem("auth_username", username);
      } catch (error) {
        console.error("[authContext] Login failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds
      setIsAuthenticated(true);
      localStorage.setItem("auth_username", username);
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
    if (useBackend) {
      try {
        await registerUser(username, password);
        setIsAuthenticated(true);
        localStorage.setItem("auth_username", username);
      } catch (error) {
        console.error("[authContext] Register failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds
      setIsAuthenticated(true);
      localStorage.setItem("auth_username", username);
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUtil();
    setIsAuthenticated(false);
    localStorage.removeItem("auth_username");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
