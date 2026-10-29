import { AlertTriangle, Inbox, WifiOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../tokens';
import { Button } from './Button';
import { Text } from './Text';

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="polite" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.primaryBright} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

interface MessageStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, message, actionLabel, onAction, icon }: MessageStateProps) {
  return (
    <View style={styles.center}>
      {icon ?? <Inbox color={colors.textMuted} size={36} />}
      <Text variant="heading" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textMuted" align="center">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Algo salió mal',
  message = 'No pudimos cargar esta información.',
  onRetry,
  offline = false,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  offline?: boolean;
}) {
  return (
    <EmptyState
      icon={
        offline ? (
          <WifiOff color={colors.danger} size={36} />
        ) : (
          <AlertTriangle color={colors.danger} size={36} />
        )
      }
      title={offline ? 'Sin conexión' : title}
      message={offline ? 'Revisá tu conexión a internet e intentá de nuevo.' : message}
      actionLabel={onRetry ? 'Reintentar' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
});
