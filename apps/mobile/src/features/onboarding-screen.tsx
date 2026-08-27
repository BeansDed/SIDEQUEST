import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/chip";
import type { UseCase, Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";

const vibes: Vibe[] = ["quiet", "warm", "creative", "garden", "minimal", "lively"];
const uses: UseCase[] = ["study", "solo", "date", "friends", "food"];

export function OnboardingScreen({ onDone }: { onDone(): void }) {
  const { state, completeOnboarding } = useConsumer();
  const [name, setName] = useState(state.name);
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>(state.preferences.vibes);
  const [selectedUses, setSelectedUses] = useState<UseCase[]>(state.preferences.useCases);
  const [budget, setBudget] = useState(state.preferences.maxPrice);
  const toggle = <T,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
  const finish = () => { completeOnboarding(name, { vibes: selectedVibes, useCases: selectedUses, maxPrice: budget }); onDone(); };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>SIDEQUEST</Text>
        <Text style={styles.title}>Your café should fit the moment.</Text>
        <Text style={styles.copy}>Tell us what an actually good café day looks like. You can change this anytime.</Text>
        <TextInput accessibilityLabel="Your name" placeholder="What should we call you?" placeholderTextColor={colors.inkMuted} value={name} onChangeText={setName} style={styles.input} />
        <Text style={styles.label}>What energy do you look for?</Text>
        <View style={styles.chips}>{vibes.map((vibe) => <Chip key={vibe} label={vibe} selected={selectedVibes.includes(vibe)} onPress={() => setSelectedVibes(toggle(selectedVibes, vibe))} />)}</View>
        <Text style={styles.label}>What are you usually doing?</Text>
        <View style={styles.chips}>{uses.map((item) => <Chip key={item} label={item} selected={selectedUses.includes(item)} onPress={() => setSelectedUses(toggle(selectedUses, item))} />)}</View>
        <Text style={styles.label}>Comfortable spend</Text>
        <View style={styles.chips}>{[200, 350, 500].map((amount) => <Chip key={amount} label={`₱${amount}`} selected={budget === amount} onPress={() => setBudget(amount)} />)}</View>
        <Pressable accessibilityRole="button" onPress={finish} style={styles.button}><Text style={styles.buttonText}>Start exploring</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.oat },
  content: { padding: 24, paddingBottom: 50 },
  brand: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 12, letterSpacing: 1.8 },
  title: { maxWidth: 340, marginTop: 18, color: colors.espresso, fontFamily: typography.display, fontSize: 40, lineHeight: 44 },
  copy: { marginTop: 12, color: colors.inkMuted, fontFamily: typography.body, fontSize: 14, lineHeight: 22 },
  input: { minHeight: 54, marginTop: 28, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, color: colors.espresso, backgroundColor: colors.paper, fontFamily: typography.bodyMedium },
  label: { marginTop: 28, marginBottom: 12, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 17 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: { minHeight: 56, alignItems: "center", justifyContent: "center", marginTop: 34, borderRadius: radii.md, backgroundColor: colors.espresso },
  buttonText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 14 },
});
