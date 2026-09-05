import { StyleSheet, Text, View } from "react-native";

import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

type StatusRailProps = { openCount: number; savedCount: number; activeStep: number | null; xp: number };

export function StatusRail({ openCount, savedCount, activeStep, xp }: StatusRailProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const cells = [
    { label: "OPEN NOW", value: String(openCount) },
    { label: "SAVED", value: String(savedCount) },
    { label: "ACTIVE STEP", value: activeStep === null ? "None" : String(activeStep) },
    { label: "XP", value: xp.toLocaleString() },
  ];

  return <View accessibilityLabel="Your café passport status" style={styles.rail}>
    {cells.map((cell) => <View key={cell.label} style={styles.cell}><Text style={styles.value}>{cell.value}</Text><Text style={styles.label}>{cell.label}</Text></View>)}
  </View>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  rail: { flexDirection: "row", marginTop: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  cell: { minWidth: 0, flex: 1, minHeight: 70, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  value: { color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 18 },
  label: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 7, letterSpacing: .6, textAlign: "center" },
});
