import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState, LoadingState, colors } from '@/design-system';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { ConfigMissing } from '@/features/auth/ConfigMissing';
import { useApplySoundEffectsPref } from '@/features/preferences/soundEffects';
import { useMyProfile } from '@/features/profile/hooks';
import { envProblems } from '@/lib/env';
import { configureNotifications } from '@/features/reminders/notifications';
import { queryClient } from '@/lib/queryClient';
import { configureAudio, preloadSounds } from '@/lib/sounds';

export default function RootLayout() {
  useEffect(() => {
    void configureAudio();
    preloadSounds();
    configureNotifications();
  }, []);
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

/**
 * Red de seguridad: si una pantalla lanza un error al renderizar, se muestra esto en vez de una
 * pantalla en blanco. El detalle técnico sólo se registra en desarrollo.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  if (__DEV__) console.error(error);
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <ErrorState
          title="Algo salió mal"
          message="Polygo tuvo un error inesperado. Tu progreso guardado no se perdió."
          onRetry={() => void retry()}
        />
      </View>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, initializing, recoveringPassword } = useAuth();
  const profile = useMyProfile();
  useApplySoundEffectsPref();

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
        <Stack.Screen
          name="battle"
          options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
        />
        <Stack.Screen name="challenge/[code]" options={{ animation: 'none' }} />
        <Stack.Screen name="matches" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="leaderboard" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="achievements" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="missions" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="player/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="delete-account" options={{ animation: 'slide_from_right' }} />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(session) && recoveringPassword}>
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
      {/* Destino de los enlaces de email: siempre accesible. */}
      <Stack.Screen name="auth-callback" />
    </Stack>
  );
}
