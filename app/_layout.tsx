import { Slot } from "expo-router";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const scheme = useColorScheme();

  // 🔥 ĐẢO NGƯỢC THEME
  const invertedTheme = scheme === "light" ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={invertedTheme}>
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}