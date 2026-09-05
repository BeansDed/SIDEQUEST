import { ScrollView, StyleSheet, Text, Pressable } from "react-native";

import type { UseCase } from "@/domain/types";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

const intents: { label: string; useCase: UseCase }[] = [
  { label: "Study", useCase: "study" },
  { label: "Catch-up", useCase: "friends" },
  { label: "Date", useCase: "date" },
  { label: "Solo", useCase: "solo" },
  { label: "Quick stop", useCase: "food" },
];

export function IntentFilter({ selected, onToggle }: { selected: UseCase[]; onToggle(useCase: UseCase): void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {intents.map(({ label, useCase }) => {
      const active = selected.includes(useCase);
      return <Pressable key={useCase} accessibilityLabel={`${label} intent`} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => onToggle(useCase)} style={[styles.button, active && styles.active]}><Text style={[styles.text, active && styles.activeText]}>{label}</Text></Pressable>;
    })}
  </ScrollView>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  row: { gap: 8, paddingVertical: 12 },
  button: { minHeight: 44, justifyContent: "center", paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, backgroundColor: colors.paper },
  active: { borderColor: colors.caramel, backgroundColor: colors.brandSurface },
  text: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 },
  activeText: { color: colors.white },
});
