import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, Lock, Plus, Smartphone, Volume2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useWordOfTheDay } from '@/features/learning/hooks';
import { usePlus } from '@/features/plus/api';
import { PLUS_INK } from '@/features/plus/components/GoldButton';
import { useStrings } from '@/i18n';

import { WIDGET_CONTENT_OPTIONS } from './content';
import { useSetWidgetContent, useWidgetContentPref } from './preferences';
import { widgetStrings } from './strings';
import { widgetsSupported } from './sync';

/**
 * Widgets en la pestaña Repaso: vista previa de los dos widgets, botón para agregarlos (abre una
 * guía de 3 pasos: ni iOS ni Android permiten que la app los agregue sola) y qué muestra «Palabra»
 * (elegirlo es de Plus). Hoy son widgets de la pantalla de inicio.
 */
export function WidgetsCard() {
  const styles = useStyles();
  const t = useStrings(widgetStrings);
  const [guide, setGuide] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Smartphone color={colors.info} size={20} />
        </View>
        <View style={styles.flex}>
          <Text variant="heading" color="textStrong">
            {t.cardTitle}
          </Text>
          <Text variant="caption" color="text">
            {t.cardSubtitle}
          </Text>
        </View>
      </View>

      <View style={styles.previews}>
        <WordPreview />
        <QuizPreview />
      </View>

      {widgetsSupported ? (
        <Button
          label={t.add}
          size="lg"
          icon={<Plus color={colors.onPrimary} size={20} />}
          onPress={() => setGuide(true)}
        />
      ) : (
        <Text variant="caption" color="streak" align="center" style={styles.bold}>
          {t.unavailable}
        </Text>
      )}

      {widgetsSupported ? <ContentChips /> : null}

      <Modal
        visible={guide}
        transparent
        animationType="fade"
        onRequestClose={() => setGuide(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setGuide(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text variant="heading" color="textStrong" accessibilityRole="header">
              {t.guideTitle}
            </Text>
            {(Platform.OS === 'ios' ? t.guideSteps.ios : t.guideSteps.android).map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text color="textStrong" style={styles.stepText}>
                  {step}
                </Text>
              </View>
            ))}
            <Button label={t.guideDone} onPress={() => setGuide(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/** Así se ve el widget «Palabra» (con la palabra del día real si ya cargó). */
function WordPreview() {
  const styles = useStyles();
  const t = useStrings(widgetStrings);
  const word = useWordOfTheDay().data;
  return (
    <View style={styles.previewCol}>
      <LinearGradient
        colors={['#5B2BC2', '#2A1566']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.preview}
        accessible={false}
      >
        <Text style={styles.previewLabel}>{t.previewDaily}</Text>
        <Text style={styles.previewWord} numberOfLines={1} adjustsFontSizeToFit>
          {word?.text ?? 'hello'}
        </Text>
        <Text style={styles.previewSub} numberOfLines={1}>
          {word?.translation_es ?? 'hola'}
        </Text>
        <Volume2 color="rgba(255,255,255,0.8)" size={16} style={styles.previewSpeaker} />
      </LinearGradient>
      <Text variant="caption" color="text" style={styles.bold}>
        {t.wordName}
      </Text>
    </View>
  );
}

/** Así se ve el widget «Pregunta rápida». */
function QuizPreview() {
  const styles = useStyles();
  const t = useStrings(widgetStrings);
  const word = useWordOfTheDay().data;
  return (
    <View style={styles.previewCol}>
      <LinearGradient
        colors={['#1E3A8A', '#172554']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.preview}
        accessible={false}
      >
        <Text style={styles.previewLabel}>{t.previewQuestion}</Text>
        <Text style={styles.previewQuizWord} numberOfLines={1} adjustsFontSizeToFit>
          {word?.translation_es ?? 'hola'}
        </Text>
        <View style={styles.options}>
          <View style={[styles.option, styles.optionRight]}>
            <Text style={styles.optionText} numberOfLines={1} adjustsFontSizeToFit>
              {word?.text ?? 'hello'}
            </Text>
          </View>
          <View style={styles.option}>
            <Text style={styles.optionText}>···</Text>
          </View>
        </View>
      </LinearGradient>
      <Text variant="caption" color="text" style={styles.bold}>
        {t.quizName}
      </Text>
    </View>
  );
}

/** Qué muestra «Palabra»: chips compactos; sin Plus sólo «Variado» y el resto con candado. */
function ContentChips() {
  const styles = useStyles();
  const t = useStrings(widgetStrings);
  const plus = usePlus();
  const pref = useWidgetContentPref().data ?? 'mixed';
  const setPref = useSetWidgetContent();
  const current = plus ? pref : 'mixed';
  return (
    <View style={styles.pickerBlock}>
      <Text variant="caption" color="textStrong" style={styles.bold}>
        {t.pickerTitle}
      </Text>
      <View style={styles.chips}>
        {WIDGET_CONTENT_OPTIONS.map((o) => {
          const locked = plus !== true && o.id !== 'mixed';
          const selected = current === o.id;
          return (
            <Pressable
              key={o.id}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: locked }}
              accessibilityLabel={`${t.options[o.id].title}. ${t.options[o.id].caption}${locked ? '. Plus' : ''}`}
              onPress={() => (locked ? router.push('/plus') : setPref.mutate(o.id))}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipOn,
                locked && styles.chipLocked,
                pressed && styles.pressed,
              ]}
            >
              {selected ? <Check color={colors.onPrimary} size={14} strokeWidth={3} /> : null}
              {locked ? <Lock color={colors.gold} size={12} /> : null}
              <Text
                style={[styles.chipText, selected && styles.chipTextOn]}
                color={locked ? 'textMuted' : 'textStrong'}
              >
                {t.options[o.id].title}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text variant="caption" color="textMuted">
        {t.pickerNote}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    pressed: { opacity: 0.8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    card: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(56,189,248,0.15)',
    },
    previews: { flexDirection: 'row', gap: spacing.md },
    previewCol: { flex: 1, alignItems: 'center', gap: spacing.xs },
    preview: {
      width: '100%',
      aspectRatio: 1,
      maxWidth: 160,
      borderRadius: 26,
      padding: spacing.md,
      justifyContent: 'center',
      gap: 2,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.14)',
    },
    previewLabel: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
    },
    previewWord: { color: '#FFFFFF', fontSize: 24, lineHeight: 28, fontWeight: '900' },
    previewSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
    previewSpeaker: { position: 'absolute', right: spacing.md, bottom: spacing.md },
    previewQuizWord: { color: '#FFFFFF', fontSize: 20, lineHeight: 24, fontWeight: '900' },
    options: { flexDirection: 'row', gap: 6, marginTop: 6 },
    option: {
      flex: 1,
      paddingVertical: 6,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.14)',
    },
    optionRight: { backgroundColor: 'rgba(34,197,94,0.55)' },
    optionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
    pickerBlock: { gap: spacing.xs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipLocked: { opacity: 0.85 },
    chipText: { fontSize: 14, fontWeight: '700' },
    chipTextOn: { color: colors.onPrimary },
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
      gap: spacing.md,
      padding: spacing.xl,
      paddingBottom: spacing.xl * 1.5,
      borderTopLeftRadius: radii.xl,
      borderTopRightRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gold,
    },
    stepNumberText: { color: PLUS_INK, fontWeight: '900', fontSize: 15 },
    stepText: { flex: 1, fontSize: 15, lineHeight: 20, fontWeight: '600' },
  }),
);
