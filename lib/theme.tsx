import * as React from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "@movie_tracker_theme";

export interface ThemeContextType {
  theme: Theme;
  colors: {
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    card: string;
    border: string;
  };
  toggleTheme: () => void;
}

const themes = {
  light: {
    background: "#ffffff",
    card: "#f8fafc",
    text: "#1e293b",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    muted: "#94a3b8",
    border: "#e2e8f0",
  },
  dark: {
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    primary: "#818cf8",
    secondary: "#a78bfa",
    accent: "#f472b6",
    muted: "#64748b",
    border: "#334155",
  },
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  colors: themes.light,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [isLoading, setIsLoading] = React.useState(true);

  // Load saved theme on mount
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
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

  const toggleTheme = React.useCallback(async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      colors: themes[theme],
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

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
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);
