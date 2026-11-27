import { render, screen } from '@testing-library/react-native';

import { languageConfig } from '@shared/languages';
import { MAX_WRITTEN_ANSWER_LENGTH } from '@shared/protocol';

import { SessionLanguageContext } from '@/features/learning/readings';
import { __setInterfaceLanguageForTests } from '@/i18n';

import { QuestionCard } from '../components/QuestionCard';

jest.mock('@/features/learning/speech', () => ({ speak: jest.fn(), stopSpeaking: jest.fn() }));

describe('QuestionCard: preguntas para escribir', () => {
  it('el campo tiene el mismo tope que valida el servidor (80)', async () => {
    await render(
      <QuestionCard
        question={{
          index: 2,
          direction: 'es_en',
          prompt: 'agua',
          options: [],
          kind: 'write',
          sentAt: 0,
        }}
        feedback={null}
        streak={0}
        disabled={false}
        onAnswer={jest.fn()}
      />,
    );
    expect(MAX_WRITTEN_ANSWER_LENGTH).toBe(80);
    expect(screen.getByLabelText('Tu respuesta').props.maxLength).toBe(80);
  });
});

describe('QuestionCard: consigna de la traducción según el idioma de apoyo del curso', () => {
  const question = {
    index: 0,
    direction: 'en_es' as const,
    prompt: 'la madre',
    options: ['the mother', 'the father', 'the sister', 'the brother'],
    kind: 'text' as const,
    sentAt: 0,
  };
  const inLanguage = (code: string) => (
    <SessionLanguageContext.Provider
      value={{
        language: languageConfig(code),
        readings: null,
        showReadings: false,
        setShowReadings: () => {},
      }}
    >
      <QuestionCard
        question={question}
        feedback={null}
        streak={0}
        disabled={false}
        onAnswer={jest.fn()}
      />
    </SessionLanguageContext.Provider>
  );

  it('español (desde inglés): la traducción es al inglés', async () => {
    await render(inLanguage('es'));
    expect(screen.getByText('ELIGE LA TRADUCCIÓN AL INGLÉS')).toBeTruthy();
  });

  it('francés (desde español): la traducción es al español', async () => {
    await render(inLanguage('fr'));
    expect(screen.getByText('ELIGE LA TRADUCCIÓN AL ESPAÑOL')).toBeTruthy();
  });

  it('en inglés: CHOOSE THE ENGLISH TRANSLATION en el curso de español', async () => {
    __setInterfaceLanguageForTests('en');
    try {
      await render(inLanguage('es'));
      expect(screen.getByText('CHOOSE THE ENGLISH TRANSLATION')).toBeTruthy();
    } finally {
      __setInterfaceLanguageForTests('es');
    }
  });
});
