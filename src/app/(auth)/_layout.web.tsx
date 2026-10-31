import { Link, Stack, usePathname } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { RankEmblem, ScreenMaxWidth, Text, colors, spacing } from '@/design-system';

/**
 * En la web, las pantallas de acceso llevan una barra con el logo que vuelve a la portada (no hay
 * botón atrás del sistema) y un formulario angosto. La portada tiene su propia barra.
 */
export default function AuthLayoutWeb() {
  const onLanding = usePathname() === '/';
  return (
    <View style={styles.page}>
      {onLanding ? null : (
        <View style={styles.bar}>
          <Link href="/" accessibilityLabel="Volver al inicio de Polygo" style={styles.home}>
            <View style={styles.homeInner}>
              <ArrowLeft color={colors.textMuted} size={18} />
              <RankEmblem tier="diamond" size={28} />
              <Text style={styles.logo}>Polygo</Text>
            </View>
          </Link>
        </View>
      )}
      <ScreenMaxWidth.Provider value={460}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        />
      </ScreenMaxWidth.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  bar: {
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundDeep,
  },
  home: { alignSelf: 'flex-start' },
  homeInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { fontSize: 20, fontWeight: '800', color: colors.textStrong, letterSpacing: -0.5 },
});
