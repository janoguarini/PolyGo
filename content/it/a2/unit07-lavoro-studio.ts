import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U7 «Trabajo y estudios» (docs/IT_A1_A2.md): stare + gerundio en presente (sto
 * studiando), presente + da para lo que dura (lavoro qui da due anni; contraste con due anni fa),
 * dovere y potere (devi, dobbiamo, può), attualmente, la entrevista y el sueldo, la universidad.
 * Falso amigo: il colloquio es la entrevista (de trabajo).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const COLLOQUIO = dialogue(
  'it.stim.a2-u7-colloquio',
  'Tommaso tiene una entrevista de trabajo en una oficina.',
  [
    ['Direttrice', 'Buongiorno, si accomodi. Allora, cosa fa attualmente?'],
    ['Tommaso', 'Attualmente lavoro in un negozio di scarpe, da due anni.'],
    ['Direttrice', 'E perché vuole cambiare lavoro?'],
    [
      'Tommaso',
      'Mi piace il contatto con la gente, ma l’orario è difficile: lavoro anche la domenica.',
    ],
    ['Direttrice', 'Capisco. Qui l’orario è dalle nove alle cinque, dal lunedì al venerdì.'],
  ],
);

const ANNUNCIO = reading(
  'it.stim.a2-u7-annuncio',
  'ad',
  'Un aviso en la vidriera de un restaurante.',
  [
    'Cercasi cameriere o cameriera per ristorante in centro.',
    'Orario: dal martedì alla domenica, la sera.',
    'Stipendio: 1.400 euro al mese.',
    'Non è necessaria esperienza. Per un colloquio, passate dopo le tre.',
  ],
  { title: 'Cercasi personale' },
);

const STUDENTESSA = reading(
  'it.stim.a2-u7-irene',
  'post',
  'Irene se presenta en un grupo de estudiantes.',
  [
    'Ciao a tutti! Sono Irene e sto studiando Medicina all’università di Padova.',
    'Questa settimana ho tre esami: devo studiare tanto!',
    'Tra un anno mi laureo e poi cercherò lavoro in un ospedale.',
  ],
  { from: 'Irene' },
);

const UFFICIO = dialogue(
  'it.stim.a2-u7-ufficio',
  'Dos compañeros de trabajo hablan en la oficina.',
  [
    ['Laura', 'Marco, sei libero per pranzo?'],
    ['Marco', 'No, sto lavorando a un progetto per il capo. Dobbiamo finire oggi.'],
    ['Laura', 'Poverino! Il capo è sempre così?'],
    ['Marco', 'Sì, ma lo stipendio è buono e i colleghi sono simpatici.'],
  ],
);

export const IT_A2_U07: ItUnitDef = {
  names: ['Direttrice', 'Tommaso', 'Irene', 'Medicina', 'Padova', 'Laura', 'Marco'],
  support: [
    'accomodi',
    'cambiare',
    'contatto',
    'difficile',
    'capisco',
    'dalle',
    'dal',
    'cercasi',
    'necessaria',
    'esperienza',
    'passate',
    'personale',
    'laureo',
    'cercherò',
    'libero',
    'progetto',
    'finire',
    'poverino',
    'studiato',
    'inglese',
    'possiamo',
    'economia',
  ],
  unit: {
    position: 7,
    title: 'Trabajo y estudios',
    titleEn: 'Lavoro e studio',
    description:
      'Contar qué haces actualmente y desde cuándo, entender un aviso y una entrevista de trabajo, y hablar de la universidad.',
    emoji: '🎓',
    objective:
      'Puedes decir qué estás haciendo ahora y desde hace cuánto (lavoro qui da due anni), hablar de tu trabajo o tus estudios, entender un aviso y una entrevista, y decir lo que tienes que hacer.',
    grammar: {
      title: 'Stare + gerundio · presente + da · dovere y potere',
      explanation:
        'Sto studiando es «estoy estudiando»: stare en presente + gerundio. Para algo que empezó en el pasado y sigue: presente + da + tiempo: lavoro qui da due anni (trabajo aquí desde hace dos años). No confundir con fa: sono arrivato due anni fa (llegué hace dos años). Dovere (tener que): devo, devi, deve, dobbiamo, dovete, devono. Potere: posso, puoi, può, possiamo, potete, possono. Ojo: il colloquio es la entrevista de trabajo.',
      examples: [
        { target: 'Sto studiando per un esame.', base: 'Estoy estudiando para un examen.' },
        {
          target: 'Lavoro in un negozio da due anni.',
          base: 'Trabajo en una tienda desde hace dos años.',
        },
        { target: 'Dobbiamo finire oggi.', base: 'Tenemos que terminar hoy.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U7). Sin revisión nativa: revisar la entrevista con Lei, cercasi y laurearsi (mi laureo / mi sono laureato).',
    },
    words: [
      w(
        'it-sto-studiando',
        'sto studiando',
        'estoy estudiando',
        'Sto studiando per un esame.',
        'Estoy estudiando para un examen.',
        ['verbs', 'study'],
      ),
      w(
        'it-sto-lavorando',
        'sto lavorando',
        'estoy trabajando',
        'Sto lavorando a casa.',
        'Estoy trabajando en casa.',
        ['verbs', 'work'],
      ),
      w(
        'it-universita',
        'università',
        'universidad',
        'Studio all’università.',
        'Estudio en la universidad.',
        ['study', 'places'],
        {
          acceptedTranslations: ['facultad'],
          emoji: '🏛️',
        },
      ),
      w(
        'it-esame',
        'esame',
        'examen',
        'Domani ho un esame.',
        'Mañana tengo un examen.',
        ['study'],
        { acceptedTexts: ['esami'] },
      ),
      w(
        'it-da-due-anni',
        'da due anni',
        'desde hace dos años',
        'Lavoro qui da due anni.',
        'Trabajo aquí desde hace dos años.',
        ['time'],
        {
          acceptedTranslations: ['hace dos años que'],
        },
      ),
      w(
        'it-attualmente',
        'attualmente',
        'actualmente',
        'Attualmente lavoro in un negozio.',
        'Actualmente trabajo en una tienda.',
        ['time', 'work'],
        {
          acceptedTranslations: ['en este momento', 'ahora'],
        },
      ),
      w(
        'it-colloquio',
        'colloquio',
        'entrevista (de trabajo)',
        'Domani ho un colloquio.',
        'Mañana tengo una entrevista.',
        ['work'],
        {
          acceptedTranslations: ['entrevista'],
        },
      ),
      w(
        'it-stipendio',
        'stipendio',
        'sueldo',
        'Lo stipendio è buono.',
        'El sueldo es bueno.',
        ['work'],
        {
          acceptedTranslations: ['salario'],
          emoji: '💰',
        },
      ),
      w(
        'it-orario',
        'orario',
        'horario',
        'L’orario è dalle nove alle cinque.',
        'El horario es de nueve a cinco.',
        ['work', 'time'],
      ),
      w('it-capo', 'capo', 'jefe', 'Il mio capo è simpatico.', 'Mi jefe es simpático.', ['work'], {
        acceptedTranslations: ['jefa'],
      }),
      w(
        'it-colleghi',
        'colleghi',
        'compañeros de trabajo',
        'I colleghi sono simpatici.',
        'Los compañeros son simpáticos.',
        ['work'],
        {
          acceptedTexts: ['collega', 'colleghe'],
          acceptedTranslations: ['colegas', 'compañeros'],
        },
      ),
      w(
        'it-devi',
        'devi',
        'tienes que',
        'Devi studiare di più.',
        'Tienes que estudiar más.',
        ['verbs'],
        { acceptedTranslations: ['debés', 'debes', 'tenés que'] },
      ),
      w(
        'it-dobbiamo',
        'dobbiamo',
        'tenemos que',
        'Dobbiamo finire oggi.',
        'Tenemos que terminar hoy.',
        ['verbs'],
      ),
      w('it-puo', 'può', 'puede', 'Il capo può venire domani.', 'El jefe puede venir mañana.', [
        'verbs',
      ]),
      w(
        'it-laurea',
        'laurea',
        'título universitario',
        'Ho una laurea in economia.',
        'Tengo un título en economía.',
        ['study'],
        {
          acceptedTranslations: ['título', 'licenciatura'],
          emoji: '🎓',
        },
      ),
      w(
        'it-mi-sono-laureato',
        'mi sono laureato',
        'me recibí',
        'Mi sono laureato a Padova.',
        'Me recibí en Padua.',
        ['study', 'past'],
        {
          acceptedTexts: ['mi sono laureata'],
          acceptedTranslations: ['me gradué'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Sto studiando',
        objective: 'Decir qué estás haciendo en este momento.',
        intro: {
          explanation:
            'Para «estoy haciendo» se usa stare en presente + gerundio: sto studiando, sta lavorando. Es como en español, pero se usa un poco menos: muchas veces alcanza el presente (studio all’università).',
          examples: [
            { target: 'Sto studiando per un esame.', base: 'Estoy estudiando para un examen.' },
            { target: 'Mia sorella sta lavorando.', base: 'Mi hermana está trabajando.' },
          ],
        },
        takeaways: [
          'Dices qué estás haciendo: sto + -ando / -endo.',
          'Hablas de la universidad y los exámenes.',
        ],
        exercises: [
          ex.translationChoice(
            'sto studiando',
            'estoy estudiando',
            ['estudié', 'estudiaba', 'voy a estudiar'],
            ['it-sto-studiando'],
            {
              id: 'it.ex.0euvxfiu44c11e',
            },
          ),
          ex.translationChoice(
            'esame',
            'examen',
            ['ensayo', 'ejercicio', 'asamblea'],
            ['it-esame'],
            { id: 'it.ex.c07ph1jigmbxly' },
          ),
          ex.listenChoice(
            'Sto studiando per un esame.',
            [
              'Sto lavorando per un esame.',
              'Ho studiato per un esame.',
              'Sto studiando per domani.',
            ],
            ['it-sto-studiando', 'it-esame'],
            { id: 'it.ex.r5lz6y012thhaj' },
          ),
          ex.fillBlank(
            'Sto ___ all’università.',
            'Estoy estudiando en la universidad.',
            'studiando',
            ['studio', 'studiare', 'studi'],
            ['it-sto-studiando', 'it-universita'],
            {
              id: 'it.ex.yq2r8zcc9jewfh',
            },
          ),
          ex.fillBlank(
            'Mia sorella sta ___ in un negozio.',
            'Mi hermana está trabajando en una tienda.',
            'lavorando',
            ['lavora', 'lavoro', 'lavorare'],
            ['it-sto-lavorando', 'it-negozio'],
            {
              id: 'it.ex.hvgm80w11tjacy',
            },
          ),
          question(
            'it.ex.3d8j68jra4y7qh',
            STUDENTESSA,
            '¿Qué estudia Irene?',
            'Medicina, en la Universidad de Padua',
            ['Economía, en Padua', 'Medicina, en un hospital de Roma', 'Italiano, en una escuela'],
            ['it-sto-studiando', 'it-universita'],
            'Irene escribe: «sto studiando Medicina all’università di Padova».',
          ),
          question(
            'it.ex.17k6paz0i9qq6v',
            STUDENTESSA,
            '¿Qué tiene esta semana?',
            'Tres exámenes',
            ['Una entrevista', 'Vacaciones', 'Un examen'],
            ['it-esame', 'it-devo'],
            'Irene escribe: «Questa settimana ho tre esami: devo studiare tanto!».',
          ),
          ex.shortAnswer(
            'Cosa stai facendo?',
            '¿Qué estás haciendo? (Responde que estás estudiando.)',
            'Sto studiando.',
            ['Sto studiando per un esame.', 'Io sto studiando.'],
            ['it-sto-studiando'],
            { id: 'it.ex.6td9ixwbi29v2a' },
          ),
          ex.translateWrite('Estoy trabajando.', 'Sto lavorando.', ['it-sto-lavorando'], {
            id: 'it.ex.e4ogmwyayxdfoo',
            acceptedAnswers: ['Io sto lavorando.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Da due anni',
        objective: 'Decir desde hace cuánto haces algo.',
        intro: {
          explanation:
            'Para algo que empezó antes y sigue ahora: presente + da + tiempo. Lavoro qui da due anni = trabajo aquí desde hace dos años. Ojo: con algo terminado se usa fa (sono arrivato due anni fa). Attualmente es «actualmente, en este momento».',
          examples: [
            {
              target: 'Studio italiano da due anni.',
              base: 'Estudio italiano desde hace dos años.',
            },
            {
              target: 'Attualmente lavoro in un negozio.',
              base: 'Actualmente trabajo en una tienda.',
            },
          ],
        },
        takeaways: ['Dices desde cuándo: presente + da.', 'Distingues da due anni de due anni fa.'],
        exercises: [
          ex.translationChoice(
            'da due anni',
            'desde hace dos años',
            ['hace dos años', 'dentro de dos años', 'durante dos días'],
            ['it-da-due-anni'],
            {
              id: 'it.ex.wcoii3eghofa2u',
              explanation:
                'Da + tiempo con el presente: algo que sigue. Hace dos años (y terminó) es due anni fa.',
            },
          ),
          ex.fillBlank(
            'Lavoro qui ___ tre anni.',
            'Trabajo aquí desde hace tres años.',
            'da',
            ['fa', 'tra', 'per'],
            ['it-da-due-anni'],
            {
              id: 'it.ex.nhbq0s8ns2tp50',
              explanation: 'Presente + da: lavoro qui da tre anni (y sigo).',
            },
          ),
          ex.fillBlank(
            'Sono arrivato in Italia due anni ___.',
            'Llegué a Italia hace dos años.',
            'fa',
            ['da', 'tra', 'prima'],
            ['it-fa', 'it-sono-arrivato'],
            {
              id: 'it.ex.d4etgj1lce0jhl',
              explanation: 'Algo terminado: passato prossimo + fa.',
            },
          ),
          ex.translationChoice(
            'attualmente',
            'actualmente',
            ['en realidad', 'actualizado', 'al final'],
            ['it-attualmente'],
            {
              id: 'it.ex.jejw42jn5pce0u',
              explanation: 'Attualmente es «actualmente, en este momento», como en español.',
            },
          ),
          ex.listenChoice(
            'Studio italiano da due anni.',
            [
              'Studio italiano da tre anni.',
              'Ho studiato italiano due anni fa.',
              'Studio inglese da due anni.',
            ],
            ['it-da-due-anni', 'it-studio'],
            { id: 'it.ex.y33vopkfkezo5z' },
          ),
          question(
            'it.ex.sev2rzcli7wzim',
            COLLOQUIO,
            '¿Qué hace Tommaso actualmente?',
            'Trabaja en una zapatería desde hace dos años',
            ['Estudia desde hace dos años', 'Trabajó en una zapatería hace dos años', 'No trabaja'],
            ['it-attualmente', 'it-da-due-anni'],
            'Tommaso dice: «Attualmente lavoro in un negozio di scarpe, da due anni».',
          ),
          question(
            'it.ex.lkpcwf1yy5cagu',
            COLLOQUIO,
            '¿Por qué quiere cambiar de trabajo?',
            'Por el horario: trabaja también los domingos',
            ['Por el sueldo', 'Porque no le gusta la gente', 'Porque se muda'],
            ['it-orario'],
            'Tommaso dice: «l’orario è difficile: lavoro anche la domenica».',
          ),
          ex.orderWords(
            'Attualmente lavoro in un negozio.',
            'Actualmente trabajo en una tienda.',
            ['it-attualmente', 'it-negozio'],
            {
              id: 'it.ex.o3tlba5tdgcs33',
            },
          ),
          ex.shortAnswer(
            'Da quanto tempo studi italiano?',
            '¿Desde hace cuánto estudias italiano? (Responde que desde hace dos años.)',
            'Studio italiano da due anni.',
            ['Da due anni.', 'Studio italiano da due anni!'],
            ['it-da-due-anni'],
            { id: 'it.ex.ttkwyddbhokkk5' },
          ),
          ex.translateWrite(
            'Trabajo en la oficina desde hace un año.',
            'Lavoro in ufficio da un anno.',
            ['it-da-due-anni', 'it-ufficio'],
            {
              id: 'it.ex.nw9j4r3m46dxqw',
              acceptedAnswers: ['Lavoro in un ufficio da un anno.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Il colloquio e lo stipendio',
        objective: 'Entender un aviso y una entrevista de trabajo.',
        intro: {
          explanation:
            'El vocabulario del trabajo: il colloquio es la entrevista (no un «coloquio»), lo stipendio es el sueldo, l’orario es el horario y il capo, el jefe o la jefa. En los avisos vas a leer cercasi (se busca).',
          examples: [
            { target: 'Domani ho un colloquio.', base: 'Mañana tengo una entrevista.' },
            { target: 'Lo stipendio è buono.', base: 'El sueldo es bueno.' },
          ],
        },
        takeaways: ['Sabes que colloquio es «entrevista».', 'Entiendes un aviso de trabajo.'],
        exercises: [
          ex.translationChoice(
            'colloquio',
            'entrevista (de trabajo)',
            ['colegio', 'congreso', 'reunión de amigos'],
            ['it-colloquio'],
            {
              id: 'it.ex.umyue15fxl8ir6',
              explanation: 'Il colloquio di lavoro es la entrevista de trabajo.',
            },
          ),
          ex.matchPairs(
            [
              ['colloquio', 'entrevista'],
              ['stipendio', 'sueldo'],
              ['orario', 'horario'],
              ['capo', 'jefe'],
            ],
            ['it-colloquio', 'it-stipendio', 'it-orario', 'it-capo'],
            { id: 'it.ex.tkhmqjyh3629cg' },
          ),
          ex.listenChoice(
            'Ho un colloquio domani alle dieci.',
            [
              'Ho un esame domani alle dieci.',
              'Ho un colloquio oggi alle dieci.',
              'Ho un colloquio domani alle due.',
            ],
            ['it-colloquio'],
            { id: 'it.ex.5ei7dtfeh8gaig' },
          ),
          ex.fillBlank(
            'Il mio ___ è molto simpatico.',
            'Mi jefe es muy simpático.',
            'capo',
            ['stipendio', 'orario', 'colloquio'],
            ['it-capo'],
            {
              id: 'it.ex.n8fd88jrhcmu9k',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.9f5evt9yys5yso',
            ANNUNCIO,
            '¿Qué buscan en el restaurante?',
            'Un mesero o una mesera',
            ['Un cocinero', 'Un jefe de cocina', 'Un vendedor'],
            ['it-cameriere'],
            'El aviso dice: «Cercasi cameriere o cameriera per ristorante in centro».',
          ),
          question(
            'it.ex.j0tvar4tic4vaa',
            ANNUNCIO,
            '¿Cuál es el horario?',
            'De martes a domingo, a la noche',
            [
              'De lunes a viernes, a la mañana',
              'Sólo los fines de semana',
              'Todos los días, a la tarde',
            ],
            ['it-orario'],
            'El aviso dice: «Orario: dal martedì alla domenica, la sera».',
          ),
          question(
            'it.ex.ieczux9s6rb9dr',
            ANNUNCIO,
            '¿Qué hay que hacer para tener una entrevista?',
            'Pasar por el restaurante después de las tres',
            ['Mandar un correo', 'Llamar a la mañana', 'Tener experiencia'],
            ['it-colloquio', 'it-stipendio'],
            'El aviso dice: «Per un colloquio, passate dopo le tre».',
          ),
          ex.shortAnswer(
            'Com’è il tuo orario?',
            '¿Cómo es tu horario? (Responde que trabajas de nueve a cinco.)',
            'Lavoro dalle nove alle cinque.',
            ['Dalle nove alle cinque.', 'Il mio orario è dalle nove alle cinque.'],
            ['it-orario'],
            { id: 'it.ex.4683bbbowot53j' },
          ),
          ex.translateWrite(
            'Mañana tengo una entrevista.',
            'Domani ho un colloquio.',
            ['it-colloquio', 'it-domani'],
            { id: 'it.ex.0fohuu222py765' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Devi, dobbiamo, può',
        objective: 'Decir lo que tienes que hacer y lo que se puede.',
        intro: {
          explanation:
            'Dovere (tener que): devo, devi, deve, dobbiamo, dovete, devono. Potere: posso, puoi, può, possiamo, potete, possono. Van con infinitivo: dobbiamo finire, può venire.',
          examples: [
            { target: 'Dobbiamo finire oggi.', base: 'Tenemos que terminar hoy.' },
            { target: 'Il capo può venire domani?', base: '¿El jefe puede venir mañana?' },
          ],
        },
        takeaways: ['Conjugas dovere y potere.', 'Hablas de tus compañeros y tu jefe.'],
        exercises: [
          ex.translationChoice(
            'dobbiamo',
            'tenemos que',
            ['podemos', 'queremos', 'vamos a'],
            ['it-dobbiamo'],
            { id: 'it.ex.m7z0fzhwfiual0' },
          ),
          ex.fillBlank(
            'Tu ___ studiare di più.',
            'Tú tienes que estudiar más.',
            'devi',
            ['devo', 'dobbiamo', 'può'],
            ['it-devi'],
            { id: 'it.ex.hw1t87nvmfqmtv' },
          ),
          ex.fillBlank(
            'Il capo ___ venire domani?',
            '¿El jefe puede venir mañana?',
            'può',
            ['posso', 'puoi', 'devi'],
            ['it-puo', 'it-capo'],
            { id: 'it.ex.uk0l3110t99ilk' },
          ),
          ex.listenChoice(
            'Dobbiamo finire oggi.',
            ['Dobbiamo finire domani.', 'Devo finire oggi.', 'Possiamo finire oggi.'],
            ['it-dobbiamo'],
            { id: 'it.ex.s24dtk7gynxtfe' },
          ),
          ex.fillBlank(
            'I miei ___ sono simpatici.',
            'Mis compañeros de trabajo son simpáticos.',
            'colleghi',
            ['capi', 'stipendi', 'orari'],
            ['it-colleghi'],
            {
              id: 'it.ex.iisrs8mfltryym',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.e824zo5he4gxzn',
            UFFICIO,
            '¿Por qué Marco no puede ir a almorzar?',
            'Está trabajando en un proyecto que tienen que terminar hoy',
            ['Tiene una entrevista', 'Está enfermo', 'Ya almorzó'],
            ['it-sto-lavorando', 'it-dobbiamo'],
            'Marco dice: «sto lavorando a un progetto per il capo. Dobbiamo finire oggi».',
          ),
          question(
            'it.ex.0yetlcfndlq21c',
            UFFICIO,
            '¿Qué le gusta a Marco de su trabajo?',
            'El sueldo y los compañeros',
            ['El jefe y el horario', 'El proyecto', 'Nada'],
            ['it-stipendio', 'it-colleghi'],
            'Marco dice: «lo stipendio è buono e i colleghi sono simpatici».',
          ),
          ex.shortAnswer(
            'Puoi venire stasera?',
            '¿Puedes venir esta noche? (Responde que no, que tienes que trabajar.)',
            'No, devo lavorare.',
            [
              'No, mi dispiace, devo lavorare.',
              'Mi dispiace, devo lavorare.',
              'No, mi dispiace: devo lavorare.',
            ],
            ['it-devo'],
            { id: 'it.ex.wltzlm80j5t92s' },
          ),
          ex.translateWrite(
            'Tenemos que terminar hoy.',
            'Dobbiamo finire oggi.',
            ['it-dobbiamo', 'it-oggi'],
            { id: 'it.ex.mbxljbn9tvmex5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi sono laureato',
        objective: 'Hablar de tus estudios y de lo que haces hoy.',
        intro: {
          explanation:
            'La laurea es el título universitario; laurearsi es recibirse: mi sono laureato / laureata (me recibí). Para presentarte en lo profesional: mi sono laureato in…, attualmente lavoro…, da…',
          examples: [
            { target: 'Mi sono laureata due anni fa.', base: 'Me recibí hace dos años.' },
            { target: 'Ho una laurea in economia.', base: 'Tengo un título en economía.' },
          ],
        },
        takeaways: [
          'Dices que te recibiste: mi sono laureato / laureata.',
          'Te presentas en lo profesional.',
        ],
        exercises: [
          ex.translationChoice(
            'laurea',
            'título universitario',
            ['laurel', 'lectura', 'clase'],
            ['it-laurea'],
            { id: 'it.ex.l3vx7vk6p1hinu' },
          ),
          ex.translationChoice(
            'mi sono laureato',
            'me recibí',
            ['me lavé', 'me levanté', 'me cansé'],
            ['it-mi-sono-laureato'],
            {
              id: 'it.ex.fxb4casg75be2v',
            },
          ),
          ex.listenChoice(
            'Mi sono laureata due anni fa.',
            [
              'Mi sono laureata tre anni fa.',
              'Mi sono laureato due anni fa.',
              'Studio da due anni.',
            ],
            ['it-mi-sono-laureato', 'it-fa'],
            { id: 'it.ex.enwedp7pk1s0tj' },
          ),
          ex.fillBlank(
            'Mio fratello si è ___ a Padova.',
            'Mi hermano se recibió en Padua.',
            'laureato',
            ['laureata', 'laurea', 'laureati'],
            ['it-mi-sono-laureato'],
            {
              id: 'it.ex.n49pd273fuihen',
              explanation:
                'Laurearsi va con essere: el participio concuerda (mio fratello si è laureato).',
            },
          ),
          question(
            'it.ex.2q9qp8vtx7fc1u',
            STUDENTESSA,
            '¿Qué va a hacer Irene cuando se reciba?',
            'Buscar trabajo en un hospital',
            ['Estudiar otra carrera', 'Viajar', 'Trabajar en la universidad'],
            ['it-laurea', 'it-tra'],
            'Irene escribe: «Tra un anno mi laureo e poi cercherò lavoro in un ospedale».',
          ),
          ex.orderWords(
            'Mi sono laureata a Padova.',
            'Me recibí en Padua.',
            ['it-mi-sono-laureato'],
            { id: 'it.ex.yhk0myztg31srd' },
          ),
          ex.shortAnswer(
            'Cosa fai attualmente?',
            '¿Qué haces actualmente? (Responde que estás estudiando en la universidad.)',
            'Attualmente sto studiando all’università.',
            [
              "Sto studiando all'università.",
              'Sto studiando all’università.',
              "Attualmente studio all'università.",
              'Attualmente studio all’università.',
            ],
            ['it-attualmente', 'it-universita'],
            { id: 'it.ex.9izeklp9tpz9n3' },
          ),
          ex.translateWrite(
            'Me recibí el año pasado.',
            "Mi sono laureato l'anno scorso.",
            ['it-mi-sono-laureato', 'it-scorso'],
            {
              id: 'it.ex.dl43zr1ecth7q6',
              acceptedAnswers: [
                'Mi sono laureata l’anno scorso.',
                "Mi sono laureata l'anno scorso.",
                'Mi sono laureato l’anno scorso.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
