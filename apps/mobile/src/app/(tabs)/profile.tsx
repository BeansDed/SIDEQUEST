import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/screen";
import { colors, typography } from "@/theme/tokens";
export default function ProfileRoute() { return <Screen><Text style={styles.kicker}>YOUR SIDEQUEST</Text><Text style={styles.title}>Level 8 café explorer.</Text></Screen>; }
const styles = StyleSheet.create({ kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 }, title: { marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34 } });
