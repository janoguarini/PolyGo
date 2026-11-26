import { useEffect, useState } from 'react';

import type { ShareAchievement } from '@shared/share';

import { useStrings } from '@/i18n';
import { deviceStorage } from '@/lib/secureStorage';

import { ShareAchievementModal, canShareImages } from './ShareAchievement';
import { shareStrings } from './strings';

const seenKey = (language: string, level: string) => `polygo.share.levelSeen.${language}.${level}`;

/**
 * Festejo de nivel completo (A1 → A2) con la tarjeta para compartir. Va en el inicio: cuando el
 * último nivel que terminaste entero todavía no se festejó en este teléfono, aparece una vez.
 * `level` = el nivel más alto terminado del curso (null si ninguno).
 */
export function LevelCompleteShare({
  language,
  level,
}: {
  language: string;
  level: string | null;
}) {
  const t = useStrings(shareStrings);
  const [open, setOpen] = useState<ShareAchievement | null>(null);

  useEffect(() => {
    if (!level || !canShareImages) return;
    let alive = true;
    const key = seenKey(language, level);
    void (async () => {
      try {
        if (await deviceStorage.getItem(key)) return;
        await deviceStorage.setItem(key, '1');
      } catch {
        // Sin almacenamiento no se festeja: mejor eso que repetirlo en cada apertura.
        return;
      }
      if (alive) setOpen({ kind: 'level', level, language });
    })();
    return () => {
      alive = false;
    };
  }, [language, level]);

  return (
    <ShareAchievementModal
      achievement={open}
      title={open?.kind === 'level' ? t.levelDoneTitle(open.level) : undefined}
      onClose={() => setOpen(null)}
    />
  );
}
