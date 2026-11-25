import { StyleSheet } from 'react-native';

/**
 * Identidad visual de Ranked Arcade: siempre oscura (también con el tema claro de la app), violeta
 * PolyGo y amarillo para los momentos especiales (combo alto, Frenesí). Contraste AA para todo texto
 * sobre `bg` y `card`.
 */
export const arcade = {
  bg: '#0B0618',
  bgDeep: '#06030F',
  card: '#1A1033',
  cardRaised: '#251646',
  border: '#3A2468',
  violet: '#7B2EFF',
  violetGlow: '#A66BFF',
  gold: '#FFC83D',
  goldDeep: '#E09A00',
  success: '#2EE59D',
  danger: '#FF4D6D',
  text: '#FFFFFF',
  muted: '#B9A9E0',
  rival: '#FF7A45',
} as const;

export const arcadeRadii = { card: 20, block: 14, pill: 999 } as const;

/** Lo mínimo para un toque cómodo con el pulgar (más que MIN_TOUCH: se juega rápido). */
export const ARCADE_TOUCH = 52;

export const arcadeText = StyleSheet.create({
  // lineHeight explícito: TargetText usa el Text del design system, que si no deja la de cuerpo (22) y
  // recorta arriba y abajo las letras grandes.
  title: {
    color: arcade.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  word: {
    color: arcade.text,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    textAlign: 'center',
  },
  option: {
    color: arcade.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    color: arcade.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  body: { color: arcade.text, fontSize: 16, lineHeight: 22, fontWeight: '600' },
});
