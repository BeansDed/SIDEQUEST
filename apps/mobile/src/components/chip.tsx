import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function Chip({ label, selected = false, onPress }: { label: string; selected?: boolean; onPress?(): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  if (!onPress) return <View style={[styles.chip, selected && styles.selected]}><Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text></View>;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  chip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, backgroundColor: colors.paper },
  selected: { borderColor: colors.caramel, backgroundColor: colors.caramel },
  label: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12, textTransform: "lowercase" },
  selectedLabel: { color: colors.white },
});
