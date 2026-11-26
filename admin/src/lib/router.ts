import { useEffect, useState } from 'react';

// Router por hash (#/ranked, #/users/<uuid>): no necesita configuración del servidor.

export type SectionId =
  | 'overview'
  | 'users'
  | 'growth'
  | 'learning'
  | 'ranked'
  | 'retention'
  | 'social'
  | 'monetization'
  | 'marketing'
  | 'notifications'
  | 'health'
  | 'content'
  | 'admin';

export const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'users', label: 'Usuarios', icon: '◉' },
  { id: 'growth', label: 'Crecimiento', icon: '↗' },
  { id: 'learning', label: 'Aprendizaje', icon: '✎' },
  { id: 'ranked', label: 'Ranked', icon: '⚔' },
  { id: 'retention', label: 'Retención', icon: '↻' },
  { id: 'social', label: 'Social', icon: '☍' },
  { id: 'monetization', label: 'Monetización', icon: '$' },
  { id: 'marketing', label: 'Marketing', icon: '✦' },
  { id: 'notifications', label: 'Notificaciones', icon: '◔' },
  { id: 'health', label: 'Salud técnica', icon: '♥' },
  { id: 'content', label: 'Contenido', icon: '▤' },
  { id: 'admin', label: 'Administración', icon: '⚙' },
];

export interface Route {
  section: SectionId;
  param: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const section = SECTIONS.find((s) => s.id === parts[0])?.id ?? 'overview';
  const param = section === 'users' && parts[1] && UUID.test(parts[1]) ? parts[1].toLowerCase() : null;
  return { section, param };
}

export function navigate(section: SectionId, param?: string): void {
  window.location.hash = param ? `#/${section}/${param}` : `#/${section}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
