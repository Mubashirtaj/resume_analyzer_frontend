"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// --- Types ---
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

// --- Initializer Function (Client-only) ---
const getInitialTheme = (): Theme => {
  // ⛔ SSR Safety Check ⛔
  if (typeof window === "undefined") {
    // Return a safe, default theme during Server-Side Rendering (SSR)
    return "light";
  }

  // 1. Check for stored theme in localStorage
  const storedTheme = localStorage.getItem("theme") as Theme;
  if (storedTheme) {
    return storedTheme;
  }

  // 2. Check for system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  // 3. Default to light if no preference is found
  return "light";
};
// --- Context Setup ---
// Set a default value that is SSR-safe ('light')
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

// --- Provider Component ---
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ FIX: Use the initializer function directly in useState.
  // This runs once on initialization (server=light, client=correct theme)
  // and avoids the synchronous setState error.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // ❌ REMOVE the problematic useEffect/getinital function ❌
  // useEffect(() => { setTheme(getInitialTheme()); setMounted(true); }, []);
  // This is where the cascading renders error originated.

  // 1. Synchronization Effect (Only runs when theme changes via toggleTheme)
  useEffect(() => {
    // This effect now only syncs the theme state to the DOM and localStorage.
    if (typeof window === "undefined") return; // Ensure it only runs on the client

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]); // Runs after the theme state has been successfully updated

  // --- Toggle Function ---
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
