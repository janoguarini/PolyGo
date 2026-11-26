import { useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { usePlus } from '@/features/plus/api';
import { useMyProfile } from '@/features/profile/hooks';
import { identifyUser, initAnalytics, resetAnalytics, trackScreen } from '@/lib/analytics';

/**
 * Nombre de pantalla para la analítica: la ruta como plantilla, sin los grupos de Expo Router y con
 * los parámetros sin reemplazar (/lesson/[id], nunca /lesson/a1-u02-l03), así se agrupan bien.
 */
export function screenName(segments: readonly string[]): string {
  const parts = segments.filter((s) => !(s.startsWith('(') && s.endsWith(')')));
  return '/' + parts.join('/');
}

/**
 * Pantallas vistas, cuenta identificada (sólo id interno + idioma, nivel, objetivo, país y Plus) y
 * reset al cerrar sesión. No dibuja nada.
 */
export function AnalyticsBootstrap() {
  const segments = useSegments();
  const name = screenName(segments);
  const userId = useAuth().session?.user.id;
  const profile = useMyProfile().data?.profile;
  const language = profile?.target_language;
  const level = profile?.start_level;
  const goal = profile?.daily_goal_minutes;
  const region = profile?.region;
  const onboarded = profile ? Boolean(profile.onboarding_completed_at) : undefined;
  const plus = usePlus();
  const lastUser = useRef<string | undefined>(undefined);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackScreen(name);
  }, [name]);

  useEffect(() => {
    if (userId) {
      lastUser.current = userId;
      identifyUser(userId, {
        target_language: language,
        start_level: level,
        daily_goal_minutes: goal,
        region,
        onboarded,
        plus,
      });
    } else if (lastUser.current) {
      // Cerró sesión: lo que sigue ya no es de esa cuenta.
      lastUser.current = undefined;
      resetAnalytics();
    }
  }, [userId, language, level, goal, region, onboarded, plus]);

  return null;
}
