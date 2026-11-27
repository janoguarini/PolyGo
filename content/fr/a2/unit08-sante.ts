import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U8 «Salud y bienestar» (docs/FR_A1_A2.md): decir qué te duele con avoir mal à y la
 * contracción (à la tête, au dos, aux dents); je me sens bien / mal; malade, fatigué, en forme; en la
 * consulta y en la farmacia con vous (vous avez mal où?, depuis quand?); el imperativo con vous y
 * con pronominales (reposez-vous, buvez de l'eau, ne mangez pas trop). Géneros distintos: le dos,
 * la dent. Pronunciación: il / elle, la liaison de aux yeux, s final muda (le dos, le bras).
 * Cultura: el médico receta (l'ordonnance) y la farmacia la despacha.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FATIGUE = dialogue('fr.stim.a2-u8-fatigue', 'Julie se cruza con su amigo Thomas.', [
  ['Julie', 'Salut, Thomas! Tu es en forme?'],
  ['Thomas', 'Pas du tout. Je me sens très fatigué.'],
  ['Julie', 'Tu es malade?'],
  ['Thomas', "Oui, j'ai un rhume et j'ai mal à la gorge depuis deux jours."],
  ['Julie', 'Il faut aller chez le médecin!'],
  ['Thomas', "Oui, j'ai rendez-vous demain matin."],
]);

const CONSULTATION = dialogue(
  'fr.stim.a2-u8-consultation',
  'Thomas en la consulta del doctor Morel.',
  [
    ['Morel', 'Bonjour, monsieur. Vous avez mal où?'],
    ['Thomas', "J'ai mal à la gorge et à la tête."],
    ['Morel', 'Depuis quand?'],
    ['Thomas', "Depuis deux jours. Et j'ai un peu de fièvre."],
    ['Morel', "C'est un rhume. Voici votre ordonnance: prenez ce médicament le matin et le soir."],
  ],
);

const MESSAGE = reading(
  'fr.stim.a2-u8-message',
  'message',
  'Thomas le escribe a Julie después del médico.',
  [
    'Salut, Julie!',
    'Je suis allé chez le médecin ce matin.',
    "J'ai un rhume et un peu de fièvre, mais ce n'est pas grave.",
    "Le médecin dit: «Reposez-vous, buvez beaucoup d'eau et prenez le médicament le soir.»",
    'Je ne peux pas aller au travail pendant trois jours.',
    'Demain, je serai à la maison: tu peux venir?',
    'Thomas',
  ],
  { from: 'Thomas', to: 'Julie' },
);

export const FR_A2_U08: FrUnitDef = {
  names: ['Julie', 'Thomas', 'Morel', 'Claire', 'Paul'],
  support: ['trop', 'buvez', 'grave'],
  unit: {
    position: 8,
    title: 'Salud y bienestar',
    titleEn: 'La santé',
    description:
      "Avoir mal à con contracción (à la tête, au dos, aux dents); je me sens bien / mal; en la consulta y en la farmacia (vous avez mal où?, depuis quand?); el imperativo con vous (reposez-vous, buvez de l'eau). Géneros distintos: le dos, la dent.",
    emoji: '🩺',
    objective:
      'Puedes decir qué te duele y cómo te sientes, explicarle al médico desde cuándo estás mal y entender y dar consejos de salud.',
    grammar: {
      title: 'Avoir mal à · el imperativo con vous',
      explanation:
        "Para decir qué te duele: avoir mal à + parte del cuerpo con artículo, y à se contrae con le y les: à + le = au (j'ai mal au dos), à + les = aux (j'ai mal aux dents); con la no cambia (à la tête, à la gorge). Ojo con los géneros: le dos (la espalda) es masculino y la dent (el diente), femenino. Para aconsejar con vous se usa el imperativo, que es la forma de vous sin el pronombre: prenez, buvez; en negativo, ne mangez pas trop. Con un verbo pronominal, el pronombre va después, con guion: reposez-vous.",
      examples: [
        { target: "J'ai mal au dos.", base: 'Me duele la espalda.' },
        { target: 'Elle a mal aux dents.', base: 'A ella le duelen los dientes.' },
        { target: "Reposez-vous et buvez de l'eau.", base: 'Descanse y tome agua.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U8). Sin revisión nativa: revisar «Vous avez mal où?» como pregunta oral del médico (más formal: Où avez-vous mal?) y «le ventre» traducido como «la panza». Las formas del imperativo (prenez, buvez, mangez) van en el apoyo.',
    },
    words: [
      w('fr-j-ai-mal-a', "j'ai mal à…", 'me duele…', "J'ai mal à la tête.", 'Me duele la cabeza.', [
        'health',
      ]),
      w(
        'fr-la-tete',
        'la tête',
        'la cabeza',
        "J'ai mal à la tête depuis hier.",
        'Me duele la cabeza desde ayer.',
        ['body', 'f'],
      ),
      w(
        'fr-le-dos',
        'le dos',
        'la espalda',
        'Mon père a mal au dos.',
        'A mi papá le duele la espalda.',
        ['body', 'm'],
      ),
      w(
        'fr-le-ventre',
        'le ventre',
        'la panza',
        "J'ai mal au ventre: j'ai trop mangé.",
        'Me duele la panza: comí demasiado.',
        ['body', 'm'],
        { acceptedTranslations: ['el estómago', 'el vientre'] },
      ),
      w(
        'fr-la-gorge',
        'la gorge',
        'la garganta',
        'Elle a mal à la gorge.',
        'A ella le duele la garganta.',
        ['body', 'f'],
      ),
      w(
        'fr-les-dents',
        'les dents',
        'los dientes',
        'Mon fils a mal aux dents.',
        'A mi hijo le duelen los dientes.',
        ['body'],
      ),
      w(
        'fr-la-jambe',
        'la jambe',
        'la pierna',
        "Je suis tombé: j'ai mal à la jambe.",
        'Me caí: me duele la pierna.',
        ['body', 'f'],
      ),
      w(
        'fr-le-bras',
        'le bras',
        'el brazo',
        'Il a mal au bras depuis lundi.',
        'Le duele el brazo desde el lunes.',
        ['body', 'm'],
      ),
      w(
        'fr-la-fievre',
        'la fièvre',
        'la fiebre',
        "J'ai de la fièvre.",
        'Tengo fiebre.',
        ['health', 'f'],
        { emoji: '🤒' },
      ),
      w(
        'fr-le-rhume',
        'le rhume',
        'el resfrío',
        "J'ai un rhume.",
        'Estoy resfriado.',
        ['health', 'm'],
        { acceptedTranslations: ['el resfriado'] },
      ),
      w(
        'fr-le-medicament',
        'le médicament',
        'el remedio',
        'Prenez le médicament le matin.',
        'Tome el remedio por la mañana.',
        ['health', 'm'],
        { acceptedTranslations: ['el medicamento'], emoji: '💊' },
      ),
      w(
        'fr-l-ordonnance',
        "l'ordonnance",
        'la receta (médica)',
        'Voici votre ordonnance, madame.',
        'Aquí tiene su receta, señora.',
        ['health', 'f'],
        { acceptedTranslations: ['la receta'] },
      ),
      w(
        'fr-je-me-sens',
        'je me sens',
        'me siento',
        "Aujourd'hui, je me sens bien.",
        'Hoy me siento bien.',
        ['health', 'verbs'],
      ),
      w(
        'fr-malade',
        'malade',
        'enfermo',
        "Je suis malade aujourd'hui.",
        'Hoy estoy enfermo.',
        ['health'],
        { acceptedTranslations: ['enferma'] },
      ),
      w(
        'fr-fatigue',
        'fatigué',
        'cansado',
        'Je suis très fatiguée ce soir.',
        'Esta noche estoy muy cansada.',
        ['health'],
        { acceptedTranslations: ['cansada'], acceptedTexts: ['fatiguée'] },
      ),
      w(
        'fr-reposez-vous',
        'reposez-vous',
        'descanse',
        'Vous êtes fatigué: reposez-vous!',
        'Está cansado: ¡descanse!',
        ['health', 'imperative'],
        { acceptedTranslations: ['descansen', 'descansá', 'descansa'] },
      ),
      w(
        'fr-en-forme',
        'en forme',
        'en forma',
        "Aujourd'hui, je suis en forme!",
        '¡Hoy estoy con todas las pilas!',
        ['health'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "J'ai mal à la tête",
        objective: 'Decir qué te duele: la cabeza, la espalda, la panza, la garganta.',
        intro: {
          explanation:
            "Para decir qué te duele: j'ai mal à + la parte del cuerpo con artículo. À + le se contrae en au (j'ai mal au dos, au ventre); à la no cambia (à la tête, à la gorge). Ojo: le dos (la espalda) es masculino. Con otra persona: il a mal, elle a mal. Pronunciación: en dos, la s final no suena, e il y elle se distinguen por la vocal y la l final de elle.",
          examples: [
            { target: "J'ai mal à la tête.", base: 'Me duele la cabeza.' },
            { target: 'Mon père a mal au dos.', base: 'A mi papá le duele la espalda.' },
          ],
        },
        takeaways: [
          "Dices qué te duele con j'ai mal à.",
          'Usas au con masculinos y à la con femeninos.',
        ],
        exercises: [
          ex.translationChoice(
            "j'ai mal à…",
            'me duele…',
            ['me siento', 'tengo miedo', 'estoy libre'],
            ['fr-j-ai-mal-a'],
            { id: 'fr.ex.0mdapv9dg8srg9' },
          ),
          ex.matchPairs(
            [
              ['la tête', 'la cabeza'],
              ['le dos', 'la espalda'],
              ['le ventre', 'la panza'],
              ['la gorge', 'la garganta'],
            ],
            ['fr-la-tete', 'fr-le-dos', 'fr-le-ventre', 'fr-la-gorge'],
            { id: 'fr.ex.0kkd2oufyy59lr' },
          ),
          ex.listenChoice(
            'Elle a mal à la tête.',
            ['Il a mal à la tête.', 'Elle a mal à la gorge.', 'Elle a mal au dos.'],
            ['fr-j-ai-mal-a', 'fr-la-tete'],
            {
              id: 'fr.ex.u2ca2wdfd4a07v',
              explanation: 'Elle termina con una l que suena; il tiene otra vocal.',
            },
          ),
          ex.fillBlank(
            "J'ai mal ___ dos.",
            'Me duele la espalda.',
            'au',
            ['à la', 'aux'],
            ['fr-j-ai-mal-a', 'fr-le-dos'],
            {
              id: 'fr.ex.0e1p1k6e4q42l5',
              explanation: "Le dos es masculino: à + le = au. J'ai mal au dos.",
            },
          ),
          ex.fillBlank(
            'Elle a mal ___ gorge.',
            'A ella le duele la garganta.',
            'à la',
            ['au', 'aux'],
            ['fr-j-ai-mal-a', 'fr-la-gorge'],
            {
              id: 'fr.ex.vh5ersc1r5egww',
              explanation: 'La gorge es femenino: à la gorge, sin contracción.',
            },
          ),
          ex.translationChoice(
            'le dos',
            'la espalda',
            ['la cabeza', 'la panza', 'la garganta'],
            ['fr-le-dos'],
            {
              id: 'fr.ex.srr4v6lp7jrfjt',
              explanation: 'Le dos es masculino en francés, aunque la espalda sea femenino.',
            },
          ),
          ex.translationChoice(
            'le ventre',
            'la panza',
            ['la espalda', 'la garganta', 'la cabeza'],
            ['fr-le-ventre'],
            { id: 'fr.ex.8dapeu3kjkgdh4' },
          ),
          ex.orderWords(
            'Mon père a mal au dos.',
            'A mi papá le duele la espalda.',
            ['fr-j-ai-mal-a', 'fr-le-dos'],
            { id: 'fr.ex.v88rtvnxs1l3sp' },
          ),
          ex.translateWrite(
            'Me duele la cabeza.',
            "J'ai mal à la tête.",
            ['fr-j-ai-mal-a', 'fr-la-tete'],
            { id: 'fr.ex.fpqwqun1pwqtdz' },
          ),
          ex.shortAnswer(
            'Tu as mal où?',
            '¿Dónde te duele? (Responde que te duele la garganta.)',
            "J'ai mal à la gorge.",
            ['À la gorge.'],
            ['fr-j-ai-mal-a', 'fr-la-gorge'],
            { id: 'fr.ex.lk4sipl8wkgwyn' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Un rhume et de la fièvre',
        objective:
          'Hablar de los dientes, la pierna y el brazo, y decir que tienes fiebre o un resfrío.',
        intro: {
          explanation:
            "À + les se contrae en aux: j'ai mal aux dents. Delante de vocal hay liaison: aux yeux se une con un sonido z. La dent (el diente) es femenino. Para la fiebre y el resfrío se usa avoir: j'ai de la fièvre (tengo fiebre), j'ai un rhume (estoy resfriado). En bras, la s final no suena.",
          examples: [
            { target: "J'ai mal aux dents.", base: 'Me duelen los dientes.' },
            { target: "J'ai un rhume et de la fièvre.", base: 'Estoy resfriado y tengo fiebre.' },
          ],
        },
        takeaways: [
          'Usas aux con los plurales: aux dents, aux yeux.',
          "Dices j'ai de la fièvre y j'ai un rhume.",
        ],
        exercises: [
          ex.translationChoice(
            'les dents',
            'los dientes',
            ['las piernas', 'los brazos', 'la garganta'],
            ['fr-les-dents'],
            { id: 'fr.ex.5gthskftkav6j2' },
          ),
          ex.listenChoice(
            "J'ai mal aux yeux.",
            ["J'ai mal au dos.", "J'ai mal aux dents.", "J'ai mal à la jambe."],
            ['fr-j-ai-mal-a', 'fr-les-dents', 'fr-le-dos', 'fr-la-jambe'],
            {
              id: 'fr.ex.uk6aviualvizu5',
              explanation: 'En aux yeux hay liaison: se oye un sonido z antes de yeux.',
            },
          ),
          ex.fillBlank(
            "J'ai mal ___ dents.",
            'Me duelen los dientes.',
            'aux',
            ['au', 'à la'],
            ['fr-j-ai-mal-a', 'fr-les-dents'],
            {
              id: 'fr.ex.y8nqqx2h90hbjm',
              explanation: "Con un plural: à + les = aux. J'ai mal aux dents.",
            },
          ),
          ex.matchPairs(
            [
              ['les dents', 'los dientes'],
              ['la jambe', 'la pierna'],
              ['le bras', 'el brazo'],
              ['la fièvre', 'la fiebre'],
            ],
            ['fr-les-dents', 'fr-la-jambe', 'fr-le-bras', 'fr-la-fievre'],
            { id: 'fr.ex.56u5wzbymc34hs' },
          ),
          ex.fillBlank(
            "J'ai ___ fièvre.",
            'Tengo fiebre.',
            'de la',
            ['du', 'le'],
            ['fr-la-fievre'],
            {
              id: 'fr.ex.vhan0fht565qpe',
              explanation: 'La fièvre es femenino y se cuenta como cantidad: de la fièvre.',
            },
          ),
          ex.translationChoice(
            'le rhume',
            'el resfrío',
            ['la fiebre', 'la garganta', 'el brazo'],
            ['fr-le-rhume'],
            { id: 'fr.ex.77rdc7fb9gazx6' },
          ),
          ex.translationChoice(
            'la jambe',
            'la pierna',
            ['el brazo', 'la espalda', 'los dientes'],
            ['fr-la-jambe'],
            { id: 'fr.ex.sw2f6oa8rsakox' },
          ),
          ex.orderWords(
            "J'ai un rhume depuis lundi.",
            'Estoy resfriado desde el lunes.',
            ['fr-le-rhume', 'fr-depuis'],
            { id: 'fr.ex.ps880hp8658twp' },
          ),
          ex.translateWrite('Tengo fiebre.', "J'ai de la fièvre.", ['fr-la-fievre'], {
            id: 'fr.ex.bxl2rcmirw4dpz',
          }),
          ex.shortAnswer(
            'Ça va?',
            '¿Cómo va? (Responde que no: que estás resfriado.)',
            "Non, j'ai un rhume.",
            ["Non, ça ne va pas. J'ai un rhume.", "J'ai un rhume."],
            ['fr-le-rhume'],
            { id: 'fr.ex.ibbaywznmmk5ll' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Je me sens fatigué',
        objective: 'Decir cómo te sientes: bien, mal, cansado, enfermo o en forma.',
        intro: {
          explanation:
            'Je me sens + adjetivo es me siento: je me sens bien, je me sens mal, je me sens fatigué. Malade es enfermo (je suis malade) y en forme, en forma o con energía. Fatigué concuerda: una mujer dice fatiguée, que suena igual.',
          examples: [
            { target: 'Je me sens très fatigué.', base: 'Me siento muy cansado.' },
            { target: "Aujourd'hui, je suis en forme!", base: '¡Hoy estoy con todas las pilas!' },
          ],
        },
        takeaways: ['Dices cómo te sientes con je me sens.', 'Usas malade, fatigué y en forme.'],
        exercises: [
          ex.translationChoice(
            'je me sens',
            'me siento',
            ['me duele…', 'me levanto', 'me acuesto'],
            ['fr-je-me-sens'],
            { id: 'fr.ex.jj3g9jk8vgsa3a' },
          ),
          ex.listenChoice(
            'Je me sens bien.',
            ['Je me sens mal.', 'Je me lève.', 'Je me couche.'],
            ['fr-je-me-sens'],
            { id: 'fr.ex.okwxwztju5ht5z' },
          ),
          ex.matchPairs(
            [
              ['je me sens', 'me siento'],
              ['malade', 'enfermo'],
              ['fatigué', 'cansado'],
              ['en forme', 'en forma'],
            ],
            ['fr-je-me-sens', 'fr-malade', 'fr-fatigue', 'fr-en-forme'],
            { id: 'fr.ex.ode3yrkf706zib' },
          ),
          ex.fillBlank(
            "Je suis ___: j'ai de la fièvre.",
            'Estoy enferma: tengo fiebre.',
            'malade',
            ['en forme', 'libre'],
            ['fr-malade'],
            { id: 'fr.ex.ixcur2tvwmc4u9', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Claire est très ___ ce soir.',
            'Claire está muy cansada esta noche.',
            'fatiguée',
            ['fatigué', 'fatigués'],
            ['fr-fatigue'],
            {
              id: 'fr.ex.7usojb7pxxyy8s',
              explanation: 'Claire es mujer: fatiguée, con una e más que no se pronuncia.',
            },
          ),
          question(
            'fr.ex.qoo1ccks918f21',
            FATIGUE,
            '¿Cómo se siente Thomas?',
            'Muy cansado.',
            ['En forma.', 'Bien, pero con hambre.', 'Un poco triste.'],
            ['fr-je-me-sens', 'fr-fatigue', 'fr-en-forme'],
            'Thomas responde «Pas du tout. Je me sens très fatigué».',
          ),
          question(
            'fr.ex.iret7tfdcm60hx',
            FATIGUE,
            '¿Desde cuándo le duele la garganta a Thomas?',
            'Desde hace dos días.',
            ['Desde ayer.', 'Desde hace una semana.', 'No le duele.'],
            ['fr-la-gorge', 'fr-malade'],
            "Thomas dice «j'ai mal à la gorge depuis deux jours».",
          ),
          ex.translationChoice(
            'en forme',
            'en forma',
            ['enfermo', 'cansado', 'me siento'],
            ['fr-en-forme'],
            { id: 'fr.ex.ukygg2wdzhk67v' },
          ),
          ex.translateWrite(
            'Me siento cansado.',
            'Je me sens fatigué.',
            ['fr-je-me-sens', 'fr-fatigue'],
            {
              id: 'fr.ex.khs9pvabh79mog',
              acceptedAnswers: ['Je me sens fatiguée.'],
            },
          ),
          ex.shortAnswer(
            "Tu es en forme aujourd'hui?",
            '¿Estás en forma hoy? (Responde que no, que estás enfermo.)',
            'Non, je suis malade.',
            ['Non, je me sens malade.', "Non, aujourd'hui je suis malade.", 'Je suis malade.'],
            ['fr-malade'],
            { id: 'fr.ex.esnmibtcslvj3p' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Chez le médecin',
        objective: 'Explicarle al médico qué te pasa y desde cuándo.',
        intro: {
          explanation:
            "En la consulta se usa vous: vous avez mal où? (¿dónde le duele?), depuis quand? (¿desde cuándo?). Se responde con depuis + presente: j'ai mal à la tête depuis hier. Cultura: en Francia, el médico te da l'ordonnance (la receta) y en la pharmacie, la de la cruz verde, te dan le médicament. Falso amigo: l'ordonnance no es una ordenanza.",
          examples: [
            { target: 'Vous avez mal où?', base: '¿Dónde le duele?' },
            { target: 'Voici votre ordonnance.', base: 'Aquí tiene su receta.' },
          ],
        },
        takeaways: [
          'Explicas qué te duele y desde cuándo con depuis.',
          "Entiendes l'ordonnance y le médicament.",
        ],
        exercises: [
          ex.translationChoice(
            'le médicament',
            'el remedio',
            ['la receta (médica)', 'la fiebre', 'el resfrío'],
            ['fr-le-medicament'],
            { id: 'fr.ex.j98d3qhdcub8ga' },
          ),
          ex.translationChoice(
            "l'ordonnance",
            'la receta (médica)',
            ['la ordenanza', 'el remedio', 'la farmacia'],
            ['fr-l-ordonnance'],
            {
              id: 'fr.ex.4jb23ejeis9gep',
              explanation: "Falso amigo: l'ordonnance es la receta del médico.",
            },
          ),
          ex.listenChoice(
            'Vous avez mal où?',
            ['Vous avez mal au dos?', 'Tu as mal où?', 'Vous allez où?'],
            ['fr-j-ai-mal-a'],
            { id: 'fr.ex.y8ov60hy9tm9q5' },
          ),
          ex.fillBlank(
            "J'ai mal à la tête ___ hier.",
            'Me duele la cabeza desde ayer.',
            'depuis',
            ['pendant', 'dans'],
            ['fr-depuis', 'fr-la-tete'],
            {
              id: 'fr.ex.x3ybvtuvmk8fad',
              explanation: 'Algo que empezó ayer y sigue: presente + depuis.',
            },
          ),
          question(
            'fr.ex.c6rnrvzjt2nqjk',
            CONSULTATION,
            '¿Qué le duele a Thomas?',
            'La garganta y la cabeza.',
            ['La espalda.', 'La panza y la cabeza.', 'Los dientes.'],
            ['fr-j-ai-mal-a', 'fr-la-gorge', 'fr-la-tete'],
            "Thomas dice «J'ai mal à la gorge et à la tête».",
          ),
          question(
            'fr.ex.qrb8f9s8vv3d9m',
            CONSULTATION,
            '¿Cuándo tiene que tomar el remedio?',
            'Por la mañana y por la noche.',
            ['Sólo por la mañana.', 'Al mediodía.', 'Cuando le duela la cabeza.'],
            ['fr-le-medicament', 'fr-l-ordonnance'],
            'El médico dice «prenez ce médicament le matin et le soir».',
          ),
          ex.fillBlank(
            'Pour le médicament, il faut une ___.',
            'Para el remedio hace falta una receta.',
            'ordonnance',
            ['pharmacie', 'fièvre'],
            ['fr-l-ordonnance', 'fr-le-medicament'],
            { id: 'fr.ex.pi3zrubfeqqb6u', skill: 'vocabulary' },
          ),
          ex.matchPairs(
            [
              ['le médicament', 'el remedio'],
              ["l'ordonnance", 'la receta (médica)'],
              ['le rhume', 'el resfrío'],
              ['malade', 'enfermo'],
            ],
            ['fr-le-medicament', 'fr-l-ordonnance', 'fr-le-rhume', 'fr-malade'],
            { id: 'fr.ex.uehnfyu35sdsyu' },
          ),
          ex.translateWrite(
            'Me duele la espalda desde ayer.',
            "J'ai mal au dos depuis hier.",
            ['fr-j-ai-mal-a', 'fr-le-dos'],
            { id: 'fr.ex.vpj152557dph3b', acceptedAnswers: ["Depuis hier, j'ai mal au dos."] },
          ),
          ex.shortAnswer(
            'Vous avez mal depuis quand?',
            '¿Desde cuándo le duele? (Responde que desde hace tres días.)',
            "J'ai mal depuis trois jours.",
            ['Depuis trois jours.'],
            ['fr-j-ai-mal-a', 'fr-depuis'],
            { id: 'fr.ex.rn7axkqi87r12j' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Reposez-vous!',
        objective: 'Entender y dar consejos de salud con el imperativo de vous.',
        intro: {
          explanation:
            'Para aconsejar con vous se usa el imperativo: es la forma de vous sin el pronombre (vous prenez → prenez, vous buvez → buvez). En negativo, ne… pas rodea al verbo: ne mangez pas trop. Con un verbo pronominal, el pronombre va después, con guion: reposez-vous (descanse). Il faut + infinitivo también sirve para aconsejar.',
          examples: [
            { target: "Reposez-vous et buvez de l'eau.", base: 'Descanse y tome agua.' },
            { target: 'Ne mangez pas trop.', base: 'No coma demasiado.' },
          ],
        },
        takeaways: [
          'Entiendes los consejos del médico en imperativo.',
          'Aconsejas con reposez-vous, buvez, prenez y ne mangez pas.',
        ],
        exercises: [
          ex.translationChoice(
            'reposez-vous',
            'descanse',
            ['me siento', 'me duele…', 'en forma'],
            ['fr-reposez-vous'],
            { id: 'fr.ex.kvjt1nit90oz7t' },
          ),
          ex.listenChoice(
            "Reposez-vous et buvez de l'eau.",
            [
              "Vous vous reposez et vous buvez de l'eau.",
              'Reposez-vous et prenez le médicament.',
              'Reposez-vous et mangez.',
            ],
            ['fr-reposez-vous'],
            { id: 'fr.ex.5r7r79jo2rpz2x' },
          ),
          ex.fillBlank(
            'Vous êtes fatigué: ___!',
            'Está cansado: ¡descanse!',
            'reposez-vous',
            ['vous reposez', 'je me sens'],
            ['fr-reposez-vous', 'fr-fatigue'],
            {
              id: 'fr.ex.qx2zxpi3vr4an9',
              explanation: 'En el imperativo, el pronombre va después del verbo: reposez-vous.',
            },
          ),
          ex.fillBlank(
            'Ne ___ pas trop!',
            '¡No coma demasiado!',
            'mangez',
            ['mangé', 'manger'],
            ['fr-reposez-vous'],
            {
              id: 'fr.ex.ij9haqaqjgneaq',
              explanation: 'Imperativo negativo con vous: ne mangez pas.',
            },
          ),
          question(
            'fr.ex.61f2vpe9y0kb5k',
            MESSAGE,
            '¿Qué le aconseja el médico a Thomas?',
            'Que descanse, tome mucha agua y tome el remedio por la noche.',
            [
              'Que vaya a trabajar y tome el remedio por la mañana.',
              'Que no tome agua.',
              'Que vuelva a la consulta mañana.',
            ],
            ['fr-reposez-vous', 'fr-le-medicament'],
            "El médico le dice «Reposez-vous, buvez beaucoup d'eau et prenez le médicament le soir».",
          ),
          question(
            'fr.ex.fyhkaf74an8jy4',
            MESSAGE,
            '¿Qué le pregunta Thomas a Julie?',
            'Si puede ir a verlo mañana a su casa.',
            ['Si puede ir con él al médico.', 'Si tiene un remedio.', 'Si está enferma.'],
            ['fr-malade'],
            'Escribe «Demain, je serai à la maison: tu peux venir?».',
          ),
          ex.orderWords(
            'Prenez le médicament le matin et le soir.',
            'Tome el remedio por la mañana y por la noche.',
            ['fr-le-medicament'],
            { id: 'fr.ex.31ffpc5d7s3dwl' },
          ),
          ex.matchPairs(
            [
              ['la tête', 'la cabeza'],
              ['le bras', 'el brazo'],
              ['reposez-vous', 'descanse'],
              ['fatigué', 'cansado'],
            ],
            ['fr-la-tete', 'fr-le-bras', 'fr-reposez-vous', 'fr-fatigue'],
            { id: 'fr.ex.jngca5t8zc313s' },
          ),
          ex.translateWrite(
            'Descanse y tome mucha agua.',
            "Reposez-vous et buvez beaucoup d'eau.",
            ['fr-reposez-vous'],
            { id: 'fr.ex.n3a39r7mwmz1m2' },
          ),
          ex.shortAnswer(
            "J'ai mal à la tête et je me sens fatigué.",
            'Me duele la cabeza y me siento cansado. (Dale un consejo con vous: que descanse.)',
            'Reposez-vous!',
            ["Reposez-vous et buvez de l'eau.", 'Reposez-vous, monsieur.'],
            ['fr-reposez-vous'],
            { id: 'fr.ex.ebphhw1mauphzg' },
          ),
        ],
      },
    ],
  },
};
