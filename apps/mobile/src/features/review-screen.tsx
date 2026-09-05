import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "@/components/chip";
import { Screen } from "@/components/screen";
import type { Cafe, UseCase, Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

const vibes: Vibe[] = ["quiet", "warm", "creative", "garden", "minimal", "lively"];
const useCases: UseCase[] = ["study", "solo", "date", "friends", "food"];

export function ReviewScreen({ cafe, onDone }: { cafe: Cafe; onDone(): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { addReview } = useConsumer();
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState<Vibe[]>([]);
  const [useCase, setUseCase] = useState<UseCase>("solo");
  const [note, setNote] = useState("");
  const [photoUri, setPhotoUri] = useState<string>();
  const [error, setError] = useState("");
  const submit = () => {
    if (rating < 1 || selected.length === 0 || note.trim().length < 8) { setError("Add a rating, one vibe, and at least 8 characters."); return; }
    addReview({ cafeId: cafe.id, rating, useCase, vibes: selected, note, photoUri }); onDone();
  };
  const pick = async () => { const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: .8 }); if (!result.canceled) setPhotoUri(result.assets[0]?.uri); };
  return <Screen>
    <Text style={styles.kicker}>VIBE CHECK</Text><Text style={styles.title}>How was {cafe.name}?</Text><Text style={styles.subtitle}>Keep it useful for the next person choosing where to go.</Text>
    <Text style={styles.label}>Your rating</Text><View style={styles.ratings}>{[1,2,3,4,5].map((star) => <Pressable key={star} accessibilityLabel={`${star} stars`} onPress={() => setRating(star)} style={styles.star}><Ionicons name={star <= rating ? "star" : "star-outline"} size={26} color={star <= rating ? colors.caramel : colors.inkMuted} /><Text style={styles.sr}>{star} stars</Text></Pressable>)}</View>
    <Text style={styles.label}>What were you there for?</Text><View style={styles.chips}>{useCases.map((item) => <Chip key={item} label={item} selected={useCase === item} onPress={() => setUseCase(item)} />)}</View>
    <Text style={styles.label}>What did it feel like?</Text><View style={styles.chips}>{vibes.map((vibe) => <Chip key={vibe} label={vibe} selected={selected.includes(vibe)} onPress={() => setSelected(selected.includes(vibe) ? selected.filter((item) => item !== vibe) : [...selected, vibe])} />)}</View>
    <Text style={styles.label}>One useful note</Text><TextInput multiline placeholder="What should someone know before going?" placeholderTextColor={colors.inkMuted} value={note} onChangeText={(value) => { setNote(value); setError(""); }} style={styles.input} />{error ? <Text style={styles.error}>{error}</Text> : null}
    <Pressable onPress={() => void pick()} style={styles.photo}><Ionicons name={photoUri ? "checkmark-circle" : "image-outline"} size={20} color={photoUri ? colors.sage : colors.espresso} /><Text style={styles.photoText}>{photoUri ? "Photo attached" : "Add an optional photo"}</Text></Pressable>
    <Pressable onPress={submit} style={styles.primary}><Text style={styles.primaryText}>Post vibe check</Text></Pressable>
  </Screen>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({ kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 }, title: { marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34, lineHeight: 39 }, subtitle: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13, lineHeight: 20 }, label: { marginTop: 26, marginBottom: 10, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 17 }, ratings: { flexDirection: "row", gap: 7 }, star: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.paper }, sr: { position: "absolute", width: 1, height: 1, opacity: 0 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, input: { minHeight: 116, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, color: colors.espresso, backgroundColor: colors.paper, fontFamily: typography.body, textAlignVertical: "top" }, error: { marginTop: 8, color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 }, photo: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper }, photoText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 }, primary: { minHeight: 54, alignItems: "center", justifyContent: "center", marginTop: 12, borderRadius: radii.md, backgroundColor: colors.espressoSoft }, primaryText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 13 } });
