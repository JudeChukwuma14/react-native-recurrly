import { ClerkProvider, ClerkLoaded } from "@clerk/expo";
import { tokenCache } from "@/lib/tokenCache";
import PostHog, { PostHogProvider } from "posthog-react-native";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";

SplashScreen.preventAutoHideAsync();

import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export const posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_API_KEY!, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
});

/**
 * Root layout component that provides authentication, analytics, subscription state, fonts, and navigation for the app.
 *
 * Renders the app wrapped with Clerk (authentication), PostHog (analytics), and Subscriptions providers, and mounts the Expo Router navigation stack. While app fonts are loading, the component returns `null`.
 *
 * @returns The root JSX element composed of the providers and the navigation `Stack`, or `null` while fonts are loading.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <PostHogProvider client={posthog}>
          <SubscriptionsProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SubscriptionsProvider>
        </PostHogProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
