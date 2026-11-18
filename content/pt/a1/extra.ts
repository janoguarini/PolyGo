import type { PtUnitDef } from '../../pt-course';
import { PT_A1_U13 } from './unit13-profissoes';
import { PT_A1_U14 } from './unit14-como-esta';
import { PT_A1_U15 } from './unit15-datas-tempo';
import { PT_A1_U16 } from './unit16-transporte-lazer';

/**
 * PT-BR A1 U13–U16 (docs/PT_A1_A2.md): completan el A1 piloto (U1–U12, ya publicado y sin cambios).
 * Viven fuera de COURSES (content/pt-course.ts).
 */
export const PT_A1_EXTRA_UNITS: readonly PtUnitDef[] = [PT_A1_U13, PT_A1_U14, PT_A1_U15, PT_A1_U16];
