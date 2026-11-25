import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';
import { coursesStrings } from '@/i18n/screens/courses';
import { learnStrings } from '@/i18n/screens/learn';

import type { CourseEntry } from './catalog';
import { useSwitchCourse } from './hooks';
import { useCourseList } from './useCourseList';

/**
 * Línea compacta bajo el idioma de Aprender: los cursos que estudiás (tocar uno cambia de curso,
 * igual que en «Tus cursos») y un «+» que recién ahí abre «Tus cursos» para agregar otro idioma.
 */
export function CourseSwitcher({ onClose }: { onClose: () => void }) {
  const styles = useStyles();
  const t = useStrings(learnStrings);
  const ct = useStrings(coursesStrings);
  const languageName = useLanguageName();
  const { list, isPending } = useCourseList();
  const switchCourse = useSwitchCourse();

  const entries: CourseEntry[] = list ? [list.active, ...list.mine] : [];

  const choose = (entry: CourseEntry) => {
    if (entry.active) return onClose();
    if (!entry.selectable || switchCourse.isPending) return;
    void Haptics.selectionAsync();
    // Optimista: Aprender muestra el curso nuevo al instante (como en «Tus cursos»).
    switchCourse.mutate(entry.course, {
      onError: () => Alert.alert(ct.switchErrorTitle, ct.switchErrorMessage),
    });
    onClose();
  };

  const add = () => {
    void Haptics.selectionAsync();
    onClose();
    router.push('/courses');
  };

  return (
    <Animated.View entering={FadeInUp.duration(180)} exiting={FadeOutUp.duration(140)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {isPending && !list ? <ActivityIndicator color={colors.primaryBright} /> : null}
        {entries.map((entry) => {
          const name = languageName(entry.course.target);
          return (
            <Pressable
              key={entry.course.code}
              accessibilityRole="button"
              accessibilityState={{ selected: entry.active, disabled: !entry.selectable }}
              accessibilityLabel={entry.active ? t.studying(name, false) : t.switchTo(name)}
              disabled={!entry.selectable && !entry.active}
              onPress={() => choose(entry)}
              style={({ pressed }) => [
                styles.chip,
                entry.active && styles.chipActive,
                !entry.selectable && !entry.active && styles.chipDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.flag}>{entry.language.flag}</Text>
              <Text
                variant="caption"
                color={entry.active ? 'textStrong' : 'text'}
                style={styles.name}
                numberOfLines={1}
              >
                {name}
              </Text>
              {entry.active ? <Check color={colors.primarySoft} size={14} strokeWidth={3} /> : null}
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.addLanguage}
          onPress={add}
          hitSlop={4}
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}
        >
          <Plus color={colors.primarySoft} size={18} strokeWidth={2.6} />
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2 },
    chip: {
      height: 36,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    chipActive: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
    chipDisabled: { opacity: 0.45 },
    flag: { fontSize: 18, lineHeight: 22 },
    name: { fontWeight: '700', maxWidth: 110 },
    add: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primarySoft,
    },
    pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  }),
);
