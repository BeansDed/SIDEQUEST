import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import type { Settings } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors as light } from "./tokens";

export type ResolvedAppearance = "light" | "dark";
export type AppPalette = { [Key in keyof typeof light]: string };

const dark: AppPalette = {
  espresso: "#FFF9E9", espressoSoft: "#CBD5E1", brandSurface: "#2557D6", caramel: "#7EA2FF", caramelMist: "#1F2A44",
  oat: "#0B1120", paper: "#151D2C", sage: "#A4D65E", sageMist: "#1D3426", crema: "#FFB703",
  border: "#344158", inkMuted: "#B8C0CE", danger: "#FF8A7A", white: "#FFFFFF",
};

export function resolveAppearance(setting: Settings["appearance"], system: "light" | "dark" | "unspecified" | null | undefined): ResolvedAppearance {
  return setting === "system" ? (system === "dark" ? "dark" : "light") : setting;
}

const AppThemeContext = createContext({ appearance: "light" as ResolvedAppearance, colors: light as AppPalette });

export function AppThemeProvider({ children }: PropsWithChildren) {
  const { state } = useConsumer();
  const system = useColorScheme();
  const appearance = resolveAppearance(state.settings.appearance, system);
  const value = useMemo(() => ({ appearance, colors: appearance === "dark" ? dark : light }), [appearance]);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() { return useContext(AppThemeContext); }
