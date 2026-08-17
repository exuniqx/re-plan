import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PlanProvider } from "../PlanContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <PlanProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="project"
            options={{ title: "PROJECT" }}
          />
          <Stack.Screen
            name="new-project"
            options={{ title: "NEW PROJECT" }}
          />
          <Stack.Screen
            name="check"
            options={{ title: "CHECK" }}
          />
          <Stack.Screen
            name="evaluate"
            options={{ title: "EVALUATE" }}
          />
        </Stack>
      </PlanProvider>
    </ThemeProvider>
  );
}