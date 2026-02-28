import { useState, useEffect, useCallback } from "react";

type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  });

  const getSystemTheme = useCallback(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  const isDark = mode === "system" ? getSystemTheme() : mode === "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      const shouldBeDark = mode === "system" ? getSystemTheme() : mode === "dark";
      if (shouldBeDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", mode);

    // Listen for system theme changes
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [mode, getSystemTheme]);

  const toggleTheme = () => {
    setMode(prev => prev === "dark" ? "light" : "dark");
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return { isDark, mode, toggleTheme, setTheme };
}
