import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { CafeCard } from "@/components/cafe-card";
import { Screen } from "@/components/screen";
import { StateView } from "@/components/state-view";
import { cafes } from "@/domain/catalog";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";

export function SavedScreen({ onOpenCafe }: { onOpenCafe(id: string): void }) {
  const { state, createCollection } = useConsumer(); const [name, setName] = useState("");
  const savedIds = new Set(state.collections.flatMap((collection) => collection.cafeIds)); const saved = cafes.filter((cafe) => savedIds.has(cafe.id));
  return <Screen><Text style={styles.kicker}>COLLECTIONS</Text><Text style={styles.title}>Keep the places worth remembering.</Text><Text style={styles.subtitle}>{state.collections.length} collections · {saved.length} saved cafés</Text>
    <View style={styles.create}><TextInput placeholder="New collection name" placeholderTextColor={colors.inkMuted} value={name} onChangeText={setName} style={styles.input} /><Pressable onPress={() => { createCollection(name); setName(""); }} style={styles.add}><Text style={styles.addText}>Create</Text></Pressable></View>
    {saved.length === 0 ? <StateView title="Nothing saved yet." message="Save cafés from Home or Discover and they will appear here." /> : <View style={styles.list}>{saved.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} preferences={state.preferences} compact onOpen={() => onOpenCafe(cafe.id)} />)}</View>}
  </Screen>;
}
const styles = StyleSheet.create({ kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 }, title: { marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34, lineHeight: 38 }, subtitle: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12 }, create: { flexDirection: "row", gap: 8, marginVertical: 20 }, input: { flex: 1, minHeight: 48, paddingHorizontal: 13, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper, fontFamily: typography.body }, add: { minWidth: 80, alignItems: "center", justifyContent: "center", borderRadius: radii.md, backgroundColor: colors.espresso }, addText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 11 }, list: { gap: 13 } });
