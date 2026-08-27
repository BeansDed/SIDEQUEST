import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme/tokens";

export function BrandedLoading() {
  return (
    <View accessibilityLabel="Loading SIDEQUEST" accessibilityRole="progressbar" style={styles.loading}>
      <View style={styles.ring} />
      <Text style={styles.word}>SIDEQUEST</Text>
      <Text style={styles.note}>Finding a table that fits the mood…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.oat },
  ring: { width: 78, height: 78, borderWidth: 17, borderColor: colors.crema, borderRightColor: colors.caramel, borderRadius: 39 },
  word: { marginTop: 18, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12, letterSpacing: 1.7 },
  note: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 11 },
});
