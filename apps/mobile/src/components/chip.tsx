import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, typography } from "@/theme/tokens";

export function Chip({ label, selected = false, onPress }: { label: string; selected?: boolean; onPress(): void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, backgroundColor: colors.paper },
  selected: { borderColor: colors.caramel, backgroundColor: colors.caramel },
  label: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12, textTransform: "lowercase" },
  selectedLabel: { color: colors.white },
});
