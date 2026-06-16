import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const loading = useStore(s => s.loading);
  const onboardingComplete = useStore(s => s.onboardingComplete);
  const loadData = useStore(s => s.loadData);
  const startTimer = useStore(s => s.startTimer);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadData();
    const cleanup = startTimer();
    return cleanup;
  }, []);

  useEffect(() => {
    if (loading) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboardingComplete && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingComplete && inOnboarding) {
      router.replace('/(tabs)/dashboard');
    }
  }, [loading, onboardingComplete, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.dark.background } }}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="urge-mode" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="achievements" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
