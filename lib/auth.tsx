"use client";

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: string | null;
  role: "USER" | "AGENT";
  is_verified: boolean;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: "USER" | "AGENT";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTokens = (): AuthTokens | null => {
    if (typeof window === "undefined") return null;
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (access && refresh) return { access, refresh };
    return null;
  };

  const setTokens = (tokens: AuthTokens) => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    (async () => {
      const tokens = getTokens();
      if (tokens?.access) {
        const ok = await refreshTokenInternal();
        if (ok) {
          await fetchProfileInternal();
        }
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileInternal = async (): Promise<boolean> => {
    try {
      const tokens = getTokens();
      if (!tokens) return false;

      const res = await fetch(`${API_BASE}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }

    const data = await res.json();
    setTokens({ access: data.access, refresh: data.refresh });
    await fetchProfileInternal();
  };

  const register = async (data: RegisterData) => {
    const res = await fetch(`${API_BASE}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(err) || "Registration failed");
    }

    await login(data.email, data.password);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const refreshTokenInternal = async (): Promise<boolean> => {
    const tokens = getTokens();
    if (!tokens?.refresh) return false;

    try {
      const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const ctxValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken: refreshTokenInternal,
  };

  return React.createElement(AuthContext.Provider, { value: ctxValue }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function ProtectedRoute({
  children,
  requireAgent = false,
}: {
  children: ReactNode;
  requireAgent?: boolean;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return React.createElement(
      "div",
      { className: "flex h-screen items-center justify-center" },
      React.createElement("div", {
        className:
          "h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-ink",
      })
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
    }
    return null;
  }

  if (requireAgent && user?.role !== "AGENT") {
    return React.createElement(
      "div",
      { className: "container-page py-20 text-center" },
      React.createElement(
        "h1",
        { className: "font-display text-2xl text-ink" },
        "Agent Access Required"
      ),
      React.createElement(
        "p",
        { className: "mt-4 text-stone-600" },
        "This page is only available to verified agents."
      ),
      React.createElement(
        "a",
        {
          href: "/",
          className: "mt-6 inline-block text-gold-dark hover:underline",
        },
        "Return Home"
      )
    );
  }

  return React.createElement(React.Fragment, null, children);
}
