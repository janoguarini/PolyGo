import { router } from 'expo-router';
import { Check, Lock, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  Text,
  colors,
  radii,
  spacing,
} from '@/design-system';
import type { LessonWithStatus } from '@/features/learning/curriculum';
import { useCurriculum } from '@/features/learning/hooks';

export default function LearnScreen() {
  const curriculum = useCurriculum();

  if (curriculum.isPending) return <LoadingState label="Cargando currículo…" />;
  if (curriculum.isError || !curriculum.data) {
    return <ErrorState onRetry={() => void curriculum.refetch()} />;
  }
  const { units } = curriculum.data;

  return (
    <Screen onRefresh={() => void curriculum.refetch()} refreshing={curriculum.isRefetching}>
      <View style={styles.header}>
        <Text variant="overline" color="primarySoft">
          INGLÉS · A1
        </Text>
        <Text variant="title">Aprender</Text>
      </View>

      {units.length === 0 ? (
        <EmptyState title="Todavía no hay unidades publicadas" />
      ) : (
        units.map((unit) => (
          <Card key={unit.id} style={styles.unit}>
            <View style={styles.unitHeader}>
              <Text style={styles.unitEmoji}>{unit.emoji}</Text>
              <View style={styles.flex}>
                <Text variant="overline">UNIDAD {unit.position}</Text>
                <Text variant="heading">{unit.title}</Text>
                <Text variant="caption">{unit.description}</Text>
              </View>
            </View>
            <ProgressBar
              value={unit.lessons.length ? unit.completedCount / unit.lessons.length : 0}
              accessibilityLabel={`Progreso de la unidad ${unit.position}`}
            />
            <Text variant="caption">
              {unit.completedCount}/{unit.lessons.length} lecciones
            </Text>
            <View style={styles.lessons}>
              {unit.lessons.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} />
              ))}
            </View>
          </Card>
        ))
      )}

      <Text variant="caption" align="center">
        Unidades 4 a 12 (familia, casa, comida, rutinas…) en preparación. El contenido sigue el
        nivel A1 del MCER como referencia; completarlo no equivale a una certificación oficial.
      </Text>
    </Screen>
  );
}

function LessonRow({ lesson }: { lesson: LessonWithStatus }) {
  const locked = lesson.status === 'locked';
  const current = lesson.status === 'current';
  const label = `Lección ${lesson.position}: ${lesson.title}. ${
    locked
      ? 'Bloqueada'
      : current
        ? 'Siguiente lección'
        : `Completada, mejor precisión ${Math.round((lesson.bestAccuracy ?? 0) * 100)}%`
  }`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}
      style={({ pressed }) => [
        styles.lesson,
        current && styles.lessonCurrent,
        locked && styles.lessonLocked,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.badge,
          current && styles.badgeCurrent,
          lesson.status === 'completed' && styles.badgeDone,
        ]}
      >
        {locked ? (
          <Lock color={colors.textSubtle} size={16} />
        ) : current ? (
          <Play color={colors.onPrimary} size={16} fill={colors.onPrimary} />
        ) : (
          <Check color={colors.background} size={18} strokeWidth={3} />
        )}
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color={locked ? 'textMuted' : 'textStrong'}>
          {lesson.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {lesson.objective}
        </Text>
      </View>
      {lesson.status === 'completed' && lesson.bestAccuracy !== null ? (
        <Text variant="caption" color="success">
          {Math.round(lesson.bestAccuracy * 100)}%
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
  unit: { gap: spacing.md },
  unitHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  unitEmoji: { fontSize: 40, lineHeight: 48 },
  flex: { flex: 1, gap: spacing.xxs },
  lessons: { gap: spacing.sm, marginTop: spacing.xs },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonCurrent: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
  lessonLocked: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  badgeCurrent: { backgroundColor: colors.primary, borderColor: colors.primaryBright },
  badgeDone: { backgroundColor: colors.success, borderColor: colors.success },
});
