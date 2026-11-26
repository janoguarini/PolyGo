import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState, LoadingState, ThemeProvider, colors, useTheme } from '@/design-system';
import { adsEnabled } from '@/features/ads';
import { AdsBootstrap } from '@/features/ads/AdsBootstrap';
import { AnalyticsBootstrap } from '@/features/analytics/AnalyticsBootstrap';
import { PurchasesBootstrap } from '@/features/plus/PurchasesBootstrap';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { ConfigMissing } from '@/features/auth/ConfigMissing';
import { useApplyProfileInterfaceLanguage } from '@/features/courses/hooks';
import { useClientCompatibility } from '@/features/compat/hooks';
import { mustUpdate } from '@/features/compat/status';
import { UpdateRequired } from '@/features/compat/UpdateRequired';
import { PolysToast } from '@/features/polys/PolysToast';
import { useApplySoundEffectsPref } from '@/features/preferences/soundEffects';
import { useMyProfile } from '@/features/profile/hooks';
import { ReferralBootstrap } from '@/features/referrals/ReferralBootstrap';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import { envProblems } from '@/lib/env';
import { configureNotifications } from '@/features/reminders/notifications';
import { XpCelebration } from '@/features/xp/XpCelebration';
import {
  getStrings,
  hydrateInterfaceLanguage,
  useInterfaceLanguageHydrated,
  useStrings,
} from '@/i18n';
import { rootStrings } from '@/i18n/screens/root';
import { queryClient } from '@/lib/queryClient';
import { configureAudio, preloadSounds } from '@/lib/sounds';

export default function RootLayout() {
  useEffect(() => {
    void configureAudio();
    preloadSounds();
    configureNotifications();
    void hydrateInterfaceLanguage();
  }, []);
  return (
    <ThemeProvider>
      <ThemedRoot />
    </ThemeProvider>
  );
}

/** Todo lo que depende del tema va debajo de ThemeProvider. */
function ThemedRoot() {
  const { scheme } = useTheme();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
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
export function ErrorBoundary(props: ErrorBoundaryProps) {
  // Reemplaza al layout cuando hay un error: necesita su propio ThemeProvider.
  return (
    <ThemeProvider>
      <ErrorScreen {...props} />
    </ThemeProvider>
  );
}

function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  const { scheme } = useTheme();
  const t = getStrings(rootStrings);
  if (__DEV__) console.error(error);
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
        <ErrorState title={t.crashTitle} message={t.crashMessage} onRetry={() => void retry()} />
      </View>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  useTheme();
  const { session, initializing, recoveringPassword } = useAuth();
  const t = useStrings(rootStrings);
  const languageReady = useInterfaceLanguageHydrated();
  const profile = useMyProfile();
  useApplySoundEffectsPref();
  // El idioma de la interfaz guardado en el perfil (si lo eligió) manda sobre el del dispositivo.
  useApplyProfileInterfaceLanguage();
  // Fase C.5: versión mínima del servidor. No espera la respuesta: sólo bloquea un rechazo explícito.
  const compat = useClientCompatibility();
  // La foto propia se baja apenas se conoce, así el perfil ya la tiene en caché al abrirlo.
  const photoUrl = avatarPhotoUrl(profile.data?.profile.avatar_path);
  useEffect(() => {
    if (photoUrl) void Image.prefetch(photoUrl).catch(() => undefined);
  }, [photoUrl]);

  if (compat.data && mustUpdate(compat.data))
    return <UpdateRequired compat={compat.data} onRetry={() => void compat.refetch()} />;
  if (!languageReady || initializing || (session && profile.isPending))
    return <LoadingState label={t.loading} />;
  if (session && profile.isError) {
    return <ErrorState message={t.profileError} onRetry={() => void profile.refetch()} />;
  }

  const signedIn = Boolean(session) && !recoveringPassword;
  const onboarded = Boolean(profile.data?.profile.onboarding_completed_at);

  return (
    <>
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
          <Stack.Screen name="shop" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="plus" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="review-topics" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="lesson-intro/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="player/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="courses" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="course-start/[code]" options={{ animation: 'slide_from_right' }} />
          {/* Sin gesto de salida: abandonar el test se confirma con la X (no se guarda nada). */}
          <Stack.Screen
            name="placement/[code]"
            options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
          />
          <Stack.Screen name="add-friends" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="challenge-friend" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="delete-account" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="invite-friends" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="welcome-rewards" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="smart-review" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="coach" options={{ animation: 'slide_from_right' }} />
          {/* Panel de administración: sólo janitogap con MFA (lo valida la base). */}
          <Stack.Screen name="admin" options={{ animation: 'slide_from_right' }} />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(session) && recoveringPassword}>
          <Stack.Screen name="reset-password" />
        </Stack.Protected>
        {/* Destino de los enlaces de email: siempre accesible. */}
        <Stack.Screen name="auth-callback" />
        {/* Enlace de invitación: se abre con o sin cuenta; guarda el código y vuelve al inicio. */}
        <Stack.Screen name="invite/[code]" options={{ animation: 'none' }} />
      </Stack>
      {signedIn && onboarded ? <PolysToast /> : null}
      {signedIn && onboarded ? <XpCelebration /> : null}
      {signedIn && onboarded ? <ReferralBootstrap /> : null}
      {/* AdMob Fase 1: sólo builds de desarrollo (anuncios de prueba). Siempre montado mientras
          esté habilitado, así una salida de sesión o el paso a Plus apagan los anuncios. */}
      {adsEnabled ? <AdsBootstrap /> : null}
      {/* PolyGo Plus: asocia la tienda (RevenueCat) a la cuenta. Sin claves no hace nada. */}
      <PurchasesBootstrap />
      {/* Analítica (PostHog): pantallas vistas y cuenta. Sin EXPO_PUBLIC_POSTHOG_KEY no hace nada. */}
      <AnalyticsBootstrap />
    </>
  );
}
