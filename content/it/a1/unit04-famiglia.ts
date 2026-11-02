import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('it'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit04: UnitDef = {
  position: 4,
  title: 'La familia',
  titleEn: 'La famiglia',
  description: 'Nombrar a tu familia, decir cuántos hermanos tenés y cómo se llaman.',
  emoji: '👨‍👩‍👧',
  objective:
    'Podés presentar a tu familia, decir cuántos hermanos tenés y cómo se llaman tus familiares.',
  grammar: {
    title: 'Mio, mia y el artículo',
    explanation:
      'Mio va con palabras masculinas y mia con femeninas. Con un familiar en singular no se pone artículo (mia madre), pero sí en plural (i miei genitori) y con la mayoría de las demás palabras (il mio amico).',
    examples: [
      { target: 'Mia madre si chiama Laura.', base: 'Mi mamá se llama Laura.' },
      { target: 'Mio fratello ha dieci anni.', base: 'Mi hermano tiene diez años.' },
      { target: 'I miei genitori sono di Roma.', base: 'Mis padres son de Roma.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w(
      'it-famiglia',
      'famiglia',
      'familia',
      'La mia famiglia è piccola.',
      'Mi familia es chica.',
      ['family'],
      { emoji: '👨‍👩‍👧' },
    ),
    w('it-madre', 'madre', 'madre', 'Mia madre è italiana.', 'Mi madre es italiana.', ['family'], {
      acceptedTranslations: ['mamá'],
    }),
    w(
      'it-padre',
      'padre',
      'padre',
      'Mio padre è argentino.',
      'Mi padre es argentino.',
      ['family'],
      {
        acceptedTranslations: ['papá'],
      },
    ),
    w(
      'it-genitori',
      'genitori',
      'padres (mamá y papá)',
      'I miei genitori sono di Roma.',
      'Mis padres son de Roma.',
      ['family'],
      {
        acceptedTranslations: ['padres'],
      },
    ),
    w('it-fratello', 'fratello', 'hermano', 'Ho un fratello.', 'Tengo un hermano.', ['family']),
    w(
      'it-sorella',
      'sorella',
      'hermana',
      'Mia sorella ha quindici anni.',
      'Mi hermana tiene quince años.',
      ['family'],
    ),
    w(
      'it-nonno',
      'nonno',
      'abuelo',
      'Mio nonno ha ottanta anni.',
      'Mi abuelo tiene ochenta años.',
      ['family'],
      { emoji: '👴' },
    ),
    w(
      'it-nonna',
      'nonna',
      'abuela',
      'Mia nonna è di Napoli.',
      'Mi abuela es de Nápoles.',
      ['family'],
      { emoji: '👵' },
    ),
    w('it-figlio', 'figlio', 'hijo', 'Ho un figlio.', 'Tengo un hijo.', ['family']),
    w('it-figlia', 'figlia', 'hija', 'Lei è mia figlia.', 'Ella es mi hija.', ['family']),
    w(
      'it-mio',
      'mio',
      'mi (masculino)',
      'Mio fratello è alto.',
      'Mi hermano es alto.',
      ['possessives'],
      {
        acceptedTranslations: ['mi'],
      },
    ),
    w(
      'it-mia',
      'mia',
      'mi (femenino)',
      'Mia sorella è qui.',
      'Mi hermana está acá.',
      ['possessives'],
      {
        acceptedTranslations: ['mi'],
      },
    ),
    w(
      'it-si-chiama',
      'si chiama',
      'se llama',
      'Mia madre si chiama Laura.',
      'Mi madre se llama Laura.',
      ['introductions'],
    ),
    w('it-un', 'un', 'un', 'Ho un fratello.', 'Tengo un hermano.', ['articles']),
    w('it-una', 'una', 'una', 'Ho una sorella.', 'Tengo una hermana.', ['articles']),
    w(
      'it-figlio-unico',
      'figlio unico',
      'hijo único',
      'Sono figlio unico.',
      'Soy hijo único.',
      ['family'],
      {
        acceptedTexts: ['figlia unica'],
      },
    ),
  ],
  lessons: [
    {
      title: 'Madre e padre',
      objective: 'Nombrar a tu familia cercana.',
      intro: {
        explanation:
          'Madre y padre se escriben igual que en español. Ojo: genitori significa «padres» (mamá y papá); parenti, en cambio, son los parientes.',
        examples: [
          { target: 'La mia famiglia è piccola.', base: 'Mi familia es chica.' },
          { target: 'I miei genitori sono di Roma.', base: 'Mis padres son de Roma.' },
        ],
      },
      takeaways: [
        'Nombrás a tu madre, tu padre y tus padres.',
        'Sabés que genitori son tus padres.',
      ],
      exercises: [
        ex.translationChoice(
          'famiglia',
          'familia',
          ['padres (mamá y papá)', 'hermano', 'abuela'],
          ['it-famiglia'],
        ),
        ex.translationChoice(
          'genitori',
          'padres (mamá y papá)',
          ['parientes', 'hermanos', 'abuelos'],
          ['it-genitori'],
          {
            explanation: 'Genitori son el padre y la madre. Los parientes son parenti.',
          },
        ),
        ex.listenChoice(
          'mia madre',
          ['mio padre', 'mia sorella', 'mia nonna'],
          ['it-madre', 'it-mia'],
        ),
        ex.fillBlank(
          'I miei ___ sono di Roma.',
          'Mis padres son de Roma.',
          'genitori',
          ['padre', 'madre', 'famiglia'],
          ['it-genitori'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['famiglia', 'familia'],
            ['genitori', 'padres'],
            ['mio', 'mi (masculino)'],
            ['mia', 'mi (femenino)'],
          ],
          ['it-famiglia', 'it-genitori', 'it-mio', 'it-mia'],
        ),
        ex.orderWords('Mio padre è argentino.', 'Mi padre es argentino.', ['it-mio', 'it-padre']),
        ex.translateWrite('Mi familia', 'la mia famiglia', ['it-famiglia', 'it-mia'], {
          explanation: 'Famiglia lleva artículo: la mia famiglia.',
        }),
        ex.translateWrite('Mis padres', 'i miei genitori', ['it-genitori'], {
          explanation: 'En plural, el posesivo lleva artículo: i miei genitori.',
        }),
      ],
    },
    {
      title: 'Fratelli e sorelle',
      objective: 'Hablar de tus hermanos.',
      intro: {
        explanation:
          'Fratello es hermano y sorella, hermana. Con ho (tengo) decís cuántos tenés: ho un fratello, ho due sorelle. Si no tenés hermanos: sono figlio unico (o figlia unica).',
        examples: [
          { target: 'Ho un fratello e una sorella.', base: 'Tengo un hermano y una hermana.' },
          { target: 'Sono figlia unica.', base: 'Soy hija única.' },
        ],
      },
      takeaways: [
        'Decís cuántos hermanos tenés con ho.',
        'Decís que sos hijo único con figlio unico.',
      ],
      exercises: [
        ex.translationChoice(
          'fratello',
          'hermano',
          ['hermana', 'padre', 'abuelo'],
          ['it-fratello'],
        ),
        ex.translationChoice('sorella', 'hermana', ['hermano', 'madre', 'hija'], ['it-sorella']),
        ex.listenChoice('sorella', ['fratello', 'nonna', 'figlia'], ['it-sorella']),
        ex.fillBlank(
          'Ho ___ fratello.',
          'Tengo un hermano.',
          'un',
          ['una', 'uno', 'due'],
          ['it-un', 'it-fratello'],
          {
            skill: 'grammar',
            explanation:
              'Fratello es masculino: un fratello. Con una palabra femenina es una: una sorella.',
          },
        ),
        ex.fillBlank(
          'Ho ___ sorella.',
          'Tengo una hermana.',
          'una',
          ['un', 'uno', 'mio'],
          ['it-una', 'it-sorella'],
          { skill: 'grammar' },
        ),
        ex.orderWords('Sono figlio unico.', 'Soy hijo único.', ['it-figlio-unico']),
        ex.translateWrite('Tengo un hermano.', 'Ho un fratello.', ['it-fratello'], {
          acceptedAnswers: ['Io ho un fratello.'],
        }),
        ex.translateWrite('Tengo dos hermanas.', 'Ho due sorelle.', ['it-sorella', 'it-due'], {
          acceptedAnswers: ['Io ho due sorelle.'],
          explanation: 'Sorella en plural es sorelle (-a → -e).',
        }),
      ],
    },
    {
      title: 'Nonni e figli',
      objective: 'Hablar de abuelos e hijos.',
      intro: {
        explanation:
          'Nonno y nonna son los abuelos; figlio y figlia, los hijos. Como en italiano casi todo cambia -o / -a, podés adivinar muchos femeninos.',
        examples: [
          { target: 'Mia nonna è di Napoli.', base: 'Mi abuela es de Nápoles.' },
          { target: 'Lei è mia figlia.', base: 'Ella es mi hija.' },
        ],
      },
      takeaways: ['Nombrás a tus abuelos y a tus hijos.', 'Cambiás -o por -a para el femenino.'],
      exercises: [
        ex.imageChoice('👵', 'nonna', ['nonno', 'madre', 'figlia'], ['it-nonna']),
        ex.imageChoice('👴', 'nonno', ['nonna', 'padre', 'figlio'], ['it-nonno']),
        ex.translationChoice('figlia', 'hija', ['hijo', 'hermana', 'abuela'], ['it-figlia']),
        ex.listenChoice('figlio', ['figlia', 'fratello', 'nonno'], ['it-figlio']),
        ex.matchPairs(
          [
            ['nonno', 'abuelo'],
            ['nonna', 'abuela'],
            ['figlio', 'hijo'],
            ['figlia', 'hija'],
          ],
          ['it-nonno', 'it-nonna', 'it-figlio', 'it-figlia'],
        ),
        ex.fillBlank(
          'Lei è mia ___.',
          'Ella es mi hija.',
          'figlia',
          ['figlio', 'nonno', 'fratello'],
          ['it-figlia', 'it-mia'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Mi abuela', 'mia nonna', ['it-nonna', 'it-mia'], {
          explanation: 'Con un familiar en singular no va artículo: mia nonna, no «la mia nonna».',
        }),
        ex.translateWrite('Tengo un hijo.', 'Ho un figlio.', ['it-figlio'], {
          acceptedAnswers: ['Io ho un figlio.'],
        }),
      ],
    },
    {
      title: 'Mio, mia',
      objective: 'Usar mio y mia con tu familia.',
      intro: {
        explanation:
          'Mio va con palabras masculinas (mio padre, mio fratello) y mia con femeninas (mia madre, mia sorella). Con un familiar en singular no se usa artículo.',
        examples: [
          { target: 'Mio fratello ha dieci anni.', base: 'Mi hermano tiene diez años.' },
          { target: 'Mia sorella è una studentessa.', base: 'Mi hermana es estudiante.' },
        ],
      },
      takeaways: [
        'Elegís mio o mia según la palabra.',
        'No ponés artículo con un familiar en singular.',
      ],
      exercises: [
        ex.translationChoice('mia', 'mi (femenino)', ['mi (masculino)', 'tu', 'una'], ['it-mia']),
        ex.fillBlank(
          '___ fratello ha dieci anni.',
          'Mi hermano tiene diez años.',
          'Mio',
          ['Mia', 'Il', 'Una'],
          ['it-mio', 'it-fratello'],
          {
            explanation:
              'Fratello es masculino: mio fratello. Sin artículo porque es un familiar en singular.',
          },
        ),
        ex.fillBlank(
          '___ madre è italiana.',
          'Mi madre es italiana.',
          'Mia',
          ['Mio', 'La', 'Un'],
          ['it-mia', 'it-madre'],
          { skill: 'grammar' },
        ),
        ex.listenChoice(
          'mio fratello',
          ['mia sorella', 'mio padre', 'mia madre'],
          ['it-mio', 'it-fratello'],
        ),
        ex.orderWords('Mia sorella è una studentessa.', 'Mi hermana es estudiante.', [
          'it-mia',
          'it-sorella',
          'it-studentessa',
        ]),
        ex.matchPairs(
          [
            ['mio padre', 'mi padre'],
            ['mia madre', 'mi madre'],
            ['mio fratello', 'mi hermano'],
            ['mia sorella', 'mi hermana'],
          ],
          ['it-mio', 'it-mia', 'it-padre', 'it-madre'],
        ),
        ex.translateWrite(
          'Mi hermana tiene quince años.',
          'Mia sorella ha quindici anni.',
          ['it-mia', 'it-sorella', 'it-ha', 'it-quindici'],
          {
            explanation: 'Sin artículo (mia sorella) y la edad con ha.',
          },
        ),
        ex.translateWrite('Mi padre es argentino.', 'Mio padre è argentino.', ['it-mio']),
      ],
    },
    {
      title: 'Si chiama…',
      objective: 'Decir cómo se llaman tus familiares.',
      intro: {
        explanation:
          'Para decir cómo se llama otra persona: si chiama + nombre. Para preguntar: come si chiama tuo fratello?',
        examples: [
          { target: 'Mia madre si chiama Laura.', base: 'Mi madre se llama Laura.' },
          { target: 'Come si chiama tuo fratello?', base: '¿Cómo se llama tu hermano?' },
        ],
      },
      takeaways: [
        'Decís cómo se llama alguien con si chiama.',
        'Presentás a tu familia con nombre y edad.',
      ],
      exercises: [
        ex.translationChoice(
          'si chiama',
          'se llama',
          ['me llamo', '¿cómo te llamás?', 'tiene'],
          ['it-si-chiama'],
        ),
        ex.fillBlank(
          'Mia madre ___ Laura.',
          'Mi madre se llama Laura.',
          'si chiama',
          ['mi chiamo', 'ti chiami', 'ha'],
          ['it-si-chiama', 'it-madre'],
          {
            explanation: 'Para otra persona: si chiama. Mi chiamo es sólo para vos mismo.',
          },
        ),
        ex.listenChoice(
          'si chiama Laura',
          ['mi chiamo Laura', 'ha venti anni', 'sono di Roma'],
          ['it-si-chiama'],
        ),
        ex.orderWords('Mio nonno si chiama Pietro.', 'Mi abuelo se llama Pietro.', [
          'it-mio',
          'it-nonno',
          'it-si-chiama',
        ]),
        ex.matchPairs(
          [
            ['mi chiamo', 'me llamo'],
            ['si chiama', 'se llama'],
            ['famiglia', 'familia'],
            ['figlio unico', 'hijo único'],
          ],
          ['it-mi-chiamo', 'it-si-chiama', 'it-famiglia', 'it-figlio-unico'],
        ),
        ex.shortAnswer(
          'Come si chiama tua madre?',
          '¿Cómo se llama tu madre? (Respondé que se llama Ana.)',
          'Mia madre si chiama Ana.',
          ['Si chiama Ana.', 'Lei si chiama Ana.', 'Ana.'],
          ['it-si-chiama', 'it-madre', 'it-mia'],
        ),
        ex.translateWrite('Mi hermano se llama Luca.', 'Mio fratello si chiama Luca.', [
          'it-mio',
          'it-fratello',
          'it-si-chiama',
        ]),
        ex.translateWrite('Soy hija única.', 'Sono figlia unica.', ['it-figlio-unico'], {
          explanation: 'En femenino: figlia unica.',
        }),
      ],
    },
  ],
};
