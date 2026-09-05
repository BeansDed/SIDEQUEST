import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme/app-theme";

export function Screen({ children, scroll = true, footer }: PropsWithChildren<{ scroll?: boolean; footer?: ReactNode }>) {
  const { colors } = useAppTheme();
  const content = <View style={styles.content}>{children}</View>;
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.paper }]}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 18 },
});
