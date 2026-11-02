import { type ReactNode, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Exercise, UserAnswer } from '@shared/exercises';

import { Button, MIN_TOUCH, Text, TextField, colors, radii, spacing } from '@/design-system';

import { shuffle, shuffleDifferent } from '../random';
import { TargetText, useSessionLanguage } from '../readings';

interface Props {
  exercise: Exercise;
  /** Semilla de la sesión: misma mezcla al volver a un ejercicio dentro de la sesión. */
  seed: string;
  disabled: boolean;
  onSubmit: (answer: UserAnswer) => void;
}

/** Zona de respuesta según el tipo de ejercicio. Siempre termina con "Comprobar". */
export function AnswerInput(props: Props) {
  const { payload } = props.exercise;
  switch (payload.type) {
    case 'image_choice':
    case 'translation_choice':
    case 'fill_blank':
    case 'listen_choice':
      return <ChoiceInput {...props} options={payload.options} />;
    case 'translate_write':
    case 'complete_word':
    case 'short_answer':
      return <TextInputAnswer {...props} />;
    case 'order_words':
      return <OrderInput {...props} tokens={payload.tokens} />;
    case 'match_pairs':
      return <MatchInput {...props} pairs={payload.pairs} />;
  }
}

/** Respuestas centradas en el espacio libre (o pegadas al enunciado) y "Comprobar" fijo abajo. */
function AnswerLayout({
  children,
  footer,
  alignTop,
}: {
  children: ReactNode;
  footer: ReactNode;
  alignTop?: boolean;
}) {
  return (
    <View style={styles.layout}>
      <View style={[styles.body, alignTop && styles.bodyTop]}>{children}</View>
      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

function ChoiceInput({
  exercise,
  seed,
  disabled,
  onSubmit,
  options,
}: Props & { options: string[] }) {
  const shuffled = useMemo(
    () => shuffle(options, `${seed}:${exercise.id}`),
    [options, seed, exercise.id],
  );
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <AnswerLayout
      footer={
        <Button
          label="Comprobar"
          size="lg"
          disabled={disabled || selected === null}
          onPress={() => selected !== null && onSubmit({ kind: 'option', value: selected })}
        />
      }
    >
      <View style={styles.options}>
        {shuffled.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === option, disabled }}
            disabled={disabled}
            onPress={() => setSelected(option)}
            style={({ pressed }) => [
              styles.option,
              selected === option && styles.optionSelected,
              pressed && styles.pressed,
            ]}
          >
            <TargetText
              variant="bodyStrong"
              color={selected === option ? 'textStrong' : 'text'}
              align="center"
            >
              {option}
            </TargetText>
          </Pressable>
        ))}
      </View>
    </AnswerLayout>
  );
}

function TextInputAnswer({ exercise, disabled, onSubmit }: Props) {
  const { language } = useSessionLanguage();
  const [value, setValue] = useState('');
  // En chino se escribe el pinyin (con números de tono: ni3 hao3).
  const answerIn = language.script === 'han' ? 'en pinyin' : language.inName;
  const submit = () => value.trim() && onSubmit({ kind: 'text', value });
  return (
    <AnswerLayout
      alignTop
      footer={
        <Button label="Comprobar" size="lg" disabled={disabled || !value.trim()} onPress={submit} />
      }
    >
      {/* Con el teclado abierto de entrada, el espacio libre lo ocupa el teclado. */}
      <TextField
        label={exercise.type === 'complete_word' ? 'Palabra completa' : `Tu respuesta ${answerIn}`}
        value={value}
        onChangeText={setValue}
        editable={!disabled}
        autoFocus
        multiline={exercise.type !== 'complete_word'}
        submitBehavior="submit"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        onSubmitEditing={submit}
        placeholder={language.script === 'han' ? 'Ej.: ni3 hao3' : 'Escribí acá…'}
        style={exercise.type === 'complete_word' ? styles.wordField : styles.textArea}
      />
    </AnswerLayout>
  );
}

function OrderInput({ exercise, seed, disabled, onSubmit, tokens }: Props & { tokens: string[] }) {
  // Cada ficha se identifica por índice: puede haber palabras repetidas.
  const bank = useMemo(
    () =>
      shuffleDifferent(
        tokens.map((text, index) => ({ text, index })),
        `${seed}:${exercise.id}`,
      ),
    [tokens, seed, exercise.id],
  );
  const [chosen, setChosen] = useState<number[]>([]);

  return (
    <AnswerLayout
      footer={
        <Button
          label="Comprobar"
          size="lg"
          disabled={disabled || chosen.length !== tokens.length}
          onPress={() => onSubmit({ kind: 'tokens', value: chosen.map((i) => tokens[i]!) })}
        />
      }
    >
      <View
        style={[styles.sentence, chosen.length === 0 && styles.sentenceEmpty]}
        accessibilityLabel="Tu oración"
      >
        {chosen.length === 0 ? <Text variant="caption">Tocá las palabras en orden</Text> : null}
        {chosen.map((index) => (
          <Token
            key={index}
            label={tokens[index]!}
            disabled={disabled}
            onPress={() => setChosen((c) => c.filter((i) => i !== index))}
          />
        ))}
      </View>
      <View style={styles.bank}>
        {bank.map(({ text, index }) => (
          <Token
            key={index}
            label={text}
            used={chosen.includes(index)}
            disabled={disabled || chosen.includes(index)}
            onPress={() => setChosen((c) => [...c, index])}
          />
        ))}
      </View>
    </AnswerLayout>
  );
}

function Token({
  label,
  onPress,
  disabled,
  used,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  used?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.token, used && styles.tokenUsed, pressed && styles.pressed]}
    >
      <TargetText variant="bodyStrong" color={used ? 'textSubtle' : 'textStrong'}>
        {label}
      </TargetText>
    </Pressable>
  );
}

function MatchInput({
  exercise,
  seed,
  disabled,
  onSubmit,
  pairs,
}: Props & { pairs: { left: string; right: string }[] }) {
  const { language } = useSessionLanguage();
  const lefts = useMemo(
    () =>
      shuffle(
        pairs.map((p) => p.left),
        `${seed}:${exercise.id}:l`,
      ),
    [pairs, seed, exercise.id],
  );
  const rights = useMemo(
    () =>
      shuffle(
        pairs.map((p) => p.right),
        `${seed}:${exercise.id}:r`,
      ),
    [pairs, seed, exercise.id],
  );
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const usedRights = new Set(Object.values(matches));

  const pickRight = (right: string) => {
    if (!activeLeft) return;
    setMatches((m) => {
      const next = Object.fromEntries(Object.entries(m).filter(([, r]) => r !== right));
      return { ...next, [activeLeft]: right };
    });
    setActiveLeft(null);
  };

  return (
    <AnswerLayout
      footer={
        <>
          <Text variant="caption" align="center">
            {`Tocá una palabra ${language.inName} y después su significado.`}
          </Text>
          <Button
            label="Comprobar"
            size="lg"
            disabled={disabled || Object.keys(matches).length !== pairs.length}
            onPress={() =>
              onSubmit({
                kind: 'pairs',
                value: Object.entries(matches).map(([left, right]) => ({ left, right })),
              })
            }
          />
        </>
      }
    >
      <View style={styles.match}>
        <View style={styles.column}>
          {lefts.map((left) => (
            <Pressable
              key={left}
              accessibilityRole="button"
              accessibilityLabel={matches[left] ? `${left}, unido con ${matches[left]}` : left}
              accessibilityState={{ selected: activeLeft === left, disabled }}
              disabled={disabled}
              onPress={() => {
                if (matches[left]) {
                  setMatches(({ [left]: _removed, ...rest }) => rest);
                }
                setActiveLeft(left);
              }}
              style={[
                styles.matchItem,
                activeLeft === left && styles.optionSelected,
                matches[left] && styles.matched,
              ]}
            >
              <TargetText variant="bodyStrong" align="center">
                {left}
              </TargetText>
              {matches[left] ? (
                <Text variant="caption" align="center" color="primarySoft">
                  {matches[left]}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
        <View style={styles.column}>
          {rights.map((right) => (
            <Pressable
              key={right}
              accessibilityRole="button"
              accessibilityLabel={right}
              accessibilityState={{ disabled: disabled || !activeLeft }}
              disabled={disabled || !activeLeft}
              onPress={() => pickRight(right)}
              style={[styles.matchItem, usedRights.has(right) && styles.tokenUsed]}
            >
              <Text
                variant="bodyStrong"
                align="center"
                color={usedRights.has(right) ? 'textSubtle' : 'text'}
              >
                {right}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </AnswerLayout>
  );
}

const styles = StyleSheet.create({
  layout: { flex: 1, gap: spacing.xl },
  body: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  bodyTop: { justifyContent: 'flex-start' },
  footer: { gap: spacing.md },
  textArea: {
    minHeight: 120,
    fontSize: 20,
    lineHeight: 28,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    textAlignVertical: 'top',
  },
  wordField: { fontSize: 22, lineHeight: 28, minHeight: 60, textAlign: 'center' },
  options: { gap: spacing.md },
  option: {
    minHeight: MIN_TOUCH + 20,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
  pressed: { opacity: 0.85 },
  sentence: {
    minHeight: 96,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  sentenceEmpty: { justifyContent: 'center', borderStyle: 'dashed' },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  token: {
    minHeight: MIN_TOUCH + 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  tokenUsed: { opacity: 0.35 },
  match: { flex: 1, maxHeight: 520, flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.md },
  // Las fichas crecen para ocupar el espacio libre, con tope para no quedar gigantes.
  matchItem: {
    flexGrow: 1,
    flexBasis: MIN_TOUCH + 20,
    maxHeight: 110,
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  matched: { borderColor: colors.primarySoft },
});
