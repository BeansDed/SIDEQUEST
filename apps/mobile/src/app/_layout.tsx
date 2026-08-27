import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts as useDMSans,
} from "@expo-google-fonts/dm-sans";
import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  useFonts as useFraunces,
} from "@expo-google-fonts/fraunces";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { BrandedLoading } from "@/components/branded-loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { colors } from "@/theme/tokens";
import { ConsumerProvider } from "@/state/consumer-provider";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dmLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [frauncesLoaded] = useFraunces({ Fraunces_600SemiBold, Fraunces_700Bold });
  const ready = dmLoaded && frauncesLoaded;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <BrandedLoading />;

  return (
    <>
      <StatusBar style="dark" />
      <ConsumerProvider>
        <ErrorBoundary onReturnHome={() => router.replace("/(tabs)")}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.oat } }} />
        </ErrorBoundary>
      </ConsumerProvider>
    </>
  );
}
