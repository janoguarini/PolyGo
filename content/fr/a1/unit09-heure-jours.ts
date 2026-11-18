import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U9 «La hora y los días» (docs/FR_A1_A2.md): decir y preguntar la hora (il est deux
 * heures, et quart, et demie, moins le quart, midi, minuit), à quelle heure?, los días de la semana
 * sin artículo (lundi, un día concreto) y con artículo para lo habitual (le lundi), aujourd'hui,
 * demain y quand. Pronunciación: liaison deux‿heures, trois‿heures, six‿heures, dix‿heures con
 * sonido z; en neuf heures la f suena como v. Cultura: los días se escriben con minúscula; en los
 * horarios de los negocios se usa mucho el lunes como día de cierre.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const HORAIRES = reading(
  'fr.stim.a1-u9-horaires',
  'schedule',
  'El horario de un café de Lyon.',
  [
    'Lundi: fermé.',
    'Mardi, mercredi et jeudi: de huit heures à midi.',
    'Vendredi et samedi: de huit heures à minuit.',
    'Dimanche: de neuf heures à midi.',
    'Bonne semaine!',
  ],
  { title: 'Café Lumière' },
);

const WEEKEND = dialogue(
  'fr.stim.a1-u9-samedi',
  'Hugo y Claire hablan de cuándo trabaja cada uno.',
  [
    ['Hugo', "Claire, tu travailles aujourd'hui?"],
    ['Claire', "Non, aujourd'hui, c'est samedi! Le samedi, je ne travaille pas."],
    ['Hugo', 'Et demain?'],
    ['Claire', 'Le week-end, je me lève tard. Et toi, tu travailles quand?'],
    ['Hugo', 'Je travaille le lundi et le mardi.'],
  ],
  FR_A1_RATE,
);

const REVEIL = dialogue(
  'fr.stim.a1-u9-horaire',
  'Léa le pregunta a Nicolas por sus horarios.',
  [
    ['Léa', 'Nicolas, tu te lèves à quelle heure?'],
    ['Nicolas', 'La semaine, je me lève à six heures et demie.'],
    ['Léa', 'Et le week-end?'],
    ['Nicolas', 'Le week-end, je me lève à dix heures. Et je me couche à minuit.'],
  ],
  FR_A1_RATE,
);

export const FR_A1_U09: FrUnitDef = {
  names: ['Lumière', 'Hugo', 'Claire', 'Léa', 'Nicolas', 'Lyon', 'Paris'],
  support: ['fermé', 'bonne'],
  unit: {
    position: 9,
    title: 'La hora y los días',
    titleEn: 'Quelle heure est-il?',
    description:
      "La hora con il est… heures, et quart, et demie, moins le quart, midi y minuit; à quelle heure?; los días sin artículo (lundi) y con artículo para lo habitual (le lundi); aujourd'hui, demain, quand. Liaison deux‿heures, neuf heures.",
    emoji: '🕐',
    objective:
      'Podés decir y preguntar la hora, decir a qué hora hacés algo y hablar de los días de la semana, de hoy y de mañana.',
    grammar: {
      title: 'Il est… heures · lundi / le lundi',
      explanation:
        'La hora se dice con il est + número + heures (une heure, en singular): il est trois heures. Después se agrega et quart (y cuarto), et demie (y media) o moins le quart (menos cuarto). A las doce: midi (mediodía) o minuit (medianoche), sin heures; con ellos se escribe et demi, sin e. Para decir a qué hora: à + hora (à sept heures). Los días van en minúscula y sin artículo cuando es un día concreto (lundi, je travaille: este lunes); con le es una costumbre (le lundi, je travaille: todos los lunes). Delante de heures hay liaison: deux‿heures y trois‿heures con sonido z; en neuf heures, la f suena como v.',
      examples: [
        { target: 'Il est huit heures et quart.', base: 'Son las ocho y cuarto.' },
        { target: 'Je me lève à sept heures et demie.', base: 'Me levanto a las siete y media.' },
        { target: 'Le dimanche, je ne travaille pas.', base: 'Los domingos no trabajo.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U9). Sin revisión nativa: revisar «midi et demi» (sin e, norma escolar; en el uso se ve también «midi et demie»), la hora de 12 horas en lugar de la de 24 (dix-huit heures) que se deja para más adelante, y «la semaine» como «durante la semana».',
    },
    words: [
      w(
        'fr-quelle-heure-est-il',
        'quelle heure est-il?',
        '¿qué hora es?',
        'Madame, quelle heure est-il? — Il est midi.',
        'Señora, ¿qué hora es? — Es mediodía.',
        ['time', 'questions'],
        { emoji: '🕐' },
      ),
      w(
        'fr-l-heure',
        "l'heure",
        'la hora',
        "Tu as l'heure? — Oui, il est deux heures.",
        '¿Tenés hora? — Sí, son las dos.',
        ['time', 'f'],
        { acceptedTexts: ["l'heure"] },
      ),
      w(
        'fr-et-demie',
        'et demie',
        'y media',
        'Il est sept heures et demie.',
        'Son las siete y media.',
        ['time'],
        { acceptedTexts: ['et demi'] },
      ),
      w(
        'fr-et-quart',
        'et quart',
        'y cuarto',
        'Il est huit heures et quart.',
        'Son las ocho y cuarto.',
        ['time'],
      ),
      w(
        'fr-moins-le-quart',
        'moins le quart',
        'menos cuarto',
        'Il est dix heures moins le quart.',
        'Son las diez menos cuarto.',
        ['time'],
      ),
      w('fr-midi', 'midi', 'mediodía', 'Je mange à midi.', 'Como al mediodía.', ['time'], {
        acceptedTranslations: ['las doce del mediodía'],
      }),
      w(
        'fr-minuit',
        'minuit',
        'medianoche',
        'Je me couche à minuit.',
        'Me acuesto a medianoche.',
        ['time'],
        { acceptedTranslations: ['las doce de la noche'] },
      ),
      w('fr-lundi', 'lundi', 'lunes', 'Lundi, je travaille.', 'El lunes trabajo.', ['days']),
      w('fr-mardi', 'mardi', 'martes', "Aujourd'hui, c'est mardi.", 'Hoy es martes.', ['days']),
      w(
        'fr-mercredi',
        'mercredi',
        'miércoles',
        "Le mercredi, je travaille l'après-midi.",
        'Los miércoles trabajo a la tarde.',
        ['days'],
      ),
      w(
        'fr-jeudi',
        'jeudi',
        'jueves',
        'Jeudi, je travaille à Paris.',
        'El jueves trabajo en París.',
        ['days'],
      ),
      w(
        'fr-vendredi',
        'vendredi',
        'viernes',
        'Le vendredi, on mange du poisson.',
        'Los viernes comemos pescado.',
        ['days'],
      ),
      w(
        'fr-samedi',
        'samedi',
        'sábado',
        'Samedi, je me lève tard.',
        'El sábado me levanto tarde.',
        ['days'],
      ),
      w(
        'fr-dimanche',
        'dimanche',
        'domingo',
        'Le dimanche, je ne travaille pas.',
        'Los domingos no trabajo.',
        ['days'],
      ),
      w(
        'fr-la-semaine',
        'la semaine',
        'la semana',
        'La semaine, je me lève à sept heures.',
        'Durante la semana me levanto a las siete.',
        ['time', 'f'],
      ),
      w(
        'fr-le-week-end',
        'le week-end',
        'el fin de semana',
        'Le week-end, je me lève tard.',
        'Los fines de semana me levanto tarde.',
        ['time', 'm'],
      ),
      w(
        'fr-aujourd-hui',
        "aujourd'hui",
        'hoy',
        "Aujourd'hui, c'est lundi.",
        'Hoy es lunes.',
        ['time'],
        { acceptedTexts: ["aujourd'hui"] },
      ),
      w('fr-demain', 'demain', 'mañana', 'Demain, je travaille.', 'Mañana trabajo.', ['time']),
      w(
        'fr-quand',
        'quand',
        'cuándo',
        'Tu travailles quand? — Le lundi.',
        '¿Cuándo trabajás? — Los lunes.',
        ['questions'],
      ),
      w(
        'fr-a-quelle-heure',
        'à quelle heure?',
        '¿a qué hora?',
        'Tu te lèves à quelle heure?',
        '¿A qué hora te levantás?',
        ['questions', 'time'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Quelle heure est-il?',
        objective: 'Preguntar y decir la hora en punto.',
        intro: {
          explanation:
            "Para preguntar la hora: quelle heure est-il? (o, entre amigos, tu as l'heure?). Se responde con il est + número + heures: il est trois heures; a la una, il est une heure, en singular. Las doce del mediodía son midi y las de la noche, minuit, sin heures. Ojo con la liaison: deux‿heures y trois‿heures se unen con sonido z; en neuf heures la f suena como v.",
          examples: [
            {
              target: 'Quelle heure est-il? — Il est deux heures.',
              base: '¿Qué hora es? — Son las dos.',
            },
            { target: 'Il est midi.', base: 'Es mediodía.' },
          ],
        },
        takeaways: [
          'Preguntás quelle heure est-il? y respondés il est… heures.',
          'Usás midi y minuit sin heures.',
        ],
        exercises: [
          ex.translationChoice(
            'quelle heure est-il?',
            '¿qué hora es?',
            ['¿cómo te llamás?', '¿cuántos años tenés?', '¿de dónde sos?'],
            ['fr-quelle-heure-est-il'],
            { id: 'fr.ex.gegzu7jrxlqqc1' },
          ),
          ex.matchPairs(
            [
              ['midi', 'mediodía'],
              ['minuit', 'medianoche'],
              ["l'heure", 'la hora'],
              ['quelle heure est-il?', '¿qué hora es?'],
            ],
            ['fr-midi', 'fr-minuit', 'fr-l-heure', 'fr-quelle-heure-est-il'],
            { id: 'fr.ex.2ba22ymeov6rop' },
          ),
          ex.listenChoice(
            'Il est deux heures.',
            ['Il est douze heures.', 'Il est dix heures.', 'Il est trois heures.'],
            ['fr-l-heure'],
            {
              id: 'fr.ex.fdzzz8aj648qyg',
              explanation:
                'En deux‿heures la x se une a heures con sonido z. Douze tiene una z propia: douze heures.',
            },
          ),
          ex.fillBlank(
            'Il est trois ___.',
            'Son las tres.',
            'heures',
            ['heure', 'jours', 'midi'],
            ['fr-l-heure'],
            {
              id: 'fr.ex.o6nxogjkjiv5pj',
              explanation: 'Desde dos, heures va en plural (la s no suena): trois heures.',
            },
          ),
          ex.fillBlank(
            'Il est ___. Je mange.',
            'Son las doce del mediodía. Como.',
            'midi',
            ['minuit', 'douze', 'une heure'],
            ['fr-midi'],
            {
              id: 'fr.ex.mfyt0qt5pl8vek',
              skill: 'vocabulary',
              explanation: 'Las doce del mediodía son midi, sin heures; las de la noche, minuit.',
            },
          ),
          ex.listenChoice(
            'Il est neuf heures.',
            ['Il est onze heures.', 'Il est une heure.', 'Il est minuit.'],
            ['fr-l-heure'],
            {
              id: 'fr.ex.96k9llce6babmu',
              explanation: 'En neuf heures la f se une a heures y suena como v.',
            },
          ),
          ex.translationChoice(
            'minuit',
            'medianoche',
            ['mediodía', 'la noche', 'la hora'],
            ['fr-minuit'],
            { id: 'fr.ex.zl68o9ueuv4q7c' },
          ),
          ex.orderWords('Il est une heure.', 'Es la una.', ['fr-l-heure'], {
            id: 'fr.ex.u8de04jkxs6kqu',
          }),
          ex.translateWrite('Son las ocho.', 'Il est huit heures.', ['fr-l-heure'], {
            id: 'fr.ex.w7fsq7uwnzct9m',
            acceptedAnswers: ['Huit heures.'],
          }),
          ex.shortAnswer(
            'Quelle heure est-il?',
            '¿Qué hora es? (Respondé que es medianoche.)',
            'Il est minuit.',
            ['Minuit.'],
            ['fr-quelle-heure-est-il', 'fr-minuit'],
            { id: 'fr.ex.8reyphibt0ln7f' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Et quart, et demie',
        objective: 'Decir la hora con cuartos y medias.',
        intro: {
          explanation:
            'Después de la hora se agrega et quart (y cuarto), et demie (y media) o moins le quart (menos cuarto): il est huit heures et quart, il est dix heures moins le quart. Demie lleva e porque concuerda con heure, que es femenino; con midi y minuit se escribe et demi. En las dos formas suena igual.',
          examples: [
            { target: 'Il est sept heures et demie.', base: 'Son las siete y media.' },
            { target: 'Il est onze heures moins le quart.', base: 'Son las once menos cuarto.' },
          ],
        },
        takeaways: [
          'Agregás et quart, et demie o moins le quart a la hora.',
          'Escribís et demie con heures y et demi con midi y minuit.',
        ],
        exercises: [
          ex.translationChoice(
            'et quart',
            'y cuarto',
            ['y media', 'menos cuarto', 'la hora'],
            ['fr-et-quart'],
            { id: 'fr.ex.8kfowlr1nugma4' },
          ),
          ex.matchPairs(
            [
              ['et demie', 'y media'],
              ['et quart', 'y cuarto'],
              ['moins le quart', 'menos cuarto'],
              ['midi', 'mediodía'],
            ],
            ['fr-et-demie', 'fr-et-quart', 'fr-moins-le-quart', 'fr-midi'],
            { id: 'fr.ex.xk0ygusjg1oa6g' },
          ),
          ex.listenChoice(
            'Il est six heures et quart.',
            [
              'Il est six heures et demie.',
              'Il est dix heures et quart.',
              'Il est six heures moins le quart.',
            ],
            ['fr-et-quart'],
            {
              id: 'fr.ex.44gjne4kkglfdn',
              explanation:
                'Six‿heures y dix‿heures tienen liaison con z: cambia la primera consonante.',
            },
          ),
          ex.fillBlank(
            'Il est huit heures et ___.',
            'Son las ocho y media.',
            'demie',
            ['quart', 'demi', 'moins'],
            ['fr-et-demie'],
            {
              id: 'fr.ex.bjtj7i2kyeeb2y',
              explanation: 'Y media es et demie; con heures (femenino) se escribe con e.',
            },
          ),
          ex.fillBlank(
            'Il est midi et ___.',
            'Son las doce y media.',
            'demi',
            ['demie', 'quart', 'moins'],
            ['fr-et-demie', 'fr-midi'],
            {
              id: 'fr.ex.xbyjbvg94pbkgk',
              explanation: 'Midi es masculino: midi et demi, sin e. Suena igual que demie.',
            },
          ),
          ex.translationChoice(
            'moins le quart',
            'menos cuarto',
            ['y cuarto', 'y media', 'medianoche'],
            ['fr-moins-le-quart'],
            { id: 'fr.ex.gdj0i76liv6twp' },
          ),
          ex.fillBlank(
            'Il est sept heures ___ le quart.',
            'Son las siete menos cuarto.',
            'moins',
            ['et', 'à', 'de'],
            ['fr-moins-le-quart'],
            {
              id: 'fr.ex.m2aygy6cgs3f30',
              explanation: 'Menos cuarto es moins le quart, con le.',
            },
          ),
          ex.orderWords(
            'Il est onze heures moins le quart.',
            'Son las once menos cuarto.',
            ['fr-moins-le-quart'],
            { id: 'fr.ex.7n4qjssza7hc81' },
          ),
          ex.translateWrite(
            'Son las nueve y cuarto.',
            'Il est neuf heures et quart.',
            ['fr-et-quart'],
            { id: 'fr.ex.nui50ilxwnfvs9', acceptedAnswers: ['Neuf heures et quart.'] },
          ),
          ex.shortAnswer(
            'Quelle heure est-il?',
            '¿Qué hora es? (Respondé que son las siete y media.)',
            'Il est sept heures et demie.',
            ['Sept heures et demie.'],
            ['fr-et-demie', 'fr-quelle-heure-est-il'],
            { id: 'fr.ex.aeo8hxr36wdxcy' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Lundi, mardi, mercredi',
        objective: 'Nombrar los días de la semana.',
        intro: {
          explanation:
            'Los días de la semana son masculinos y en francés se escriben con minúscula: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche. Para un día concreto no se usa artículo: lundi, je travaille (el lunes trabajo). La semaine (la semana) es femenino.',
          examples: [
            { target: 'Lundi, je travaille.', base: 'El lunes trabajo.' },
            {
              target: 'Samedi et dimanche, je me lève tard.',
              base: 'El sábado y el domingo me levanto tarde.',
            },
          ],
        },
        takeaways: [
          'Nombrás los siete días, en minúscula.',
          'Decís un día concreto sin artículo: lundi, je travaille.',
        ],
        exercises: [
          ex.translationChoice('lundi', 'lunes', ['martes', 'miércoles', 'domingo'], ['fr-lundi'], {
            id: 'fr.ex.do8n1hmqsvfx5a',
          }),
          ex.matchPairs(
            [
              ['lundi', 'lunes'],
              ['mardi', 'martes'],
              ['mercredi', 'miércoles'],
              ['jeudi', 'jueves'],
            ],
            ['fr-lundi', 'fr-mardi', 'fr-mercredi', 'fr-jeudi'],
            { id: 'fr.ex.pt1xfgqbwzops6' },
          ),
          ex.matchPairs(
            [
              ['vendredi', 'viernes'],
              ['samedi', 'sábado'],
              ['dimanche', 'domingo'],
              ['la semaine', 'la semana'],
            ],
            ['fr-vendredi', 'fr-samedi', 'fr-dimanche', 'fr-la-semaine'],
            { id: 'fr.ex.vb4xemyz24iu9y' },
          ),
          ex.listenChoice(
            'Mardi, je travaille.',
            ['Mercredi, je travaille.', 'Lundi, je travaille.', 'Mardi, je me lève tard.'],
            ['fr-mardi'],
            { id: 'fr.ex.3yh3lp7g87kvq2' },
          ),
          ex.fillBlank(
            'Lundi, mardi, ___, jeudi.',
            'Lunes, martes, miércoles, jueves.',
            'mercredi',
            ['vendredi', 'samedi', 'dimanche'],
            ['fr-mercredi'],
            { id: 'fr.ex.62ossuxytejuil', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Samedi et ___, je ne travaille pas.',
            'El sábado y el domingo no trabajo.',
            'dimanche',
            ['lundi', 'mardi', 'jeudi'],
            ['fr-dimanche', 'fr-samedi'],
            { id: 'fr.ex.vcm82k3owfsvdv', skill: 'vocabulary' },
          ),
          question(
            'fr.ex.wltloht73i6rvs',
            HORAIRES,
            '¿Qué día está cerrado el café?',
            'El lunes.',
            ['El domingo.', 'El sábado.', 'Ningún día.'],
            ['fr-lundi'],
            'El horario dice «Lundi: fermé».',
          ),
          question(
            'fr.ex.jh2tkydqkyb7cx',
            HORAIRES,
            '¿Hasta qué hora abre el café los viernes?',
            'Hasta medianoche.',
            ['Hasta el mediodía.', 'Hasta las ocho.', 'No abre.'],
            ['fr-vendredi', 'fr-minuit', 'fr-la-semaine'],
            'Dice «Vendredi et samedi: de huit heures à minuit».',
          ),
          ex.translateWrite('El viernes trabajo.', 'Vendredi, je travaille.', ['fr-vendredi'], {
            id: 'fr.ex.a388x89fjzjivb',
            acceptedAnswers: ['Je travaille vendredi.'],
          }),
          ex.shortAnswer(
            'Tu travailles samedi?',
            '¿Trabajás el sábado? (Respondé que no, que trabajás el jueves.)',
            'Non, je travaille jeudi.',
            ['Non, jeudi.', 'Non, je ne travaille pas samedi. Je travaille jeudi.'],
            ['fr-jeudi', 'fr-samedi'],
            { id: 'fr.ex.6v133llmlpbc6s' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Aujourd'hui, demain, le week-end",
        objective: 'Hablar de hoy, de mañana y de lo que hacés cada semana.',
        intro: {
          explanation:
            "Aujourd'hui es hoy y demain, mañana (el día siguiente; no lo confundas con le matin, la mañana). Con artículo, un día es una costumbre: le lundi, je travaille (todos los lunes). Lo mismo con le week-end. Para preguntar cuándo: quand? (la d final no suena): tu travailles quand?",
          examples: [
            { target: "Aujourd'hui, c'est lundi.", base: 'Hoy es lunes.' },
            { target: 'Le dimanche, je ne travaille pas.', base: 'Los domingos no trabajo.' },
          ],
        },
        takeaways: [
          "Decís aujourd'hui, demain y le week-end.",
          'Usás le lundi para algo que hacés todos los lunes y preguntás con quand?',
        ],
        exercises: [
          ex.translationChoice(
            "aujourd'hui",
            'hoy',
            ['mañana', 'la semana', 'el fin de semana'],
            ['fr-aujourd-hui'],
            { id: 'fr.ex.u73o6kd94gd1lo' },
          ),
          ex.translationChoice('demain', 'mañana', ['hoy', 'la noche', 'cuándo'], ['fr-demain'], {
            id: 'fr.ex.pt4mc0rqwn00ol',
            explanation: 'Demain es mañana, el día siguiente; la mañana del día es le matin.',
          }),
          ex.matchPairs(
            [
              ["aujourd'hui", 'hoy'],
              ['demain', 'mañana'],
              ['le week-end', 'el fin de semana'],
              ['quand', 'cuándo'],
            ],
            ['fr-aujourd-hui', 'fr-demain', 'fr-le-week-end', 'fr-quand'],
            { id: 'fr.ex.zj9u3jbtdwejax' },
          ),
          ex.listenChoice(
            "Aujourd'hui, c'est lundi.",
            ["Demain, c'est lundi.", "Aujourd'hui, c'est mardi.", "Aujourd'hui, c'est samedi."],
            ['fr-aujourd-hui', 'fr-lundi'],
            { id: 'fr.ex.9slfd5ei6bc16u' },
          ),
          ex.fillBlank(
            'Je ne travaille pas ___ week-end.',
            'Los fines de semana no trabajo.',
            'le',
            ['la', 'les', 'une'],
            ['fr-le-week-end'],
            {
              id: 'fr.ex.jc18g7366nou9y',
              explanation: 'Week-end es masculino: le week-end.',
            },
          ),
          ex.fillBlank(
            'Tu travailles ___? — Le mardi.',
            '¿Cuándo trabajás? — Los martes.',
            'quand',
            ['où', 'comment', 'quel'],
            ['fr-quand', 'fr-mardi'],
            {
              id: 'fr.ex.nbjc8swmallyqe',
              skill: 'vocabulary',
              explanation: 'Cuándo es quand; où es dónde y comment, cómo.',
            },
          ),
          question(
            'fr.ex.wya9gwb7ymjm43',
            WEEKEND,
            '¿Qué día es hoy?',
            'Sábado.',
            ['Domingo.', 'Lunes.', 'Martes.'],
            ['fr-aujourd-hui', 'fr-samedi'],
            "Claire dice «aujourd'hui, c'est samedi!».",
          ),
          question(
            'fr.ex.s6tkvhd6dbqo8j',
            WEEKEND,
            '¿Cuándo trabaja Hugo?',
            'Los lunes y los martes.',
            ['Los sábados.', 'Todo el fin de semana.', 'Hoy y mañana.'],
            ['fr-quand', 'fr-le-week-end'],
            'Hugo responde «Je travaille le lundi et le mardi»: con le, es cada semana.',
          ),
          ex.translateWrite(
            'Los domingos no trabajo.',
            'Le dimanche, je ne travaille pas.',
            ['fr-dimanche'],
            { id: 'fr.ex.6jfwspdr4v4eic', acceptedAnswers: ['Je ne travaille pas le dimanche.'] },
          ),
          ex.shortAnswer(
            "Aujourd'hui, c'est lundi. Et demain?",
            'Hoy es lunes. ¿Y mañana? (Respondé qué día es mañana.)',
            "Demain, c'est mardi.",
            ["C'est mardi.", 'Mardi.'],
            ['fr-demain', 'fr-mardi'],
            { id: 'fr.ex.57e3fugqjles08' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'À quelle heure?',
        objective: 'Preguntar y decir a qué hora hacés algo.',
        intro: {
          explanation:
            'Para decir a qué hora pasa algo se usa à + hora: je me lève à sept heures, je mange à midi. La pregunta es à quelle heure? En lo oral suele ir al final: tu te lèves à quelle heure? Quelle va con e porque heure es femenino.',
          examples: [
            { target: 'Tu te lèves à quelle heure?', base: '¿A qué hora te levantás?' },
            { target: 'Je me couche à minuit.', base: 'Me acuesto a medianoche.' },
          ],
        },
        takeaways: [
          'Preguntás à quelle heure? y respondés con à + hora.',
          'Contás tu horario de la semana y del fin de semana.',
        ],
        exercises: [
          ex.translationChoice(
            'à quelle heure?',
            '¿a qué hora?',
            ['¿qué hora es?', '¿cuándo?', '¿dónde?'],
            ['fr-a-quelle-heure'],
            { id: 'fr.ex.7a46w6nfnlitje' },
          ),
          ex.fillBlank(
            'Je me lève ___ sept heures.',
            'Me levanto a las siete.',
            'à',
            ['de', 'le', 'et'],
            ['fr-a-quelle-heure'],
            { id: 'fr.ex.2iwdnsto3qqudx', explanation: 'A las siete es à sept heures.' },
          ),
          ex.listenChoice(
            'Je mange à midi et demi.',
            [
              'Je mange à minuit et demi.',
              'Je mange à midi et quart.',
              'Je mange à deux heures et demie.',
            ],
            ['fr-midi', 'fr-et-demie'],
            { id: 'fr.ex.8st6pqtvafxt1u' },
          ),
          ex.fillBlank(
            'Tu te couches à ___ heure?',
            '¿A qué hora te acostás?',
            'quelle',
            ['quel', 'quand', 'où'],
            ['fr-a-quelle-heure'],
            {
              id: 'fr.ex.ielec05oqynjqg',
              explanation: 'Heure es femenino: quelle heure. Quel va con masculinos (quel âge).',
            },
          ),
          ex.orderWords(
            'Tu te lèves à quelle heure?',
            '¿A qué hora te levantás?',
            ['fr-a-quelle-heure'],
            { id: 'fr.ex.wu8j60uxsj98w3' },
          ),
          ex.matchPairs(
            [
              ['à quelle heure?', '¿a qué hora?'],
              ['quand', 'cuándo'],
              ['et demie', 'y media'],
              ['minuit', 'medianoche'],
            ],
            ['fr-a-quelle-heure', 'fr-quand', 'fr-et-demie', 'fr-minuit'],
            { id: 'fr.ex.412nk535v621hu' },
          ),
          question(
            'fr.ex.uuurc652trxpxj',
            REVEIL,
            '¿A qué hora se levanta Nicolas durante la semana?',
            'A las seis y media.',
            ['A las diez.', 'A medianoche.', 'A las seis menos cuarto.'],
            ['fr-a-quelle-heure', 'fr-la-semaine', 'fr-et-demie'],
            'Dice «La semaine, je me lève à six heures et demie».',
          ),
          question(
            'fr.ex.pu7on1am7y30qq',
            REVEIL,
            '¿Qué hace Nicolas a medianoche el fin de semana?',
            'Se acuesta.',
            ['Se levanta.', 'Trabaja.', 'Desayuna.'],
            ['fr-minuit', 'fr-le-week-end'],
            'Para el fin de semana dice «je me couche à minuit»; se levanta a las diez.',
          ),
          ex.translateWrite(
            'El sábado me levanto a las diez.',
            'Samedi, je me lève à dix heures.',
            ['fr-samedi', 'fr-a-quelle-heure'],
            {
              id: 'fr.ex.mmtc1d30voxfov',
              acceptedAnswers: [
                'Je me lève à dix heures samedi.',
                'Samedi je me lève à dix heures.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu te couches à quelle heure?',
            '¿A qué hora te acostás? (Respondé que a las once y media.)',
            'Je me couche à onze heures et demie.',
            ['À onze heures et demie.', 'Onze heures et demie.'],
            ['fr-a-quelle-heure', 'fr-et-demie'],
            { id: 'fr.ex.19zqja3cslac2v' },
          ),
        ],
      },
    ],
  },
};
