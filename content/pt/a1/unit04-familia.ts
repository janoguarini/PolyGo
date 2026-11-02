import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('pt'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit04: UnitDef = {
  position: 4,
  title: 'La familia',
  titleEn: 'A família',
  description: 'Nombrar a tu familia, decir cuántos hermanos tenés y cómo se llaman.',
  emoji: '👨‍👩‍👧',
  objective:
    'Podés presentar a tu familia, decir cuántos hermanos tenés y cómo se llaman tus familiares.',
  grammar: {
    title: 'Meu / minha',
    explanation:
      'Meu va con palabras masculinas y minha con femeninas: meu pai, minha mãe. En Brasil suele ir con artículo: o meu irmão, a minha irmã (las dos formas son correctas).',
    examples: [
      { target: 'Minha mãe se chama Laura.', base: 'Mi mamá se llama Laura.' },
      { target: 'Meu irmão tem dez anos.', base: 'Mi hermano tiene diez años.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w(
      'pt-familia',
      'família',
      'familia',
      'Minha família é pequena.',
      'Mi familia es chica.',
      ['family'],
      { emoji: '👨‍👩‍👧' },
    ),
    w('pt-mae', 'mãe', 'madre', 'Minha mãe é brasileira.', 'Mi madre es brasileña.', ['family'], {
      acceptedTranslations: ['mamá'],
    }),
    w('pt-pai', 'pai', 'padre', 'Meu pai é argentino.', 'Mi padre es argentino.', ['family'], {
      acceptedTranslations: ['papá'],
    }),
    w(
      'pt-pais',
      'pais',
      'padres (mamá y papá)',
      'Meus pais são de Recife.',
      'Mis padres son de Recife.',
      ['family'],
      {
        acceptedTranslations: ['padres'],
      },
    ),
    w('pt-irmao', 'irmão', 'hermano', 'Tenho um irmão.', 'Tengo un hermano.', ['family']),
    w(
      'pt-irma',
      'irmã',
      'hermana',
      'Minha irmã tem quinze anos.',
      'Mi hermana tiene quince años.',
      ['family'],
    ),
    w(
      'pt-avo-m',
      'avô',
      'abuelo',
      'Meu avô tem oitenta anos.',
      'Mi abuelo tiene ochenta años.',
      ['family'],
      { emoji: '👴' },
    ),
    w(
      'pt-avo-f',
      'avó',
      'abuela',
      'Minha avó é de Salvador.',
      'Mi abuela es de Salvador.',
      ['family'],
      { emoji: '👵' },
    ),
    w('pt-filho', 'filho', 'hijo', 'Tenho um filho.', 'Tengo un hijo.', ['family']),
    w('pt-filha', 'filha', 'hija', 'Ela é minha filha.', 'Ella es mi hija.', ['family']),
    w(
      'pt-meu',
      'meu',
      'mi (masculino)',
      'Meu irmão é alto.',
      'Mi hermano es alto.',
      ['possessives'],
      {
        acceptedTranslations: ['mi'],
      },
    ),
    w(
      'pt-minha',
      'minha',
      'mi (femenino)',
      'Minha irmã é estudante.',
      'Mi hermana es estudiante.',
      ['possessives'],
      {
        acceptedTranslations: ['mi'],
      },
    ),
    w(
      'pt-se-chama',
      'se chama',
      'se llama',
      'Minha mãe se chama Laura.',
      'Mi madre se llama Laura.',
      ['introductions'],
    ),
    w('pt-uma', 'uma', 'una', 'Tenho uma irmã.', 'Tengo una hermana.', ['articles']),
    w(
      'pt-filho-unico',
      'filho único',
      'hijo único',
      'Sou filho único.',
      'Soy hijo único.',
      ['family'],
      {
        acceptedTexts: ['filha única'],
      },
    ),
  ],
  lessons: [
    {
      title: 'Mãe e pai',
      objective: 'Nombrar a tu familia cercana.',
      intro: {
        explanation:
          'Mãe y pai son madre y padre; pais (con s) son los dos. Ojo: pais suena distinto de país (país lleva tilde y es «país»).',
        examples: [
          { target: 'Minha família é pequena.', base: 'Mi familia es chica.' },
          { target: 'Meus pais são de Recife.', base: 'Mis padres son de Recife.' },
        ],
      },
      takeaways: [
        'Nombrás a tu madre, tu padre y tus padres.',
        'Distinguís pais (padres) de país.',
      ],
      exercises: [
        ex.translationChoice('mãe', 'madre', ['padre', 'hermana', 'abuela'], ['pt-mae']),
        ex.translationChoice(
          'pais',
          'padres (mamá y papá)',
          ['país', 'hermanos', 'abuelos'],
          ['pt-pais'],
          {
            explanation: 'Pais son el padre y la madre. País, con tilde, es un país.',
          },
        ),
        ex.listenChoice(
          'minha mãe',
          ['meu pai', 'minha irmã', 'minha avó'],
          ['pt-mae', 'pt-minha'],
        ),
        ex.fillBlank(
          'Meus ___ são de Recife.',
          'Mis padres son de Recife.',
          'pais',
          ['pai', 'mãe', 'país'],
          ['pt-pais'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['mãe', 'madre'],
            ['pai', 'padre'],
            ['pais', 'padres'],
            ['meu', 'mi (masculino)'],
          ],
          ['pt-mae', 'pt-pai', 'pt-pais', 'pt-meu'],
        ),
        ex.orderWords('Meu pai é argentino.', 'Mi padre es argentino.', ['pt-meu', 'pt-pai']),
        ex.translateWrite('Mi madre', 'minha mãe', ['pt-minha', 'pt-mae'], {
          acceptedAnswers: ['a minha mãe'],
        }),
        ex.translateWrite('Mi padre', 'meu pai', ['pt-meu', 'pt-pai'], {
          acceptedAnswers: ['o meu pai'],
        }),
      ],
    },
    {
      title: 'Irmãos',
      objective: 'Hablar de tus hermanos.',
      intro: {
        explanation:
          'Irmão es hermano e irmã, hermana (las dos con ~). Con tenho decís cuántos tenés: tenho um irmão, tenho duas irmãs. Si no tenés: sou filho único (o filha única).',
        examples: [
          { target: 'Tenho um irmão e uma irmã.', base: 'Tengo un hermano y una hermana.' },
          { target: 'Sou filha única.', base: 'Soy hija única.' },
        ],
      },
      takeaways: [
        'Decís cuántos hermanos tenés con tenho.',
        'Decís que sos hijo único con filho único.',
      ],
      exercises: [
        ex.translationChoice('irmão', 'hermano', ['hermana', 'padre', 'abuelo'], ['pt-irmao']),
        ex.translationChoice('irmã', 'hermana', ['hermano', 'madre', 'hija'], ['pt-irma']),
        ex.listenChoice('irmã', ['irmão', 'avó', 'filha'], ['pt-irma']),
        ex.fillBlank(
          'Tenho ___ irmã.',
          'Tengo una hermana.',
          'uma',
          ['um', 'dois', 'meu'],
          ['pt-uma', 'pt-irma'],
          {
            skill: 'grammar',
            explanation: 'Irmã es femenina: uma irmã. Con irmão es um: um irmão.',
          },
        ),
        ex.fillBlank(
          'Tenho ___ irmãs.',
          'Tengo dos hermanas.',
          'duas',
          ['dois', 'uma', 'três'],
          ['pt-irma', 'pt-dois'],
          {
            skill: 'grammar',
            explanation: 'Con palabras femeninas, dos es duas: duas irmãs.',
          },
        ),
        ex.orderWords('Sou filho único.', 'Soy hijo único.', ['pt-filho-unico']),
        ex.translateWrite('Tengo un hermano.', 'Tenho um irmão.', ['pt-irmao', 'pt-um'], {
          acceptedAnswers: ['Eu tenho um irmão.'],
        }),
        ex.translateWrite('Tengo dos hermanas.', 'Tenho duas irmãs.', ['pt-irma'], {
          acceptedAnswers: ['Eu tenho duas irmãs.'],
          explanation: 'Duas porque irmãs es femenino; el plural de irmã es irmãs.',
        }),
      ],
    },
    {
      title: 'Avós e filhos',
      objective: 'Hablar de abuelos e hijos.',
      intro: {
        explanation:
          'Avô (abuelo, «o» cerrada) y avó (abuela, «o» abierta) sólo se distinguen por la tilde y el sonido. Filho y filha son hijo e hija: lh suena parecido a «ll».',
        examples: [
          { target: 'Minha avó é de Salvador.', base: 'Mi abuela es de Salvador.' },
          { target: 'Ela é minha filha.', base: 'Ella es mi hija.' },
        ],
      },
      takeaways: ['Distinguís avô y avó.', 'Nombrás a tus hijos con filho y filha.'],
      exercises: [
        ex.imageChoice('👵', 'avó', ['avô', 'mãe', 'filha'], ['pt-avo-f'], {
          explanation:
            'Avó, con tilde aguda y «o» abierta, es la abuela. Avô, con ^, es el abuelo.',
        }),
        ex.imageChoice('👴', 'avô', ['avó', 'pai', 'filho'], ['pt-avo-m']),
        ex.translationChoice('filha', 'hija', ['hijo', 'hermana', 'abuela'], ['pt-filha']),
        ex.listenChoice('filho', ['filha', 'irmão', 'avô'], ['pt-filho']),
        ex.matchPairs(
          [
            ['avô', 'abuelo'],
            ['avó', 'abuela'],
            ['filho', 'hijo'],
            ['filha', 'hija'],
          ],
          ['pt-avo-m', 'pt-avo-f', 'pt-filho', 'pt-filha'],
        ),
        ex.fillBlank(
          'Ela é minha ___.',
          'Ella es mi hija.',
          'filha',
          ['filho', 'avô', 'irmão'],
          ['pt-filha', 'pt-minha'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Mi abuela', 'minha avó', ['pt-minha', 'pt-avo-f'], {
          acceptedAnswers: ['a minha avó'],
          explanation: 'La abuela es avó (´). Avô (^) es el abuelo.',
        }),
        ex.translateWrite('Tengo un hijo.', 'Tenho um filho.', ['pt-filho', 'pt-um'], {
          acceptedAnswers: ['Eu tenho um filho.'],
        }),
      ],
    },
    {
      title: 'Meu, minha',
      objective: 'Usar meu y minha con tu familia.',
      intro: {
        explanation:
          'Meu va con palabras masculinas (meu pai, meu irmão) y minha con femeninas (minha mãe, minha irmã). En Brasil también se dice con artículo: o meu irmão.',
        examples: [
          { target: 'Meu irmão tem dez anos.', base: 'Mi hermano tiene diez años.' },
          { target: 'Minha irmã é estudante.', base: 'Mi hermana es estudiante.' },
        ],
      },
      takeaways: [
        'Elegís meu o minha según la palabra.',
        'Presentás a tus familiares con su edad.',
      ],
      exercises: [
        ex.translationChoice(
          'minha',
          'mi (femenino)',
          ['mi (masculino)', 'una', 'yo'],
          ['pt-minha'],
        ),
        ex.fillBlank(
          '___ irmão tem dez anos.',
          'Mi hermano tiene diez años.',
          'Meu',
          ['Minha', 'Uma', 'Eu'],
          ['pt-meu', 'pt-irmao'],
          {
            explanation: 'Irmão es masculino: meu irmão.',
          },
        ),
        ex.fillBlank(
          '___ mãe é brasileira.',
          'Mi madre es brasileña.',
          'Minha',
          ['Meu', 'Um', 'Ela'],
          ['pt-minha', 'pt-mae'],
          { skill: 'grammar' },
        ),
        ex.listenChoice(
          'meu irmão',
          ['minha irmã', 'meu pai', 'minha mãe'],
          ['pt-meu', 'pt-irmao'],
        ),
        ex.orderWords('Minha irmã é estudante.', 'Mi hermana es estudiante.', [
          'pt-minha',
          'pt-irma',
          'pt-estudante',
        ]),
        ex.matchPairs(
          [
            ['meu pai', 'mi padre'],
            ['minha mãe', 'mi madre'],
            ['meu irmão', 'mi hermano'],
            ['minha irmã', 'mi hermana'],
          ],
          ['pt-meu', 'pt-minha', 'pt-pai', 'pt-mae'],
        ),
        ex.translateWrite(
          'Mi hermana tiene quince años.',
          'Minha irmã tem quinze anos.',
          ['pt-minha', 'pt-irma', 'pt-tem', 'pt-quinze'],
          {
            acceptedAnswers: ['A minha irmã tem quinze anos.'],
          },
        ),
        ex.translateWrite('Mi padre es argentino.', 'Meu pai é argentino.', ['pt-meu', 'pt-pai'], {
          acceptedAnswers: ['O meu pai é argentino.'],
        }),
      ],
    },
    {
      title: 'Ela se chama…',
      objective: 'Decir cómo se llaman tus familiares.',
      intro: {
        explanation:
          'Para decir cómo se llama otra persona: se chama + nombre. Para preguntar: como se chama o seu irmão?',
        examples: [
          { target: 'Minha mãe se chama Laura.', base: 'Mi madre se llama Laura.' },
          { target: 'Como se chama o seu irmão?', base: '¿Cómo se llama tu hermano?' },
        ],
      },
      takeaways: [
        'Decís cómo se llama alguien con se chama.',
        'Presentás a tu familia con nombre y edad.',
      ],
      exercises: [
        ex.translationChoice(
          'se chama',
          'se llama',
          ['mi nombre es', '¿cómo te llamás?', 'tiene'],
          ['pt-se-chama'],
        ),
        ex.fillBlank(
          'Minha mãe ___ Laura.',
          'Mi madre se llama Laura.',
          'se chama',
          ['me chamo', 'tem', 'sou'],
          ['pt-se-chama', 'pt-mae'],
          {
            explanation: 'Para otra persona: se chama. Me chamo es sólo para vos mismo.',
          },
        ),
        ex.listenChoice(
          'se chama Laura',
          ['meu nome é Laura', 'tem vinte anos', 'sou de Recife'],
          ['pt-se-chama'],
        ),
        ex.orderWords('Meu avô se chama Pedro.', 'Mi abuelo se llama Pedro.', [
          'pt-meu',
          'pt-avo-m',
          'pt-se-chama',
        ]),
        ex.matchPairs(
          [
            ['meu nome é', 'mi nombre es'],
            ['se chama', 'se llama'],
            ['família', 'familia'],
            ['filho único', 'hijo único'],
          ],
          ['pt-meu-nome-e', 'pt-se-chama', 'pt-familia', 'pt-filho-unico'],
        ),
        ex.shortAnswer(
          'Como se chama a sua mãe?',
          '¿Cómo se llama tu madre? (Respondé que se llama Ana.)',
          'Minha mãe se chama Ana.',
          ['Ela se chama Ana.', 'Se chama Ana.', 'A minha mãe se chama Ana.', 'Ana.'],
          ['pt-se-chama', 'pt-mae', 'pt-minha'],
        ),
        ex.translateWrite(
          'Mi hermano se llama Lucas.',
          'Meu irmão se chama Lucas.',
          ['pt-meu', 'pt-irmao', 'pt-se-chama'],
          {
            acceptedAnswers: ['O meu irmão se chama Lucas.'],
          },
        ),
        ex.translateWrite('Soy hija única.', 'Sou filha única.', ['pt-filho-unico'], {
          explanation: 'En femenino: filha única.',
        }),
      ],
    },
  ],
};
