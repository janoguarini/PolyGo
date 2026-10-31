import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, Layers, Swords, User } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';

import { colors } from '@/design-system';
import { useReminderSync } from '@/features/reminders/hooks';
import { useWidgetSync } from '@/features/widgets/useWidgetSync';

export default function TabsLayout() {
  // Con sesión y onboarding completo: los widgets reflejan las palabras del usuario.
  useWidgetSync();
  useReminderSync();
  // En la computadora, las pestañas van en una barra lateral.
  const { width } = useWindowDimensions();
  const sidebar = Platform.OS === 'web' && width >= 900;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryBright,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarPosition: sidebar ? 'left' : 'bottom',
        tabBarLabelPosition: sidebar ? 'beside-icon' : undefined,
        tabBarStyle: sidebar
          ? {
              backgroundColor: colors.backgroundDeep,
              borderRightColor: colors.border,
              width: 220,
              paddingTop: 24,
            }
          : { backgroundColor: colors.backgroundDeep, borderTopColor: colors.border },
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
        name="vocabulary"
        options={{
          title: 'Vocabulario',
          tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />,
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
  );
}
