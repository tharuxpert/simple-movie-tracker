import React, { createContext, useContext, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";

export interface Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    muted: string;
    accent: string;
    secondary: string;
  };
}

export interface ThemeContextType {
  theme: "light" | "dark";
  colors: Theme["colors"];
  toggleTheme: () => void;
}

const lightTheme: Theme["colors"] = {
  primary: "#007AFF",
  background: "#F2F2F7",
  card: "#FFFFFF",
  text: "#000000",
  border: "#E5E5EA",
  muted: "#8E8E93",
  accent: "#FF3B30",
  secondary: "#5856D6",
};

const darkTheme: Theme["colors"] = {
  primary: "#0A84FF",
  background: "#000000",
  card: "#1C1C1E",
  text: "#FFFFFF",
  border: "#38383A",
  muted: "#8E8E93",
  accent: "#FF453A",
  secondary: "#5E5CE6",
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(
    systemColorScheme || "light"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@movie_tracker_theme");
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const colors = theme === "light" ? lightTheme : darkTheme;

  React.useEffect(() => {
    StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content");
    if (theme === "dark") {
      StatusBar.setBackgroundColor("#000000");
    } else {
      StatusBar.setBackgroundColor("#FFFFFF");
    }
  }, [theme]);

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
