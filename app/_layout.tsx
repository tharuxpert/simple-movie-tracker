import { Stack } from "expo-router";
import { ThemeProvider } from "../lib/theme";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../lib/theme";
import { Feather } from "@expo/vector-icons";

function TabsLayout() {
  const { colors, theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Movies",
            tabBarIcon: ({ color, size }) => (
              <Feather name="film" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabsLayout />
    </ThemeProvider>
  );
}
