import { useTheme } from '../theme';
import { AlertTriangle, Inbox, WifiOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useStrings } from '@/i18n';

import { designSystemStrings } from '../strings';
import { colors, spacing } from '../tokens';
import { Button } from './Button';
import { Text } from './Text';

export function LoadingState({ label: labelProp }: { label?: string }) {
  useTheme();
  const t = useStrings(designSystemStrings);
  const label = labelProp ?? t.loading;
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
  useTheme();
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
  title,
  message,
  onRetry,
  offline = false,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  offline?: boolean;
}) {
  useTheme();
  const t = useStrings(designSystemStrings);
  return (
    <EmptyState
      icon={
        offline ? (
          <WifiOff color={colors.danger} size={36} />
        ) : (
          <AlertTriangle color={colors.danger} size={36} />
        )
      }
      title={offline ? t.offlineTitle : (title ?? t.errorTitle)}
      message={offline ? t.offlineMessage : (message ?? t.errorMessage)}
      actionLabel={onRetry ? t.retry : undefined}
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
