import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, Swords, User, Users } from 'lucide-react-native';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors, useTheme } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { useFriends } from '@/features/friends/api';
import { BattleInviteBanner } from '@/features/friends/components/BattleInviteBanner';
import { useBattleInvitePush } from '@/features/friends/push';
import { usePresence } from '@/features/friends/social';
import { useSpeechLanguage } from '@/features/learning/speech';
import { AppTour } from '@/features/onboarding/AppTour';
import { useFinishTour, useTourPending } from '@/features/onboarding/tour';
import { useMyProfile } from '@/features/profile/hooks';
import { useReminderSync } from '@/features/reminders/hooks';
import { useStoreReviewPrompt } from '@/features/storeReview/useStoreReviewPrompt';
import { useWelcomeAutoOpen } from '@/features/welcomeRewards/useWelcomeAutoOpen';
import { useWidgetSync } from '@/features/widgets/useWidgetSync';
import { useStrings } from '@/i18n';
import { tabsStrings } from '@/i18n/screens/tabs';

export default function TabsLayout() {
  useTheme();
  const t = useStrings(tabsStrings);
  // Con sesión y onboarding completo: los widgets reflejan las palabras del usuario.
  useWidgetSync();
  useReminderSync();
  // Latido de "en línea"; trae las invitaciones a amistosos que te mandaron.
  const invites = usePresence().data ?? [];
  // Push de desafíos: registra el token y abre la partida al tocar la notificación.
  useBattleInvitePush();
  // Tutorial guiado para cuentas recién creadas.
  const userId = useAuth().session?.user.id;
  // La voz sintetizada habla en el idioma que estudiás.
  const me = useMyProfile();
  useSpeechLanguage(me.data?.profile.target_language);
  // Recompensa diaria: se abre sola tras la primera lección o Ranked del día (una vez por sesión).
  useWelcomeAutoOpen(Boolean(me.data));
  const tourPending = useTourPending(userId);
  const finishTour = useFinishTour(userId);
  // Valorar la app: tras 5 lecciones o 5 Ranked (lo primero), una sola vez; nunca sobre el tutorial.
  useStoreReviewPrompt(!tourPending);
  // Solicitudes de amistad sin responder + invitaciones: globito en la pestaña Amigos.
  const pendingRequests =
    (useFriends().data?.filter((f) => f.state === 'incoming').length ?? 0) + invites.length;
  // En la computadora, las pestañas van en una barra lateral.
  const { width } = useWindowDimensions();
  const sidebar = Platform.OS === 'web' && width >= 900;
  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryBright,
          tabBarInactiveTintColor: colors.textMuted,
          // En el teléfono la pestaña activa se marca sólo con el color violeta del ícono y la
          // etiqueta, sin fondo detrás. En la barra lateral de la computadora sí lleva fondo.
          tabBarActiveBackgroundColor: sidebar ? colors.surfaceHighlight : 'transparent',
          tabBarItemStyle: sidebar
            ? { borderRadius: 12, marginHorizontal: 12, marginVertical: 2 }
            : undefined,
          tabBarPosition: sidebar ? 'left' : 'bottom',
          tabBarLabelPosition: sidebar ? 'beside-icon' : undefined,
          tabBarStyle: sidebar
            ? {
                backgroundColor: colors.backgroundDeep,
                borderRightColor: colors.border,
                width: 220,
                paddingTop: 24,
              }
            : {
                backgroundColor: colors.backgroundDeep,
                borderTopColor: colors.border,
                // En el navegador no hay safe area abajo y la etiqueta quedaba cortada.
                ...(Platform.OS === 'web' ? { height: 64, paddingBottom: 8 } : null),
              },
          tabBarLabelStyle: sidebar
            ? { fontSize: 15, fontWeight: '600', marginLeft: 12 }
            : { fontSize: 11, fontWeight: '600' },
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t.learn,
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: t.review,
            tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ranked"
          options={{
            title: t.ranked,
            tabBarIcon: ({ color, size }) => <Swords color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: t.friends,
            tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
            tabBarBadge: pendingRequests > 0 ? pendingRequests : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.danger, fontSize: 11 },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t.profile,
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
      <BattleInviteBanner invites={invites} />
      {tourPending ? <AppTour onFinish={() => finishTour.mutate()} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
