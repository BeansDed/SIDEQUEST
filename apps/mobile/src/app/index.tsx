import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme/tokens";

export default function BootstrapScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>SIDEQUEST · NATIVE</Text>
      <Text style={styles.title}>Find your next café.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: colors.oat },
  eyebrow: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 12, letterSpacing: 1.4 },
  title: { marginTop: 12, color: colors.espresso, fontFamily: typography.display, fontSize: 42, lineHeight: 46 },
});
