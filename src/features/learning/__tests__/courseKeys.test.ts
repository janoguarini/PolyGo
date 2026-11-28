import { courseByCode } from '@shared/courses';

import { fetchCurriculum, fetchWordPool } from '../api';
import { curriculumQuery, learningKeys, wordPoolQuery } from '../hooks';

jest.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ session: null }) }));
jest.mock('@/features/profile/hooks', () => ({ useMyProfile: () => ({ data: undefined }) }));
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  fetchCurriculum: jest.fn(async () => ({ units: [] })),
  fetchWordPool: jest.fn(async () => []),
}));

const fromEs = courseByCode('en-from-es')!;
const fromPt = courseByCode('en-from-pt')!;

describe('caché por curso (learningKeys)', () => {
  it('el camino de dos cursos de inglés va en claves distintas, pero se pide por idioma', async () => {
    const a = curriculumQuery(fromEs);
    const b = curriculumQuery(fromPt);
    expect(a.queryKey).toEqual(['learning', 'curriculum', 'en-from-es']);
    expect(b.queryKey).toEqual(['learning', 'curriculum', 'en-from-pt']);
    await b.queryFn();
    expect(fetchCurriculum).toHaveBeenCalledWith('en');
  });

  it('banco de palabras, palabras, palabra del día y dominio: por curso', async () => {
    expect(wordPoolQuery('en', 'en-from-pt').queryKey).not.toEqual(
      wordPoolQuery('en', 'en-from-es').queryKey,
    );
    await wordPoolQuery('en', 'en-from-pt').queryFn();
    expect(fetchWordPool).toHaveBeenCalledWith('en');
    expect(learningKeys.words('u', 'en-from-pt')).not.toEqual(
      learningKeys.words('u', 'en-from-es'),
    );
    expect(learningKeys.wordOfDay('2026-11-27', 'en-from-pt')).not.toEqual(
      learningKeys.wordOfDay('2026-11-27', 'en-from-es'),
    );
    expect(learningKeys.mastery('u', 'en-from-pt')).not.toEqual(
      learningKeys.mastery('u', 'en-from-es'),
    );
    // Todo sigue bajo ['learning']: cambiar de curso lo invalida junto (useSwitchStudy).
    expect(learningKeys.pool('en-from-pt')[0]).toBe('learning');
  });
});
