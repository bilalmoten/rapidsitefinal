"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isExpanded: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <SidebarContext.Provider
      value={{ isExpanded, darkMode, toggleSidebar, toggleDarkMode }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
