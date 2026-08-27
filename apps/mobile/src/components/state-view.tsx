import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, typography } from "@/theme/tokens";

export function StateView({ title, message, action, onAction, secondaryAction, onSecondaryAction, kind = "empty" }: { title: string; message: string; action?: string; onAction?(): void; secondaryAction?: string; onSecondaryAction?(): void; kind?: "empty" | "error" }) {
  return <View style={styles.wrap}><View style={[styles.icon, kind === "error" && styles.error]}><Ionicons name={kind === "error" ? "alert-circle-outline" : "cafe-outline"} size={32} color={kind === "error" ? colors.danger : colors.caramel} /></View><Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text>{action && onAction ? <Pressable onPress={onAction} style={styles.button}><Text style={styles.buttonText}>{action}</Text></Pressable> : null}{secondaryAction && onSecondaryAction ? <Pressable onPress={onSecondaryAction} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{secondaryAction}</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({
  wrap: { minHeight: 380, alignItems: "center", justifyContent: "center", padding: 28 },
  icon: { width: 80, height: 80, alignItems: "center", justifyContent: "center", borderRadius: 40, backgroundColor: colors.caramelMist },
  error: { backgroundColor: "#F8E7E1" },
  title: { marginTop: 18, color: colors.espresso, fontFamily: typography.display, fontSize: 24, textAlign: "center" },
  message: { maxWidth: 280, marginTop: 8, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13, lineHeight: 20, textAlign: "center" },
  button: { minHeight: 48, justifyContent: "center", marginTop: 18, paddingHorizontal: 20, borderRadius: radii.md, backgroundColor: colors.espresso },
  buttonText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 13 },
  secondaryButton: { minHeight: 48, justifyContent: "center", marginTop: 8, paddingHorizontal: 20, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  secondaryButtonText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 13 },
});
