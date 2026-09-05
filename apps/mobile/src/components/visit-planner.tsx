import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { VisitPlan } from "@/domain/types";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function VisitPlanner({ cafeId, plan, onSave, onRemove }: { cafeId: string; plan?: VisitPlan; onSave(plan: Omit<VisitPlan, "createdAt">): void; onRemove(): void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [day, setDay] = useState<VisitPlan["day"]>(plan?.day ?? "today");
  const [time, setTime] = useState(plan?.time ?? "");
  const [note, setNote] = useState(plan?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setError("Enter a valid 24-hour time, for example 15:30.");
      return;
    }
    setError(null);
    onSave({ cafeId, day, time, note: note.trim().slice(0, 120) });
  };

  return <View style={styles.card}>
    <Text style={styles.kicker}>PLAN THIS STOP</Text>
    <Text style={styles.title}>{plan ? `${plan.day === "today" ? "Today" : "Tomorrow"} at ${plan.time}` : "Turn the idea into a plan."}</Text>
    {plan?.note ? <Text style={styles.savedNote}>{plan.note}</Text> : null}
    <View style={styles.days}>
      {(["today", "tomorrow"] as const).map((value) => <Pressable key={value} accessibilityLabel={value === "today" ? "Today" : "Tomorrow"} accessibilityState={{ selected: day === value }} onPress={() => setDay(value)} style={[styles.day, day === value && styles.dayActive]}><Text style={[styles.dayText, day === value && styles.dayTextActive]}>{value === "today" ? "Today" : "Tomorrow"}</Text></Pressable>)}
    </View>
    <TextInput accessibilityLabel="Visit time" value={time} onChangeText={setTime} placeholder="15:30" placeholderTextColor={colors.inkMuted} maxLength={5} keyboardType="numbers-and-punctuation" style={styles.input} />
    <TextInput accessibilityLabel="Visit note" value={note} onChangeText={setNote} placeholder="Window seat, meet by the door…" placeholderTextColor={colors.inkMuted} maxLength={120} multiline style={[styles.input, styles.note]} />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <View style={styles.actions}><Pressable onPress={save} style={styles.save}><Text style={styles.saveText}>Save visit plan</Text></Pressable>{plan ? <Pressable accessibilityLabel="Remove visit plan" onPress={onRemove} style={styles.remove}><Text style={styles.removeText}>Remove</Text></Pressable> : null}</View>
  </View>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  card: { marginTop: 26, padding: 18, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: 1 },
  title: { marginTop: 7, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 22 },
  savedNote: { marginTop: 5, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12 },
  days: { flexDirection: "row", gap: 8, marginTop: 16 },
  day: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
  dayActive: { borderColor: colors.caramel, backgroundColor: colors.brandSurface },
  dayText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 },
  dayTextActive: { color: colors.white },
  input: { minHeight: 48, marginTop: 10, paddingHorizontal: 14, color: colors.espresso, fontFamily: typography.body, fontSize: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.oat },
  note: { minHeight: 76, paddingTop: 13, textAlignVertical: "top" },
  error: { marginTop: 8, color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  save: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: radii.md, backgroundColor: colors.brandSurface },
  saveText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 11 },
  remove: { minWidth: 88, minHeight: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
  removeText: { color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 },
});
