"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const PREMIUM_ACCESS_DAYS = 30;

type AppContextType = {
  saved: string[];
  toggleSave: (id: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  premiumUnlocked: Record<string, number>;
  isUnlocked: (id: string) => boolean;
  markPaid: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [premiumUnlocked, setPremiumUnlocked] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSave = (id: string) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const toggleCompare = (id: string) => {
    setCompareIds((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 3) return c;
      return [...c, id];
    });
  };

  const isUnlocked = (id: string) => {
    const ts = premiumUnlocked[id];
    if (!ts) return false;
    return Date.now() - ts < PREMIUM_ACCESS_DAYS * 24 * 60 * 60 * 1000;
  };

  const markPaid = (id: string) => {
    setPremiumUnlocked((m) => ({ ...m, [id]: Date.now() }));
  };

  // Optionally load from localStorage on mount
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem("doxxa_saved");
      if (savedStr) setSaved(JSON.parse(savedStr));
      const compareStr = localStorage.getItem("doxxa_compare");
      if (compareStr) setCompareIds(JSON.parse(compareStr));
      const premiumStr = localStorage.getItem("doxxa_premium");
      if (premiumStr) setPremiumUnlocked(JSON.parse(premiumStr));
    } catch (e) {
      // Ignore
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("doxxa_saved", JSON.stringify(saved));
    localStorage.setItem("doxxa_compare", JSON.stringify(compareIds));
    localStorage.setItem("doxxa_premium", JSON.stringify(premiumUnlocked));
  }, [saved, compareIds, premiumUnlocked]);

  return (
    <AppContext.Provider
      value={{
        saved,
        toggleSave,
        compareIds,
        toggleCompare,
        premiumUnlocked,
        isUnlocked,
        markPaid,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
