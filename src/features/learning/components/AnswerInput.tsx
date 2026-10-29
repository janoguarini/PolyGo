import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Exercise, UserAnswer } from '@shared/exercises';

import { Button, MIN_TOUCH, Text, TextField, colors, radii, spacing } from '@/design-system';

import { shuffle, shuffleDifferent } from '../random';

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
    <View style={styles.gap}>
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
            <Text
              variant="bodyStrong"
              color={selected === option ? 'textStrong' : 'text'}
              align="center"
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <Button
        label="Comprobar"
        size="lg"
        disabled={disabled || selected === null}
        onPress={() => selected !== null && onSubmit({ kind: 'option', value: selected })}
      />
    </View>
  );
}

function TextInputAnswer({ exercise, disabled, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const submit = () => value.trim() && onSubmit({ kind: 'text', value });
  return (
    <View style={styles.gap}>
      <TextField
        label={exercise.type === 'complete_word' ? 'Palabra completa' : 'Tu respuesta en inglés'}
        value={value}
        onChangeText={setValue}
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        onSubmitEditing={submit}
        placeholder="Escribí acá…"
      />
      <Button label="Comprobar" size="lg" disabled={disabled || !value.trim()} onPress={submit} />
    </View>
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
    <View style={styles.gap}>
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
      <Button
        label="Comprobar"
        size="lg"
        disabled={disabled || chosen.length !== tokens.length}
        onPress={() => onSubmit({ kind: 'tokens', value: chosen.map((i) => tokens[i]!) })}
      />
    </View>
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
      <Text variant="bodyStrong" color={used ? 'textSubtle' : 'textStrong'}>
        {label}
      </Text>
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
    <View style={styles.gap}>
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
              <Text variant="bodyStrong" align="center">
                {left}
              </Text>
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
      <Text variant="caption" align="center">
        Tocá una palabra en inglés y después su significado.
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
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  options: { gap: spacing.sm },
  option: {
    minHeight: MIN_TOUCH + 8,
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
    minHeight: 64,
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
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  tokenUsed: { opacity: 0.35 },
  match: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  matchItem: {
    minHeight: MIN_TOUCH + 8,
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  matched: { borderColor: colors.primarySoft },
});
