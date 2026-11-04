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

/**
 * Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística.
 * Gostar funciona al revés que «gustar» (eu gosto de…). Se evitan los cognados en los ejercicios de
 * traducción (cantar, viajar, música) y se trabajan dos falsos amigos: cachorro y esquisito.
 */
export const unit11: UnitDef = {
  position: 11,
  title: 'Gustos',
  titleEn: 'Eu gosto de…',
  description:
    'Decir lo que te gusta con gostar de, preguntar gustos, decir lo que podés hacer y dos falsos amigos.',
  emoji: '❤️',
  objective:
    'Podés decir eu gosto de… / não gosto de…, preguntar você gosta de…?, responder eu também / eu também não y usar posso y pode con un verbo.',
  grammar: {
    title: 'Gostar de (≠ gustar) · poder + infinitivo',
    explanation:
      'En portugués la persona es el sujeto: eu gosto de futebol («me gusta el fútbol»), literalmente «yo gusto de». Siempre lleva de, que se junta con el artículo: gosto do Brasil (de + o), gosto da praia (de + a). Poder va con el verbo en infinitivo: posso pagar?',
    examples: [
      { target: 'Eu gosto de futebol.', base: 'Me gusta el fútbol.' },
      { target: 'Eu gosto da praia.', base: 'Me gusta la playa.' },
      { target: 'Você pode jogar amanhã?', base: '¿Podés jugar mañana?' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil (gostar de + artículo, adoro, legal).',
  },
  words: [
    w('pt-gosto-de', 'gosto de', 'me gusta', 'Eu gosto de café.', 'Me gusta el café.', ['likes'], {
      acceptedTranslations: ['me gustan'],
    }),
    w(
      'pt-gosta-de',
      'gosta de',
      'le gusta / te gusta (con você)',
      'Você gosta de futebol?',
      '¿Te gusta el fútbol?',
      ['likes'],
      { acceptedTranslations: ['le gusta', 'te gusta'] },
    ),
    w(
      'pt-nao-gosto',
      'não gosto de',
      'no me gusta',
      'Eu não gosto de leite.',
      'No me gusta la leche.',
      ['likes'],
      { acceptedTranslations: ['no me gustan'] },
    ),
    w('pt-adoro', 'adoro', 'me encanta', 'Eu adoro a praia!', '¡Me encanta la playa!', ['likes']),
    w('pt-muito', 'muito', 'mucho', 'Eu gosto muito de ler.', 'Me gusta mucho leer.', ['likes'], {
      acceptedTranslations: ['muy'],
    }),
    w(
      'pt-eu-tambem',
      'eu também',
      'yo también',
      'Gosto de dançar. — Eu também!',
      'Me gusta bailar. — ¡Yo también!',
      ['likes'],
    ),
    w(
      'pt-eu-tambem-nao',
      'eu também não',
      'yo tampoco',
      'Não gosto de leite. — Eu também não.',
      'No me gusta la leche. — Yo tampoco.',
      ['likes'],
    ),
    w(
      'pt-futebol',
      'futebol',
      'fútbol',
      'Eu gosto de futebol.',
      'Me gusta el fútbol.',
      ['hobbies'],
      {
        emoji: '⚽',
      },
    ),
    w(
      'pt-filme',
      'filme',
      'película',
      'Hoje eu assisto um filme.',
      'Hoy miro una película.',
      ['hobbies'],
      { emoji: '🎬' },
    ),
    w(
      'pt-praia',
      'praia',
      'playa',
      'Eu gosto da praia.',
      'Me gusta la playa.',
      ['places', 'hobbies'],
      {
        emoji: '🏖️',
      },
    ),
    w(
      'pt-cachorro',
      'cachorro',
      'perro',
      'O cachorro é preto.',
      'El perro es negro.',
      ['animals'],
      {
        emoji: '🐶',
      },
    ),
    w(
      'pt-cozinhar',
      'cozinhar',
      'cocinar',
      'Eu gosto de cozinhar.',
      'Me gusta cocinar.',
      ['verbs', 'hobbies'],
      { emoji: '🍳' },
    ),
    w(
      'pt-dancar',
      'dançar',
      'bailar',
      'Você gosta de dançar?',
      '¿Te gusta bailar?',
      ['verbs', 'hobbies'],
      { emoji: '💃' },
    ),
    w('pt-jogar', 'jogar', 'jugar', 'Eu gosto de jogar futebol.', 'Me gusta jugar al fútbol.', [
      'verbs',
      'hobbies',
    ]),
    w(
      'pt-ler',
      'ler',
      'leer',
      'Eu gosto de ler à noite.',
      'Me gusta leer a la noche.',
      ['verbs', 'hobbies'],
      { emoji: '📖' },
    ),
    w('pt-posso', 'posso', 'puedo', 'Posso pagar?', '¿Puedo pagar?', ['verbs']),
    w(
      'pt-pode',
      'pode',
      'puede / podés (con você)',
      'Você pode jogar amanhã?',
      '¿Podés jugar mañana?',
      ['verbs'],
      { acceptedTranslations: ['puede', 'podés', 'puedes'] },
    ),
    w('pt-legal', 'legal', 'genial', 'Que legal!', '¡Qué genial!', ['likes'], {
      acceptedTranslations: ['copado', 'bárbaro', 'buenísimo'],
    }),
    w(
      'pt-esquisito',
      'esquisito',
      'raro',
      'Que filme esquisito!',
      '¡Qué película rara!',
      ['likes'],
      {
        acceptedTranslations: ['extraño'],
      },
    ),
  ],
  lessons: [
    {
      title: 'Eu gosto de…',
      objective: 'Decir lo que te gusta y lo que no.',
      intro: {
        explanation:
          'Gostar funciona al revés que «gustar»: eu gosto de futebol es «me gusta el fútbol» (literalmente «yo gusto de fútbol»). Siempre lleva de. Para negar: eu não gosto de…',
        examples: [
          { target: 'Eu gosto de futebol.', base: 'Me gusta el fútbol.' },
          { target: 'Eu não gosto de cozinhar.', base: 'No me gusta cocinar.' },
        ],
      },
      takeaways: ['Decís lo que te gusta con gosto de.', 'Negás con não gosto de.'],
      exercises: [
        ex.translationChoice(
          'gosto de',
          'me gusta',
          ['me llamo', 'quiero', 'tengo'],
          ['pt-gosto-de'],
        ),
        ex.imageChoice('⚽', 'futebol', ['filme', 'praia', 'livro'], ['pt-futebol']),
        ex.imageChoice('🍳', 'cozinhar', ['dançar', 'ler', 'durmo'], ['pt-cozinhar']),
        ex.listenChoice(
          'Eu não gosto de leite.',
          ['Eu gosto de leite.', 'Eu não gosto de café.', 'Eu não quero leite.'],
          ['pt-nao-gosto', 'pt-leite'],
        ),
        ex.fillBlank(
          'Eu gosto ___ futebol.',
          'Me gusta el fútbol.',
          'de',
          ['com', 'em', 'para'],
          ['pt-gosto-de', 'pt-futebol'],
          { explanation: 'Gostar siempre lleva de: gosto de futebol.' },
        ),
        ex.fillBlank(
          'Eu ___ gosto de cozinhar.',
          'No me gusta cocinar.',
          'não',
          ['nem', 'sem', 'no'],
          ['pt-nao-gosto', 'pt-cozinhar'],
        ),
        ex.orderWords('Eu gosto de cozinhar à noite.', 'Me gusta cocinar a la noche.', [
          'pt-gosto-de',
          'pt-cozinhar',
          'pt-a-noite',
        ]),
        ex.translateWrite(
          'Me gusta el fútbol.',
          'Eu gosto de futebol.',
          ['pt-gosto-de', 'pt-futebol'],
          {
            acceptedAnswers: ['Gosto de futebol.'],
          },
        ),
        ex.translateWrite(
          'No me gusta cocinar.',
          'Eu não gosto de cozinhar.',
          ['pt-nao-gosto', 'pt-cozinhar'],
          { acceptedAnswers: ['Não gosto de cozinhar.'] },
        ),
      ],
    },
    {
      title: 'Gosto do…, gosto da…',
      objective: 'Usar gostar de con artículo.',
      intro: {
        explanation:
          'Con artículo, de se junta: de + o = do, de + a = da. Eu gosto da praia («me gusta la playa»), gosto do Brasil. Ojo con el falso amigo: cachorro es «perro» (no sólo el cachorrito).',
        examples: [
          { target: 'Eu gosto da praia.', base: 'Me gusta la playa.' },
          { target: 'Eu gosto muito do meu cachorro.', base: 'Quiero mucho a mi perro.' },
        ],
      },
      takeaways: ['Juntás de con el artículo: do, da.', 'Sabés que cachorro es «perro».'],
      exercises: [
        ex.imageChoice('🏖️', 'praia', ['rua', 'escola', 'cozinha'], ['pt-praia']),
        ex.imageChoice('🐶', 'cachorro', ['futebol', 'filme', 'cadeira'], ['pt-cachorro']),
        ex.translationChoice(
          'cachorro',
          'perro',
          ['cachorrito', 'gato', 'pulpo'],
          ['pt-cachorro'],
          {
            explanation: 'Falso amigo: cachorro es cualquier perro; el cachorrito es filhote.',
          },
        ),
        ex.listenChoice(
          'Eu gosto da praia.',
          ['Eu gosto do Brasil.', 'Eu moro na praia.', 'Eu gosto de praia.'],
          ['pt-gosto-de', 'pt-da', 'pt-praia'],
        ),
        ex.fillBlank(
          'Eu gosto ___ praia.',
          'Me gusta la playa.',
          'da',
          ['do', 'de a', 'na'],
          ['pt-gosto-de', 'pt-da', 'pt-praia'],
          { explanation: 'De + a = da.' },
        ),
        ex.fillBlank(
          'Eu gosto ___ meu cachorro.',
          'Quiero a mi perro.',
          'do',
          ['da', 'de o', 'no'],
          ['pt-gosto-de', 'pt-do', 'pt-meu', 'pt-cachorro'],
          { explanation: 'De + o = do.' },
        ),
        ex.translationChoice('muito', 'mucho', ['poco', 'también', 'siempre'], ['pt-muito']),
        ex.orderWords('Eu gosto muito da praia.', 'Me gusta mucho la playa.', [
          'pt-gosto-de',
          'pt-muito',
          'pt-da',
          'pt-praia',
        ]),
        ex.translateWrite(
          'Me gusta la playa.',
          'Eu gosto da praia.',
          ['pt-gosto-de', 'pt-da', 'pt-praia'],
          {
            acceptedAnswers: ['Gosto da praia.'],
          },
        ),
        ex.translateWrite('El perro es negro.', 'O cachorro é preto.', [
          'pt-o',
          'pt-cachorro',
          'pt-preto',
        ]),
      ],
    },
    {
      title: 'Você gosta de…?',
      objective: 'Preguntar gustos y responder.',
      intro: {
        explanation:
          'Para preguntar: você gosta de…? («¿te gusta…?»). Para coincidir: eu também («yo también») o eu também não («yo tampoco»). Adoro es «me encanta».',
        examples: [
          { target: 'Você gosta de dançar? — Adoro!', base: '¿Te gusta bailar? — ¡Me encanta!' },
          {
            target: 'Não gosto de leite. — Eu também não.',
            base: 'No me gusta la leche. — Yo tampoco.',
          },
        ],
      },
      takeaways: ['Preguntás você gosta de…?', 'Respondés eu também o eu também não.'],
      exercises: [
        ex.translationChoice(
          'adoro',
          'me encanta',
          ['no me gusta', 'quiero', 'yo también'],
          ['pt-adoro'],
        ),
        ex.imageChoice('💃', 'dançar', ['cozinhar', 'ler', 'jogar'], ['pt-dancar']),
        ex.translationChoice(
          'eu também não',
          'yo tampoco',
          ['yo también', 'no me gusta', 'yo no sé'],
          ['pt-eu-tambem-nao'],
        ),
        ex.listenChoice(
          'Você gosta de dançar?',
          ['Você gosta de cozinhar?', 'Eu gosto de dançar.', 'Você pode dançar?'],
          ['pt-voce', 'pt-gosta-de', 'pt-dancar'],
        ),
        ex.fillBlank(
          'Você ___ de futebol?',
          '¿Te gusta el fútbol?',
          'gosta',
          ['gosto', 'quer', 'fala'],
          ['pt-voce', 'pt-gosta-de', 'pt-futebol'],
          { explanation: 'Con você el verbo va como con ele: você gosta.' },
        ),
        ex.matchPairs(
          [
            ['gosto de', 'me gusta'],
            ['não gosto de', 'no me gusta'],
            ['adoro', 'me encanta'],
            ['eu também', 'yo también'],
          ],
          ['pt-gosto-de', 'pt-nao-gosto', 'pt-adoro', 'pt-eu-tambem'],
        ),
        ex.orderWords('Ela gosta de jogar futebol.', 'A ella le gusta jugar al fútbol.', [
          'pt-ela',
          'pt-gosta-de',
          'pt-jogar',
          'pt-futebol',
        ]),
        ex.shortAnswer(
          'Eu gosto de dançar. E você?',
          'Me gusta bailar. ¿Y a vos? (Respondé que a vos también.)',
          'Eu também.',
          ['Eu também!', 'Eu também gosto.', 'Também.', 'Eu também gosto de dançar.'],
          ['pt-eu-tambem'],
        ),
        ex.translateWrite('¿Te gusta bailar?', 'Você gosta de dançar?', [
          'pt-voce',
          'pt-gosta-de',
          'pt-dancar',
        ]),
      ],
    },
    {
      title: 'Que legal!',
      objective: 'Opinar sobre algo y evitar un falso amigo.',
      intro: {
        explanation:
          'Que legal! es «¡qué genial!»: en Brasil legal se usa para todo lo que está bueno. Ojo: esquisito NO es «exquisito», es «raro». Para algo rico se dice gostoso.',
        examples: [
          { target: 'Você joga futebol? Que legal!', base: '¿Jugás al fútbol? ¡Qué genial!' },
          { target: 'Que filme esquisito!', base: '¡Qué película rara!' },
        ],
      },
      takeaways: ['Decís que algo está bueno con que legal!', 'Sabés que esquisito es «raro».'],
      exercises: [
        ex.translationChoice('legal', 'genial', ['raro', 'rico', 'lejos'], ['pt-legal']),
        ex.translationChoice('esquisito', 'raro', ['rico', 'genial', 'lindo'], ['pt-esquisito'], {
          explanation: 'Falso amigo: esquisito es raro; algo rico es gostoso.',
        }),
        ex.imageChoice('🎬', 'filme', ['futebol', 'praia', 'ônibus'], ['pt-filme']),
        ex.imageChoice('📖', 'ler', ['jogar', 'dançar', 'cozinhar'], ['pt-ler']),
        ex.listenChoice(
          'Que filme esquisito!',
          ['Que filme legal!', 'Que pão gostoso!', 'Que praia legal!'],
          ['pt-filme', 'pt-esquisito'],
        ),
        ex.fillBlank(
          'O pão de queijo é muito ___!',
          '¡El pan de queso es muy rico!',
          'gostoso',
          ['esquisito', 'longe', 'legal'],
          ['pt-pao-de-queijo', 'pt-muito', 'pt-gostoso'],
          {
            explanation: 'Para la comida rica: gostoso. Esquisito es «raro».',
            skill: 'vocabulary',
          },
        ),
        ex.orderWords('Eu adoro ler à noite.', 'Me encanta leer a la noche.', [
          'pt-adoro',
          'pt-ler',
          'pt-a-noite',
        ]),
        ex.shortAnswer(
          'Eu jogo futebol todo dia.',
          'Juego al fútbol todos los días. (Respondé «¡qué genial!».)',
          'Que legal!',
          ['Que legal.', 'Legal!'],
          ['pt-legal'],
        ),
        ex.translateWrite('Me gusta leer.', 'Eu gosto de ler.', ['pt-gosto-de', 'pt-ler'], {
          acceptedAnswers: ['Gosto de ler.'],
        }),
      ],
    },
    {
      title: 'Posso…? Você pode…?',
      objective: 'Pedir permiso y preguntar si alguien puede.',
      intro: {
        explanation:
          'Posso es «puedo» y (você) pode «podés». Van con el verbo en infinitivo: posso pagar? («¿puedo pagar?»), você pode jogar amanhã?',
        examples: [
          { target: 'Posso pagar?', base: '¿Puedo pagar?' },
          { target: 'Hoje eu não posso.', base: 'Hoy no puedo.' },
        ],
      },
      takeaways: ['Pedís permiso con posso…?', 'Preguntás você pode…?'],
      exercises: [
        ex.translationChoice('posso', 'puedo', ['quiero', 'tengo', 'podés'], ['pt-posso']),
        ex.translationChoice(
          'pode',
          'puede / podés (con você)',
          ['quiere', 'tiene', 'va'],
          ['pt-pode'],
        ),
        ex.translationChoice('jogar', 'jugar', ['leer', 'bailar', 'cocinar'], ['pt-jogar']),
        ex.listenChoice(
          'Você pode jogar amanhã?',
          ['Você quer jogar amanhã?', 'Eu posso jogar amanhã.', 'Você pode jogar hoje?'],
          ['pt-voce', 'pt-pode', 'pt-jogar', 'pt-amanha'],
        ),
        ex.fillBlank(
          'Hoje eu não ___, amanhã sim.',
          'Hoy no puedo, mañana sí.',
          'posso',
          ['pode', 'quero', 'gosto'],
          ['pt-hoje', 'pt-posso', 'pt-amanha'],
        ),
        ex.matchPairs(
          [
            ['posso', 'puedo'],
            ['jogar', 'jugar'],
            ['ler', 'leer'],
            ['dançar', 'bailar'],
          ],
          ['pt-posso', 'pt-jogar', 'pt-ler', 'pt-dancar'],
        ),
        ex.orderWords('Eu posso cozinhar hoje.', 'Hoy puedo cocinar.', [
          'pt-posso',
          'pt-cozinhar',
          'pt-hoje',
        ]),
        ex.translateWrite('¿Podés jugar mañana?', 'Você pode jogar amanhã?', [
          'pt-voce',
          'pt-pode',
          'pt-jogar',
          'pt-amanha',
        ]),
        ex.translateWrite(
          'Hoy no puedo.',
          'Hoje eu não posso.',
          ['pt-hoje', 'pt-nao', 'pt-posso'],
          {
            acceptedAnswers: ['Hoje não posso.', 'Eu não posso hoje.', 'Não posso hoje.'],
          },
        ),
      ],
    },
  ],
};
