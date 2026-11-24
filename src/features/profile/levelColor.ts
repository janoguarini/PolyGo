import { colors } from '@/design-system';

/** Color del distintivo de cada nivel MCER (Perfil y «Tus cursos»). */
export function levelColor(level: string): string {
  if (level.startsWith('A1')) return colors.primary;
  if (level.startsWith('A2')) return colors.goldStrong;
  if (level.startsWith('B1')) return colors.infoAlt;
  if (level.startsWith('B2')) return colors.successStrong;
  return colors.streak;
}
