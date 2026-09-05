import { StyleSheet, Text, View } from "react-native";

import type { Cafe } from "@/domain/types";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function CafeSnapshot({ cafe, localReviewCount, localReviewAverage }: { cafe: Cafe; localReviewCount: number; localReviewAverage: number }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const facts = [
    [cafe.openNow ? "OPEN" : "CLOSED", cafe.closesAt],
    [`${cafe.walkMinutes} MIN`, "walk"],
    [`₱${cafe.averagePrice}`, "price guide"],
    [localReviewCount ? localReviewAverage.toFixed(1) : "—", `${localReviewCount} local review${localReviewCount === 1 ? "" : "s"}`],
  ];
  return <View accessibilityLabel="Café snapshot" style={styles.grid}>{facts.map(([value, label]) => <View key={label} style={styles.fact}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>)}</View>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 18, overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  fact: { width: "50%", minHeight: 70, justifyContent: "center", paddingHorizontal: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  value: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 13 },
  label: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 9 },
});
