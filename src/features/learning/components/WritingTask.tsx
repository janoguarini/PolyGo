import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { languageConfig } from '@shared/languages';
import { checkWriting, type WritingTaskDef } from '@shared/writing';

import { Button, Card, Text, TextField, spacing } from '@/design-system';

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
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [marks, setMarks] = useState<boolean[]>(() => task.checklist.map(() => false));
  const result = useMemo(() => checkWriting(task, text), [task, text]);

  return (
    <View style={styles.gap}>
      <View style={styles.gap}>
        <Text variant="overline">
          {task.kind === 'guided' ? 'ESCRITURA GUIADA' : 'ESCRITURA LIBRE'}
        </Text>
        <Text variant="title">{task.title}</Text>
        <Text>{task.instructions}</Text>
        <Text variant="caption">
          Podés inventar los datos. Tu texto no se envía ni se guarda: queda en tu teléfono.
        </Text>
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
        label={`Tu texto ${languageConfig(task.language).inName}`}
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
        placeholder="Escribí acá…"
        style={styles.area}
      />
      <Button
        label={task.kind === 'guided' ? 'Revisar mi texto' : 'Terminé: comparar'}
        disabled={result.empty}
        onPress={() => setChecked(true)}
      />
      {checked ? (
        <View style={styles.gap} accessibilityLiveRegion="polite">
          <Card style={styles.gap}>
            <Text variant="overline">
              {task.kind === 'guided' ? 'LO QUE PEDÍA LA CONSIGNA' : 'PISTAS'}
            </Text>
            {result.requirements.map((r) => (
              <Text key={r.id} color={r.met ? 'text' : 'textMuted'}>
                {r.met ? '✓' : '○'} {r.label}
              </Text>
            ))}
            {task.kind === 'guided' ? (
              <Text variant="bodyStrong">
                {result.complete
                  ? 'Tu texto tiene todo lo que pedía la consigna.'
                  : 'Te falta algo de la consigna: revisá los puntos sin marcar.'}
              </Text>
            ) : null}
            <Text variant="caption">
              Esta revisión sólo busca lo que pide la consigna; no corrige la gramática ni dice si
              el texto está bien escrito.
            </Text>
          </Card>
          <Card style={styles.gap}>
            <Text variant="overline">UN EJEMPLO PARA COMPARAR</Text>
            <Text>{task.model}</Text>
            {task.modelReading ? <Text variant="caption">{task.modelReading}</Text> : null}
            <Text variant="caption">Es un ejemplo, no la única respuesta posible.</Text>
          </Card>
          <Card style={styles.gap}>
            <Text variant="overline">REVISÁ VOS</Text>
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
