import * as Haptics from 'expo-haptics';
import { Check, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { languageConfig } from '@shared/languages';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';

import {
  initiallyOpen,
  levelRange,
  toggleSection,
  type PickerCourse,
  type PickerSection,
} from './picker';
import { coursePickerStrings } from './strings';

/**
 * Selector de cursos agrupado por idioma de origen (picker.ts), en acordeón: la sección del idioma de
 * la interfaz abierta arriba y las demás cerradas debajo (tocar el título las abre o cierra; puede
 * haber varias abiertas). Cada curso muestra bandera, idioma y niveles; los tuyos van marcados.
 *
 * Lo usan el registro (elige un curso: `selectedCode`) y «Agregar curso» en «Tus cursos» (tocar uno
 * tuyo te pasa a ese curso; uno nuevo abre por dónde empezar). Qué pasa al tocar lo decide `onPick`.
 */
export function CoursePicker({
  sections,
  onPick,
  selectedCode = null,
}: {
  sections: readonly PickerSection[];
  onPick: (course: PickerCourse) => void;
  /** Curso elegido (registro): se resalta con un tilde. */
  selectedCode?: string | null;
}) {
  const styles = useStyles();
  const t = useStrings(coursePickerStrings);
  const [open, setOpen] = useState(() => initiallyOpen(sections));

  return (
    <View style={styles.list}>
      {sections.map((section) => {
        const expanded = open.has(section.source);
        const title = t.section[section.source];
        return (
          <View key={section.source} style={styles.section}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.sectionA11y(title, section.courses.length)}
              accessibilityHint={t.expandHint}
              accessibilityState={{ expanded }}
              onPress={() => {
                void Haptics.selectionAsync();
                setOpen((o) => toggleSection(o, section.source));
              }}
              style={({ pressed }) => [
                styles.header,
                expanded && styles.headerOpen,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sourceFlag}>{languageConfig(section.source).flag}</Text>
              <View style={styles.flex}>
                <Text variant="bodyStrong" color="textStrong">
                  {title}
                </Text>
                <Text variant="caption" color="textMuted">
                  {t.courseCount(section.courses.length)}
                </Text>
              </View>
              <ChevronDown
                color={colors.primarySoft}
                size={20}
                style={expanded ? styles.chevronOpen : undefined}
              />
            </Pressable>
            {expanded ? (
              <View style={styles.courses}>
                {section.courses.map((c, i) => (
                  <Animated.View
                    key={c.course.code}
                    entering={FadeInDown.delay(i * 40).duration(200)}
                  >
                    <CourseOption
                      course={c}
                      selected={selectedCode === c.course.code}
                      onPress={() => onPick(c)}
                    />
                  </Animated.View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function CourseOption({
  course,
  selected,
  onPress,
}: {
  course: PickerCourse;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(coursePickerStrings);
  const languageName = useLanguageName();
  const name = languageName(course.course.target);
  const levels = levelRange(course.levels);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.courseA11y(name, levels, course.mine)}
      accessibilityState={{ selected }}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.row,
        (selected || course.active) && styles.rowSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.flagBox}>
        <Text style={styles.flagText}>{course.language.flag}</Text>
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" color="primarySoft" numberOfLines={1}>
          {levels}
        </Text>
      </View>
      {course.mine ? (
        <View style={styles.minePill}>
          <Check color={colors.success} size={14} strokeWidth={3} />
          <Text variant="caption" color="success" numberOfLines={1}>
            {course.active ? t.active : t.mine}
          </Text>
        </View>
      ) : selected ? (
        <View style={styles.check}>
          <Check color={colors.onPrimary} size={16} strokeWidth={3} />
        </View>
      ) : (
        <ChevronRight color={colors.textMuted} size={18} />
      )}
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    list: { gap: spacing.md },
    section: { gap: spacing.sm },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 56,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    headerOpen: { borderColor: colors.brandBorder },
    sourceFlag: { fontSize: 24, lineHeight: 30 },
    chevronOpen: { transform: [{ rotate: '180deg' }] },
    courses: { gap: spacing.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 64,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    flagBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    flagText: { fontSize: 28, lineHeight: 34 },
    minePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      maxWidth: 140,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
    },
    check: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryBright,
    },
  }),
);
