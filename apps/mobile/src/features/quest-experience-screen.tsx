import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import type { Quest } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function QuestExperienceScreen({ quest, onBack }: { quest: Quest; onBack(): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state, startQuest, advanceQuest, completeQuest, abandonQuest } = useConsumer();
  const [proofUri, setProofUri] = useState<string>();
  const active = state.activeQuestId === quest.id;
  const completed = state.completedQuestIds.includes(quest.id);
  const last = state.questStep >= quest.steps.length - 1;
  const pickProof = async () => { const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: .8 }); if (!result.canceled) setProofUri(result.assets[0]?.uri); };
  return <Screen>
    <Pressable accessibilityLabel="Back" onPress={onBack} style={styles.back}><Ionicons name="arrow-back" size={21} color={colors.espresso} /></Pressable>
    <View style={styles.art}><View style={styles.orbit}><Ionicons name="sparkles" size={34} color={colors.crema} /></View></View>
    <Text style={styles.kicker}>+{quest.xp} XP · {quest.durationMinutes} MIN · MAX ₱{quest.maxCost}</Text><Text style={styles.title}>{quest.title}</Text><Text style={styles.description}>{quest.description}</Text>
    <View style={styles.safety}><Ionicons name="shield-checkmark" size={21} color={colors.sage} /><Text style={styles.safetyText}>Stay in public spaces, respect café staff, and never photograph strangers without permission.</Text></View>
    {completed ? <View style={styles.complete}><Ionicons name="checkmark-circle" size={46} color={colors.sage} /><Text style={styles.completeTitle}>Quest complete</Text><Text style={styles.description}>The XP and completion time are saved in your profile.</Text></View> : active ? <>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${((state.questStep + 1) / quest.steps.length) * 100}%` }]} /></View><Text style={styles.stepLabel}>STEP {state.questStep + 1} OF {quest.steps.length}</Text>
      <View style={styles.current}><Text style={styles.currentNumber}>{state.questStep + 1}</Text><Text style={styles.currentText}>{quest.steps[state.questStep]}</Text></View>
      <Pressable onPress={() => void pickProof()} style={styles.proof}><Ionicons name={proofUri ? "checkmark-circle" : "camera-outline"} size={20} color={proofUri ? colors.sage : colors.espresso} /><Text style={styles.proofText}>{proofUri ? "Photo proof attached" : "Add optional photo proof"}</Text></Pressable>
      <Pressable onPress={() => last ? completeQuest(quest.id, quest.xp, proofUri) : advanceQuest()} style={styles.primary}><Text style={styles.primaryText}>{last ? `Finish +${quest.xp} XP` : "Complete step"}</Text></Pressable>
      <Pressable onPress={abandonQuest} style={styles.abandon}><Text style={styles.abandonText}>Abandon quest</Text></Pressable>
    </> : <><View style={styles.steps}>{quest.steps.map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.stepText}>{step}</Text></View>)}</View><Pressable onPress={() => startQuest(quest.id)} style={styles.primary}><Text style={styles.primaryText}>Start quest</Text></Pressable></>}
  </Screen>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({ back: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.paper }, art: { height: 190, alignItems: "center", justifyContent: "center", marginTop: 18, borderRadius: radii.lg, backgroundColor: colors.espressoSoft }, orbit: { width: 104, height: 104, alignItems: "center", justifyContent: "center", borderWidth: 24, borderColor: "rgba(229,198,165,.18)", borderRadius: 52, backgroundColor: colors.caramel }, kicker: { marginTop: 22, color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: .8 }, title: { marginTop: 7, color: colors.espresso, fontFamily: typography.display, fontSize: 36 }, description: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13, lineHeight: 20 }, safety: { flexDirection: "row", gap: 10, marginTop: 18, padding: 14, borderRadius: radii.md, backgroundColor: colors.sageMist }, safetyText: { flex: 1, color: colors.sage, fontFamily: typography.bodyMedium, fontSize: 10, lineHeight: 16 }, steps: { gap: 8, marginVertical: 24 }, step: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.paper }, stepNumber: { width: 30, height: 30, paddingTop: 7, borderRadius: 15, color: colors.caramel, backgroundColor: colors.caramelMist, fontFamily: typography.bodyBold, fontSize: 11, textAlign: "center" }, stepText: { flex: 1, color: colors.espresso, fontFamily: typography.bodyMedium, fontSize: 11 }, primary: { minHeight: 54, alignItems: "center", justifyContent: "center", marginTop: 12, borderRadius: radii.md, backgroundColor: colors.espressoSoft }, primaryText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 13 }, progress: { height: 9, overflow: "hidden", marginTop: 24, borderRadius: 5, backgroundColor: colors.caramelMist }, progressFill: { height: "100%", borderRadius: 5, backgroundColor: colors.caramel }, stepLabel: { marginTop: 22, color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: .8 }, current: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 10, padding: 20, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper }, currentNumber: { width: 48, height: 48, paddingTop: 13, borderRadius: 24, color: colors.white, backgroundColor: colors.caramel, fontFamily: typography.bodyBold, fontSize: 15, textAlign: "center" }, currentText: { flex: 1, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 18 }, proof: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper }, proofText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 }, complete: { alignItems: "center", paddingVertical: 44 }, completeTitle: { marginTop: 12, color: colors.espresso, fontFamily: typography.display, fontSize: 28 }, abandon: { minHeight: 46, alignItems: "center", justifyContent: "center", marginTop: 4 }, abandonText: { color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 } });
