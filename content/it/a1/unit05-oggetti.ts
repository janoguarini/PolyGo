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

/**
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística. Los artículos se
 * traducen con una descripción («artículo masculino (el)») para no chocar con «él» (lui).
 */
export const unit05: UnitDef = {
  position: 5,
  title: 'Objetos y colores',
  titleEn: 'Oggetti e colori',
  description:
    'Nombrar objetos con su artículo, en singular y en plural, y decir de qué color son.',
  emoji: '🎒',
  objective:
    'Podés preguntar qué es algo, nombrar objetos con el artículo correcto (il, lo, la, l’, i, gli, le) y decir de qué color son.',
  grammar: {
    title: 'Los artículos il, lo, la, l’ y sus plurales',
    explanation:
      'Il va con la mayoría de los masculinos y lo con los que empiezan con s + consonante o z. La va con los femeninos. Ante vocal, il / lo / la se vuelven l’. En plural: il → i, lo y l’ (masculino) → gli, la y l’ (femenino) → le.',
    examples: [
      { target: 'il libro → i libri', base: 'el libro → los libros' },
      { target: 'lo zaino → gli zaini', base: 'la mochila → las mochilas' },
      { target: 'la penna → le penne', base: 'la lapicera → las lapiceras' },
      { target: "l'orologio → gli orologi", base: 'el reloj → los relojes' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w('it-libro', 'libro', 'libro', 'Il libro è rosso.', 'El libro es rojo.', ['objects'], {
      emoji: '📕',
    }),
    w('it-penna', 'penna', 'lapicera', 'La penna è nera.', 'La lapicera es negra.', ['objects'], {
      acceptedTranslations: ['bolígrafo', 'birome'],
      emoji: '🖊️',
    }),
    w(
      'it-quaderno',
      'quaderno',
      'cuaderno',
      'Il quaderno è bianco.',
      'El cuaderno es blanco.',
      ['objects'],
      { emoji: '📓' },
    ),
    w('it-zaino', 'zaino', 'mochila', 'Lo zaino è blu.', 'La mochila es azul.', ['objects'], {
      emoji: '🎒',
    }),
    w('it-chiave', 'chiave', 'llave', 'La chiave è qui.', 'La llave está acá.', ['objects'], {
      emoji: '🔑',
    }),
    w('it-orologio', 'orologio', 'reloj', "L'orologio è nero.", 'El reloj es negro.', ['objects'], {
      emoji: '⌚',
    }),
    w(
      'it-ombrello',
      'ombrello',
      'paraguas',
      "L'ombrello è giallo.",
      'El paraguas es amarillo.',
      ['objects'],
      { emoji: '☂️' },
    ),
    w('it-il', 'il', 'artículo masculino (el)', 'il libro', 'el libro', ['articles']),
    w('it-lo', 'lo', 'artículo masculino ante s + consonante o z (el)', 'lo zaino', 'la mochila', [
      'articles',
    ]),
    w('it-la', 'la', 'artículo femenino (la)', 'la penna', 'la lapicera', ['articles']),
    w('it-l-art', "l'", 'artículo ante vocal (el / la)', "l'orologio", 'el reloj', ['articles']),
    w('it-i', 'i', 'artículo masculino plural (los)', 'i libri', 'los libros', ['articles']),
    w(
      'it-gli',
      'gli',
      'artículo masculino plural ante vocal, s + consonante o z (los)',
      'gli zaini',
      'las mochilas',
      ['articles'],
    ),
    w('it-le', 'le', 'artículo femenino plural (las)', 'le penne', 'las lapiceras', ['articles']),
    w('it-rosso', 'rosso', 'rojo', 'Il libro è rosso.', 'El libro es rojo.', ['colors'], {
      acceptedTexts: ['rossa'],
      emoji: '🔴',
    }),
    w('it-blu', 'blu', 'azul', 'La penna è blu.', 'La lapicera es azul.', ['colors'], {
      emoji: '🔵',
    }),
    w(
      'it-giallo',
      'giallo',
      'amarillo',
      "L'ombrello è giallo.",
      'El paraguas es amarillo.',
      ['colors'],
      { acceptedTexts: ['gialla'], emoji: '🟡' },
    ),
    w('it-nero', 'nero', 'negro', 'Lo zaino è nero.', 'La mochila es negra.', ['colors'], {
      acceptedTexts: ['nera'],
      emoji: '⚫',
    }),
    w(
      'it-bianco',
      'bianco',
      'blanco',
      'Il quaderno è bianco.',
      'El cuaderno es blanco.',
      ['colors'],
      { acceptedTexts: ['bianca'], emoji: '⚪' },
    ),
    w(
      'it-che-cos-e',
      "che cos'è?",
      '¿qué es?',
      "Che cos'è? È una chiave.",
      '¿Qué es? Es una llave.',
      ['questions'],
      { acceptedTexts: ["cos'è?", 'che cosa è?'] },
    ),
    w(
      'it-di-che-colore',
      'di che colore è?',
      '¿de qué color es?',
      'Di che colore è lo zaino?',
      '¿De qué color es la mochila?',
      ['questions', 'colors'],
    ),
  ],
  lessons: [
    {
      title: "Che cos'è?",
      objective: 'Preguntar qué es algo y nombrar objetos con il y la.',
      intro: {
        explanation:
          "Para preguntar qué es algo: che cos'è? Se responde con è + la cosa: è un libro, è la penna. Il va con la mayoría de las palabras masculinas y la con las femeninas.",
        examples: [
          { target: "Che cos'è? È un libro.", base: '¿Qué es? Es un libro.' },
          { target: 'La chiave è qui.', base: 'La llave está acá.' },
        ],
      },
      takeaways: [
        "Preguntás qué es algo con che cos'è?",
        'Usás il con masculinos y la con femeninos.',
      ],
      exercises: [
        ex.imageChoice('📕', 'libro', ['penna', 'chiave', 'zaino'], ['it-libro']),
        ex.translationChoice('penna', 'lapicera', ['llave', 'libro', 'mochila'], ['it-penna']),
        ex.imageChoice('🔑', 'chiave', ['penna', 'libro', 'orologio'], ['it-chiave']),
        ex.listenChoice(
          "Che cos'è?",
          ['Come stai?', 'Di dove sei?', 'Come ti chiami?'],
          ['it-che-cos-e'],
        ),
        ex.fillBlank(
          'È ___ penna.',
          'Es la lapicera.',
          'la',
          ['il', 'lo', 'i'],
          ['it-la', 'it-penna'],
          { explanation: 'Penna es femenina (termina en -a): la penna.' },
        ),
        ex.fillBlank(
          'È ___ libro.',
          'Es el libro.',
          'il',
          ['la', 'le', 'gli'],
          ['it-il', 'it-libro'],
          {
            explanation: 'Libro es masculino y empieza con consonante: il libro.',
          },
        ),
        ex.translateWrite('La llave', 'la chiave', ['it-la', 'it-chiave'], {
          explanation: 'Chiave termina en -e, pero es femenina: la chiave.',
        }),
        ex.shortAnswer(
          "Che cos'è? 🔑",
          '¿Qué es? (Respondé que es una llave.)',
          'È una chiave.',
          ['Una chiave.', 'È la chiave.', 'La chiave.'],
          ['it-che-cos-e', 'it-chiave', 'it-una'],
        ),
      ],
    },
    {
      title: "Lo zaino, l'orologio",
      objective: "Usar lo y l'.",
      intro: {
        explanation:
          "Lo va con las palabras masculinas que empiezan con s + consonante o con z: lo zaino. Delante de vocal, il y la se vuelven l': l'orologio, l'amica.",
        examples: [
          { target: 'Lo zaino è qui.', base: 'La mochila está acá.' },
          { target: "L'orologio di Luca.", base: 'El reloj de Luca.' },
        ],
      },
      takeaways: [
        'Usás lo con las palabras que empiezan con z o s + consonante.',
        "Usás l' ante vocal.",
      ],
      exercises: [
        ex.imageChoice('🎒', 'zaino', ['orologio', 'ombrello', 'quaderno'], ['it-zaino']),
        ex.imageChoice('⌚', 'orologio', ['zaino', 'chiave', 'libro'], ['it-orologio']),
        ex.imageChoice('📓', 'quaderno', ['libro', 'penna', 'zaino'], ['it-quaderno']),
        ex.translationChoice(
          'ombrello',
          'paraguas',
          ['reloj', 'cuaderno', 'mochila'],
          ['it-ombrello'],
        ),
        ex.fillBlank(
          'È ___ zaino.',
          'Es la mochila.',
          'lo',
          ['il', 'la', "l'"],
          ['it-lo', 'it-zaino'],
          { explanation: 'Zaino es masculino y empieza con z: lo zaino.' },
        ),
        ex.fillBlank(
          'È ___ orologio.',
          'Es el reloj.',
          "l'",
          ['il', 'lo', 'la'],
          ['it-l-art', 'it-orologio'],
          { explanation: "Orologio empieza con vocal: l'orologio." },
        ),
        ex.listenChoice(
          "l'ombrello",
          ['lo zaino', 'il quaderno', 'la chiave'],
          ['it-ombrello', 'it-l-art'],
        ),
        ex.matchPairs(
          [
            ['il quaderno', 'el cuaderno'],
            ['lo zaino', 'la mochila'],
            ["l'orologio", 'el reloj'],
            ["l'ombrello", 'el paraguas'],
          ],
          ['it-quaderno', 'it-zaino', 'it-orologio', 'it-ombrello'],
        ),
        ex.translateWrite('El cuaderno', 'il quaderno', ['it-il', 'it-quaderno']),
        ex.translateWrite('La mochila', 'lo zaino', ['it-lo', 'it-zaino'], {
          explanation: 'Zaino es masculino en italiano y empieza con z: lo zaino.',
        }),
      ],
    },
    {
      title: 'I, gli, le',
      objective: 'Nombrar objetos en plural.',
      intro: {
        explanation:
          "En plural: il → i, lo y l' (masculinos) → gli, la y l' (femeninos) → le. Las palabras en -o pasan a -i, las en -a a -e y las en -e a -i: i libri, le penne, le chiavi.",
        examples: [
          { target: 'Ho i libri.', base: 'Tengo los libros.' },
          { target: 'Le chiavi sono qui.', base: 'Las llaves están acá.' },
        ],
      },
      takeaways: [
        'Pasás los artículos al plural: i, gli, le.',
        'Cambiás la última letra de la palabra.',
      ],
      exercises: [
        ex.fillBlank('___ libri', 'los libros', 'i', ['gli', 'le', 'il'], ['it-i', 'it-libro']),
        ex.fillBlank('___ penne', 'las lapiceras', 'le', ['i', 'gli', 'la'], ['it-le', 'it-penna']),
        ex.fillBlank(
          '___ zaini',
          'las mochilas',
          'gli',
          ['i', 'le', 'lo'],
          ['it-gli', 'it-zaino'],
          {
            explanation: 'Lo zaino → gli zaini.',
          },
        ),
        ex.fillBlank(
          '___ orologi',
          'los relojes',
          'gli',
          ['i', 'le', "l'"],
          ['it-gli', 'it-orologio'],
          { explanation: "L'orologio es masculino: en plural, gli orologi." },
        ),
        ex.listenChoice('le chiavi', ['la chiave', 'i libri', 'gli zaini'], ['it-le', 'it-chiave']),
        ex.matchPairs(
          [
            ['il libro', 'i libri'],
            ['la penna', 'le penne'],
            ['lo zaino', 'gli zaini'],
            ['la chiave', 'le chiavi'],
          ],
          ['it-i', 'it-le', 'it-gli', 'it-chiave'],
        ),
        ex.orderWords('Ho due libri e tre penne.', 'Tengo dos libros y tres lapiceras.', [
          'it-ho',
          'it-due',
          'it-libro',
          'it-tre',
          'it-penna',
        ]),
        ex.translateWrite('Las llaves', 'le chiavi', ['it-le', 'it-chiave'], {
          explanation: 'Chiave termina en -e: en plural es chiavi.',
        }),
        ex.translateWrite('Los relojes', 'gli orologi', ['it-gli', 'it-orologio']),
      ],
    },
    {
      title: 'I colori',
      objective: 'Nombrar los colores.',
      intro: {
        explanation:
          'Los colores van después de la palabra y concuerdan como cualquier adjetivo: rosso con masculinos, rossa con femeninos. Blu no cambia nunca.',
        examples: [
          { target: 'Lo zaino è rosso.', base: 'La mochila es roja.', note: 'zaino es masculino' },
          { target: 'La penna è nera.', base: 'La lapicera es negra.' },
        ],
      },
      takeaways: ['Nombrás cinco colores.', 'Sabés que blu no cambia.'],
      exercises: [
        ex.imageChoice('🔴', 'rosso', ['blu', 'giallo', 'nero'], ['it-rosso']),
        ex.imageChoice('🟡', 'giallo', ['bianco', 'rosso', 'blu'], ['it-giallo']),
        ex.translationChoice('nero', 'negro', ['blanco', 'azul', 'amarillo'], ['it-nero']),
        ex.translationChoice('bianco', 'blanco', ['negro', 'rojo', 'azul'], ['it-bianco']),
        ex.listenChoice('blu', ['bianco', 'nero', 'giallo'], ['it-blu']),
        ex.matchPairs(
          [
            ['rosso', 'rojo'],
            ['blu', 'azul'],
            ['giallo', 'amarillo'],
            ['nero', 'negro'],
          ],
          ['it-rosso', 'it-blu', 'it-giallo', 'it-nero'],
        ),
        ex.translateWrite('Blanco', 'bianco', ['it-bianco'], { acceptedAnswers: ['bianca'] }),
        ex.translateWrite('El libro es rojo.', 'Il libro è rosso.', [
          'it-il',
          'it-rosso',
          'it-e-essere',
        ]),
      ],
    },
    {
      title: 'Di che colore è?',
      objective: 'Preguntar y decir de qué color es algo.',
      intro: {
        explanation:
          'Para preguntar el color: di che colore è? Ojo con la concordancia: el color sigue a la palabra italiana, aunque en español sea de otro género (lo zaino è nero, «la mochila es negra»).',
        examples: [
          { target: 'Di che colore è lo zaino?', base: '¿De qué color es la mochila?' },
          { target: 'La chiave è gialla.', base: 'La llave es amarilla.' },
        ],
      },
      takeaways: ['Preguntás de qué color es algo.', 'Hacés concordar el color con la palabra.'],
      exercises: [
        ex.translationChoice(
          'di che colore è?',
          '¿de qué color es?',
          ['¿qué es?', '¿de dónde sos?', '¿cómo estás?'],
          ['it-di-che-colore'],
        ),
        ex.fillBlank(
          'La penna è ___.',
          'La lapicera es roja.',
          'rossa',
          ['rosso', 'rossi', 'rosse'],
          ['it-rosso', 'it-penna'],
          { explanation: 'Penna es femenina: rossa.' },
        ),
        ex.fillBlank(
          'Lo zaino è ___.',
          'La mochila es negra.',
          'nero',
          ['nera', 'neri', 'nere'],
          ['it-nero', 'it-zaino'],
          { explanation: 'Zaino es masculino en italiano: nero.' },
        ),
        ex.listenChoice(
          'Di che colore è?',
          ["Che cos'è?", 'Come stai?', 'Quanti anni hai?'],
          ['it-di-che-colore'],
        ),
        ex.orderWords("L'ombrello è giallo.", 'El paraguas es amarillo.', [
          'it-l-art',
          'it-ombrello',
          'it-giallo',
        ]),
        ex.fillBlank(
          'La chiave è ___.',
          'La llave es blanca.',
          'bianca',
          ['bianco', 'bianchi', 'bianche'],
          ['it-bianco', 'it-chiave'],
          { explanation: 'Chiave termina en -e, pero es femenina: bianca.' },
        ),
        ex.shortAnswer(
          'Di che colore è lo zaino? 🎒⚫',
          '¿De qué color es la mochila? (Respondé que es negra.)',
          'È nero.',
          ['Nero.', 'Lo zaino è nero.'],
          ['it-di-che-colore', 'it-nero', 'it-zaino'],
        ),
        ex.translateWrite('La lapicera es azul.', 'La penna è blu.', [
          'it-la',
          'it-penna',
          'it-blu',
        ]),
      ],
    },
  ],
};
