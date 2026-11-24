import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { languageConfig } from '@shared/languages';
import { checkWriting, type WritingTaskDef } from '@shared/writing';

import { Button, Card, Text, TextField, spacing } from '@/design-system';
import { useStrings } from '@/i18n';

import { writingStrings } from '../strings';

/**
 * Tarea de escritura sin IA (cierre de inglés A1, docs/A1_EN_CLOSURE.md §6). El texto queda en el
 * dispositivo: no se envía, no se guarda y no genera evidencia ni progreso.
 *
 * - Guiada: muestra qué requisitos observables se cumplen («Decís tu nombre con My name is…») y la
 *   da por completa cuando están todos. Nunca dice que el texto es correcto.
 * - Libre: no hay veredicto. Al terminar se muestran el texto modelo y la lista de control para que
 *   el alumno se autoevalúe; las pistas son sólo eso.
 */
export function WritingTask({ task }: { task: WritingTaskDef }) {
  const t = useStrings(writingStrings);
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [marks, setMarks] = useState<boolean[]>(() => task.checklist.map(() => false));
  const result = useMemo(() => checkWriting(task, text), [task, text]);

  return (
    <View style={styles.gap}>
      <View style={styles.gap}>
        <Text variant="overline">{task.kind === 'guided' ? t.guided : t.free}</Text>
        <Text variant="title">{task.title}</Text>
        <Text>{task.instructions}</Text>
        <Text variant="caption">{t.privacy}</Text>
      </View>
      {task.glossary?.length ? (
        <Card style={styles.gap}>
          {task.glossary.map((g) => (
            <Text key={g.term}>
              <Text variant="bodyStrong">{g.term}</Text> = {g.meaning}
            </Text>
          ))}
        </Card>
      ) : null}
      {task.prompts.length ? (
        <Card style={styles.gap}>
          {task.prompts.map((p) => (
            <Text key={p} variant="bodyStrong">
              {p}
            </Text>
          ))}
        </Card>
      ) : null}
      <TextField
        label={t.yourText(languageConfig(task.language))}
        value={text}
        onChangeText={(v) => {
          setText(v);
          setChecked(false);
        }}
        maxLength={task.maxChars}
        multiline
        autoCapitalize="sentences"
        autoCorrect={false}
        spellCheck={false}
        placeholder={t.placeholder}
        style={styles.area}
      />
      <Button
        label={task.kind === 'guided' ? t.checkGuided : t.checkFree}
        disabled={result.empty}
        onPress={() => setChecked(true)}
      />
      {checked ? (
        <View style={styles.gap} accessibilityLiveRegion="polite">
          <Card style={styles.gap}>
            <Text variant="overline">
              {task.kind === 'guided' ? t.requirementsGuided : t.requirementsFree}
            </Text>
            {result.requirements.map((r) => (
              <Text key={r.id} color={r.met ? 'text' : 'textMuted'}>
                {r.met ? '✓' : '○'} {r.label}
              </Text>
            ))}
            {task.kind === 'guided' ? (
              <Text variant="bodyStrong">{result.complete ? t.complete : t.incomplete}</Text>
            ) : null}
            <Text variant="caption">{t.disclaimer}</Text>
          </Card>
          <Card style={styles.gap}>
            <Text variant="overline">{t.modelOverline}</Text>
            <Text>{task.model}</Text>
            {task.modelReading ? <Text variant="caption">{task.modelReading}</Text> : null}
            <Text variant="caption">{t.modelNote}</Text>
          </Card>
          <Card style={styles.gap}>
            <Text variant="overline">{t.selfCheck}</Text>
            {task.checklist.map((c, i) => (
              <Button
                key={c}
                variant="secondary"
                label={`${marks[i] ? '☑' : '☐'} ${c}`}
                onPress={() => setMarks((m) => m.map((x, j) => (j === i ? !x : x)))}
              />
            ))}
          </Card>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  area: { minHeight: 140, textAlignVertical: 'top' },
});
