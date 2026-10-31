import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode, Ref } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, gradients, spacing } from '../tokens';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Bordes con safe area; las pantallas con tab bar no necesitan 'bottom'. */
  edges?: Edge[];
  contentStyle?: ViewStyle;
  footer?: ReactNode;
  /** Pull-to-refresh (sólo con scroll). */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Ref del ScrollView (p. ej. para desplazarse a un elemento al montar). */
  scrollRef?: Ref<ScrollViewInstance>;
  /** Contenido fijo arriba del scroll (no se desplaza). */
  header?: ReactNode;
  /** Contenido flotante sobre el scroll (p. ej. un botón de acceso rápido). */
  overlay?: ReactNode;
  onScroll?: ScrollViewProps['onScroll'];
}

/** En la web (computadora) el contenido va en una columna centrada, como en el teléfono. */
const webColumn =
  Platform.OS === 'web' ? ({ width: '100%', maxWidth: 680, alignSelf: 'center' } as const) : null;

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
  footer,
  onRefresh,
  refreshing = false,
  scrollRef,
  header,
  overlay,
  onScroll,
}: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      onScroll={onScroll}
      scrollEventThrottle={onScroll ? 32 : undefined}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryBright}
          />
        ) : undefined
      }
      contentContainerStyle={[styles.content, webColumn, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, webColumn, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={gradients.screen} style={styles.fill}>
      <SafeAreaView edges={edges} style={styles.fill}>
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {header ? Platform.OS === 'web' ? <View style={webColumn}>{header}</View> : header : null}
          <View style={styles.fill}>
            {content}
            {overlay}
          </View>
          {footer ? <View style={[styles.footer, webColumn]}>{footer}</View> : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.xl, gap: spacing.lg, flexGrow: 1 },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
