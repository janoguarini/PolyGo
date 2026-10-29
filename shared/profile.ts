import { z } from 'zod';

/** Reglas de perfil compartidas entre formularios y backend (el SQL replica estas reglas). */

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_REGEX, 'Usá de 3 a 20 caracteres: letras minúsculas, números o "_".');

export const DAILY_GOALS = [5, 10, 15, 20] as const;
export type DailyGoalMinutes = (typeof DAILY_GOALS)[number];

export const TARGET_LANGUAGES = [
  { code: 'en', name: 'Inglés', available: true },
  { code: 'pt', name: 'Portugués', available: false },
  { code: 'fr', name: 'Francés', available: false },
  { code: 'it', name: 'Italiano', available: false },
] as const;

export type TargetLanguageCode = (typeof TARGET_LANGUAGES)[number]['code'];

/** Niveles iniciales seleccionables. El MVP sólo tiene contenido A1. */
export const START_LEVELS = [
  {
    id: 'A1',
    title: 'Desde cero',
    description: 'Nunca estudié inglés o recuerdo muy poco.',
    available: true,
  },
  {
    id: 'A2',
    title: 'Sé lo básico',
    description: 'Contenido A2 próximamente. Empezás por A1 con repaso rápido.',
    available: false,
  },
] as const;

/** Avatares predefinidos: id estable → icono + color. Se guardan por id en la base de datos. */
export const AVATARS = [
  { id: 'bolt', icon: 'zap', color: '#8B5CF6' },
  { id: 'flame', icon: 'flame', color: '#F43F5E' },
  { id: 'crown', icon: 'crown', color: '#F5C542' },
  { id: 'rocket', icon: 'rocket', color: '#22D3EE' },
  { id: 'brain', icon: 'brain', color: '#34D399' },
  { id: 'ghost', icon: 'ghost', color: '#A78BFA' },
  { id: 'sword', icon: 'swords', color: '#60A5FA' },
  { id: 'star', icon: 'star', color: '#FB923C' },
] as const;

export type AvatarId = (typeof AVATARS)[number]['id'];
export const AVATAR_IDS = AVATARS.map((a) => a.id) as [AvatarId, ...AvatarId[]];
export const DEFAULT_AVATAR: AvatarId = 'bolt';
