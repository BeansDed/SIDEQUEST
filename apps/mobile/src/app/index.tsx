import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useConsumer } from "@/state/consumer-provider";
import { colors, typography } from "@/theme/tokens";

export default function IndexRoute() {
  const { state } = useConsumer();
  if (!state.hydrated) return <View style={styles.loading}><View style={styles.ring} /><Text style={styles.word}>SIDEQUEST</Text></View>;
  return <Redirect href={state.onboarded ? "/(tabs)" : "/onboarding"} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.oat },
  ring: { width: 74, height: 74, borderWidth: 16, borderColor: colors.crema, borderRightColor: colors.caramel, borderRadius: 37 },
  word: { marginTop: 18, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12, letterSpacing: 1.7 },
});
