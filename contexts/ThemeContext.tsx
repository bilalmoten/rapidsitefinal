"use client";

import { createContext, useContext, useState } from "react";

type ThemeType = {
  name: string;
  from: string;
  via?: string;
  to: string;
  textFrom: string;
  textTo: string;
};

const themes = {
  default: {
    name: "Default",
    from: "purple-500",
    via: "pink-500",
    to: "red-500",
    textFrom: "purple-500",
    textTo: "pink-500",
  },
  deepSpace: {
    name: "Deep Space",
    from: "indigo-900",
    via: "purple-800",
    to: "blue-600",
    textFrom: "indigo-400",
    textTo: "blue-400",
  },
  cyber: {
    name: "Cyber",
    from: "cyan-500",
    via: "blue-600",
    to: "violet-700",
    textFrom: "cyan-400",
    textTo: "violet-400",
  },
  forest: {
    name: "Forest",
    from: "emerald-700",
    via: "green-600",
    to: "teal-500",
    textFrom: "emerald-400",
    textTo: "teal-400",
  },
  sunset: {
    name: "Sunset",
    from: "orange-600",
    via: "rose-500",
    to: "pink-600",
    textFrom: "orange-400",
    textTo: "pink-400",
  },
  ocean: {
    name: "Ocean",
    from: "blue-700",
    via: "cyan-600",
    to: "teal-500",
    textFrom: "blue-400",
    textTo: "teal-400",
  },
  midnight: {
    name: "Midnight",
    from: "indigo-800",
    to: "purple-700",
    textFrom: "indigo-400",
    textTo: "purple-400",
  },
};

type ThemeContextType = {
  currentTheme: ThemeType;
  setTheme: (theme: keyof typeof themes) => void;
  themes: typeof themes;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(themes.default);

  const setTheme = (themeName: keyof typeof themes) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
