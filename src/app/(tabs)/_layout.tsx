import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, Swords, User, Users } from 'lucide-react-native';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { useFriends } from '@/features/friends/api';
import { BattleInviteBanner } from '@/features/friends/components/BattleInviteBanner';
import { useBattleInvitePush } from '@/features/friends/push';
import { usePresence } from '@/features/friends/social';
import { AppTour } from '@/features/onboarding/AppTour';
import { useFinishTour, useTourPending } from '@/features/onboarding/tour';
import { useReminderSync } from '@/features/reminders/hooks';
import { useWidgetSync } from '@/features/widgets/useWidgetSync';

export default function TabsLayout() {
  // Con sesión y onboarding completo: los widgets reflejan las palabras del usuario.
  useWidgetSync();
  useReminderSync();
  // Latido de "en línea"; trae las invitaciones a amistosos que te mandaron.
  const invites = usePresence().data ?? [];
  // Push de desafíos: registra el token y abre la partida al tocar la notificación.
  useBattleInvitePush();
  // Tutorial guiado para cuentas recién creadas.
  const userId = useAuth().session?.user.id;
  const tourPending = useTourPending(userId);
  const finishTour = useFinishTour(userId);
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
          tabBarActiveBackgroundColor: sidebar ? colors.surfaceHighlight : undefined,
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
            title: 'Aprender',
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Repaso',
            tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ranked"
          options={{
            title: 'Ranked',
            tabBarIcon: ({ color, size }) => <Swords color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: 'Amigos',
            tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
            tabBarBadge: pendingRequests > 0 ? pendingRequests : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.danger, fontSize: 11 },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
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
