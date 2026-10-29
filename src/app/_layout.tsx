import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState, LoadingState, colors } from '@/design-system';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { ConfigMissing } from '@/features/auth/ConfigMissing';
import { useMyProfile } from '@/features/profile/hooks';
import { envProblems } from '@/lib/env';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style="light" />
            {envProblems.length > 0 ? <ConfigMissing missing={envProblems} /> : <RootNavigator />}
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, initializing, recoveringPassword } = useAuth();
  const profile = useMyProfile();

  if (initializing || (session && profile.isPending))
    return <LoadingState label="Preparando Polygo…" />;
  if (session && profile.isError) {
    return (
      <ErrorState message="No pudimos cargar tu perfil." onRetry={() => void profile.refetch()} />
    );
  }

  const signedIn = Boolean(session) && !recoveringPassword;
  const onboarded = Boolean(profile.data?.profile.onboarding_completed_at);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="lesson/[id]"
          options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
        />
        <Stack.Screen
          name="review"
          options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(session) && recoveringPassword}>
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
      {/* Destino de los enlaces de email: siempre accesible. */}
      <Stack.Screen name="auth-callback" />
    </Stack>
  );
}
