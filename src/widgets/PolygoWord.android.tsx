import { Column, Spacer, Text } from '@expo/ui/jetpack-compose';
import { background, fillMaxSize, height, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

import type { WordCardProps } from '@/features/widgets/content';

/**
 * Widget "Palabra" (Android, Glance). Mismas reglas que la versión iOS; Android sólo admite un
 * subconjunto de componentes y modificadores (ver docs/WIDGETS.md) y no tiene timeline.
 */
const PolygoWord = (props: WordCardProps) => {
  'widget';
  const title = props.emoji ? `${props.emoji} ${props.text}` : props.text;
  return (
    <Column modifiers={[fillMaxSize(), background('#17142F'), paddingAll(14)]}>
      <Text color="#A78BFA" style={{ fontSize: 11, fontWeight: 'bold' }}>
        {props.label}
      </Text>
      <Spacer modifiers={[height(6)]} />
      <Text color="#FFFFFF" maxLines={1} style={{ fontSize: 26, fontWeight: '800' }}>
        {title}
      </Text>
      {props.ipa ? (
        <Text color="#8D88B5" maxLines={1} style={{ fontSize: 12 }}>
          {props.ipa}
        </Text>
      ) : null}
      <Text color="#E7E5F7" maxLines={2} style={{ fontSize: 16, fontWeight: '600' }}>
        {props.translation}
      </Text>
      {props.example ? (
        <Text color="#8D88B5" maxLines={2} style={{ fontSize: 12 }}>
          {`“${props.example}”`}
        </Text>
      ) : null}
    </Column>
  );
};

export default createWidget('PolygoWord', PolygoWord, {
  kind: 'new',
  label: 'POLYGO',
  text: 'Abrí Polygo',
  translation: 'para cargar tus palabras',
  ipa: '',
  emoji: '',
  example: '',
  url: 'polygo://vocabulary',
});
