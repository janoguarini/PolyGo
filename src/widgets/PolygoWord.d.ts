// Tipos de la importación "@/widgets/PolygoWord": Metro resuelve PolygoWord.ios.tsx o
// PolygoWord.android.tsx según la plataforma; TypeScript no conoce esos sufijos.
import type { Widget } from 'expo-widgets';

import type { WordCardProps } from '@/features/widgets/content';

declare const PolygoWord: Widget<WordCardProps>;
export default PolygoWord;
