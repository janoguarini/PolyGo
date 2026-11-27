import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U1 «Life experiences» (docs/ES_B1.md §3): hablar de experiencias de vida con el pretérito
 * perfecto ampliado (he, has, ha, hemos, han + participio), los participios irregulares más frecuentes
 * (hecho, visto, dicho, escrito, vuelto; abierto, roto y puesto se nombran en la gramática), ¿alguna vez
 * has…?, nunca / jamás, ya / todavía no, varias veces, por primera vez, y el contraste con el indefinido:
 * perfecto para la experiencia sin fecha (he estado en Oaxaca), indefinido en cuanto aparece una fecha
 * (fui a Oaxaca en 2023). Me sorprendió funciona como me gustó.
 * Variante: español neutro de Latinoamérica, con tú y ustedes. El indefinido sigue siendo el pasado de
 * todos los días (hoy comí, ¿ya comiste?); el perfecto se reserva para la experiencia sin tiempo
 * concreto, como hace el habla mexicana culta. Se acepta el indefinido en las respuestas con «alguna
 * vez» (¿alguna vez probaste…?), muy frecuente en Latinoamérica.
 * Pronunciación: la h muda de he, has, ha (he hecho suena «e echo») y la sinalefa (he estado → «hestado»).
 * Cultura: comida de Oaxaca (mole, chapulines), la birria y las Chivas de Guadalajara, Machu Picchu.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RADIO = dialogue(
  'es.stim.b1-u1-radio',
  'On a radio show in Mexico City, Andrés interviews Valeria, a traveler from Puebla.',
  [
    [
      'Andrés',
      'Hoy está con nosotros Valeria, una viajera de Puebla. Valeria, ¿en cuántos países has estado?',
    ],
    ['Valeria', 'En veinte, más o menos. He estado en casi toda Latinoamérica y también en Japón.'],
    ['Andrés', '¡Qué bien! ¿Y cuál ha sido la experiencia más increíble de tu vida?'],
    ['Valeria', 'En Perú vi Machu Picchu al amanecer. Nunca he visto nada tan bonito en mi vida.'],
    ['Andrés', '¿Y la comida? ¿Alguna vez has probado algo muy raro?'],
    ['Valeria', 'Sí, en Oaxaca he probado los chapulines. ¡Y me encantan!'],
    ['Andrés', '¿Y qué país todavía no has visitado?'],
    ['Valeria', 'Todavía no he visitado Argentina, pero voy a ir el próximo año.'],
  ],
  ES_B1_RATE,
);

const LISTA = reading(
  'es.stim.b1-u1-lista',
  'post',
  'Paola is turning thirty and writes a post about her life so far.',
  [
    'El sábado es mi cumpleaños: ¡30 años! Estas son algunas cosas que he hecho.',
    'He vivido en tres ciudades: Monterrey, Puebla y Mérida.',
    'He escrito un libro de recetas, ¡pero nadie lo compró!',
    'He hecho un viaje sola por Colombia y fue increíble.',
    'Jamás he dicho que no a una aventura.',
    'Siempre he vuelto a Puebla, porque allá está mi familia.',
    'Todavía no he aprendido a manejar. ¿Y ustedes? ¿Qué cosas han hecho?',
  ],
  { title: 'Cosas que he hecho antes de los 30', from: 'Paola' },
);

const FIESTA = dialogue(
  'es.stim.b1-u1-fiesta',
  'At a party in Guadalajara, Rodrigo meets Emma, a student from Chicago.',
  [
    ['Rodrigo', 'Hola, soy Rodrigo. ¿Es la primera vez que vienes a Guadalajara?'],
    ['Emma', 'No, he venido varias veces. La primera vez fue en 2019, con mi universidad.'],
    ['Rodrigo', '¡Hablas muy bien! ¿Cuántos idiomas hablas?'],
    [
      'Emma',
      'Tres: inglés, español y un poco de francés. El español es el idioma que más me gusta.',
    ],
    ['Rodrigo', '¿Y ya has probado la birria?'],
    ['Emma', '¡Claro! Pero todavía no he ido a un partido de las Chivas.'],
    ['Rodrigo', 'Yo he ido muchas veces. Si quieres, el domingo vamos juntos.'],
    ['Emma', '¡Me encantaría! He conocido a gente muy simpática aquí.'],
  ],
  ES_B1_RATE,
);

const CORREO = reading(
  'es.stim.b1-u1-correo',
  'email',
  'Lucía writes to her friend Marta during a trip to Oaxaca.',
  [
    'Querida Marta:',
    'Te escribo desde Oaxaca. ¡Este viaje es inolvidable!',
    'Llegué el lunes y el martes fui a Monte Albán con un guía.',
    'Me sorprendió mucho el mole negro: es dulce y picante a la vez.',
    'Ya he probado tres moles diferentes y todavía quiero probar más.',
    'Tú estuviste aquí en 2022, ¿verdad? ¿Qué te gustó más?',
    'Vuelvo a Monterrey el domingo. ¡Besos!',
  ],
  { from: 'Lucía', to: 'Marta' },
);

export const ES_B1_U01: EsUnitDef = {
  names: [
    'Andrés',
    'Valeria',
    'Paola',
    'Rodrigo',
    'Emma',
    'Lucía',
    'Marta',
    'Ana',
    'Diego',
    'Chicago',
    'Latinoamérica',
    'Japón',
    'Perú',
    'Machu Picchu',
    'Colombia',
    'Mérida',
    'Chivas',
    'Monte Albán',
    'Argentina',
    'Europa',
  ],
  support: [
    'hemos',
    'han',
    'viajera',
    'países',
    'amanecer',
    'bonito',
    'raro',
    'chapulines',
    'visitado',
    'vivido',
    'cosas',
    'algunas',
    'recetas',
    'compró',
    'sola',
    'gente',
    'aventura',
    'aprendido',
    'manejar',
    'vienes',
    'venido',
    'birria',
    'ido',
    'partido',
    'encantaría',
    'aquí',
    'guía',
    'mole',
    'picante',
    'verdad',
    'gustó',
    'mundo',
    'lugar',
    'tráfico',
    'cumplí',
    'cumplido',
    'sorprendieron',
    'sorprende',
    'dije',
    'vivir',
    'poema',
  ],
  unit: {
    position: 1,
    title: 'Life experiences',
    titleEn: 'Experiencias de vida',
    description:
      'Talk about your life experiences with the present perfect (he visto, he hecho, he probado), ask ¿alguna vez has…?, say never with nunca and jamás, and switch to the preterite when you say when something happened.',
    emoji: '🌍',
    objective:
      'You can talk about your life experiences, ask someone if they have ever done something, and tell when and how it happened.',
    grammar: {
      title: 'The present perfect for experiences · irregular participles · perfect vs preterite',
      explanation:
        'The present perfect is formed with the present of haber + a participle: he, has, ha, hemos, han + probado. Regular participles end in -ado for -ar verbs (probar → probado, viajar → viajado) and -ido for -er / -ir verbs (comer → comido, vivir → vivido, conocer → conocido). Some very common verbs are irregular: hacer → hecho, decir → dicho, ver → visto, escribir → escrito, volver → vuelto, poner → puesto, abrir → abierto, romper → roto. The participle never changes (ella ha probado, ellos han probado) and nothing goes between haber and the participle: object pronouns go before (lo he visto), and so do nunca and jamás (nunca he visto…). In Latin America the present perfect is mainly used for life experiences with no specific time: ¿alguna vez has probado el mole? (have you ever…?), nunca he estado en Oaxaca, he estado en Bogotá varias veces, todavía no he visto el mar. As soon as you say when it happened (en 2023, el año pasado, hace dos años, ayer), use the preterite: fui a Oaxaca en 2023. A typical conversation asks with the perfect and tells the details with the preterite: ¿Has estado en Oaxaca? — Sí, fui en 2023 y me encantó. For everyday finished actions Latin Americans also prefer the preterite (hoy comí, ¿ya comiste?), and many people ask ¿alguna vez probaste…? too; in Spain you will hear the perfect much more often (hoy he comido).',
      examples: [
        { target: '¿Alguna vez has probado el mole?', base: 'Have you ever tried mole?' },
        { target: 'Nunca he estado en Oaxaca.', base: 'I’ve never been to Oaxaca.' },
        {
          target: 'He estado en Bogotá varias veces; la primera vez fui en 2023.',
          base: 'I’ve been to Bogotá several times; the first time I went in 2023.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U1), en español neutro de Latinoamérica con tú; sin revisión nativa. Revisar: (1) el reparto perfecto / indefinido: en México el perfecto se usa para experiencias sin fecha y para «todavía no he…», pero en muchas zonas también se dice «¿alguna vez probaste…?» o «¿ya probaste la birria?»; se aceptan esas respuestas en indefinido, y el estímulo FIESTA usa «¿ya has probado…?» a propósito: confirmar que suena natural en Guadalajara. (2) «He probado los chapulines en Oaxaca» (perfecto con lugar pero sin fecha) y «Siempre he vuelto a Puebla»: ¿naturales? (3) «Jamás» presentado como un «nunca» más fuerte; «en mi vida» también puede significar «nunca» al principio de la frase (en mi vida he visto algo así): sólo se menciona. (4) «He conocido a gente» (a personal) frente a «he conocido Mérida» (lugar, sin a) y la traducción «I have met». (5) «El sueño» = dream y también sleepiness (tengo sueño): se aclara en L5. (6) «Me sorprendió» como palabra: se practica también «me sorprendieron» con plural. (7) «Manejar» por to drive (se acepta «conducir» en las respuestas abiertas, no se enseña). (8) «La birria» y «las Chivas» como referencias tapatías; «chapulines» y «mole negro» de Oaxaca. (9) Valeria dice «Todavía no he visitado Argentina» sin artículo (también «la Argentina»). Pronunciación: la h muda de he / has / ha y la sinalefa se explican sin transcripción.',
    },
    words: [
      w(
        'es-la-experiencia',
        'la experiencia',
        'experience',
        'Vivir en otro país es una experiencia increíble.',
        'Living in another country is an incredible experience.',
        ['experiences'],
        { acceptedTranslations: ['the experience'], emoji: '🌟' },
      ),
      w(
        'es-por-primera-vez',
        'por primera vez',
        'for the first time',
        'Ayer comí mole por primera vez.',
        'Yesterday I ate mole for the first time.',
        ['experiences', 'frequency'],
      ),
      w(
        'es-varias-veces',
        'varias veces',
        'several times',
        'He estado en Guadalajara varias veces.',
        'I’ve been to Guadalajara several times.',
        ['experiences', 'frequency'],
      ),
      w(
        'es-en-mi-vida',
        'en mi vida',
        'in my life',
        'Nunca he visto un lugar tan bonito en mi vida.',
        'I’ve never seen such a beautiful place in my life.',
        ['experiences'],
      ),
      w(
        'es-jamas',
        'jamás',
        'never (ever)',
        'Jamás he estado en Europa.',
        'I have never ever been to Europe.',
        ['experiences', 'frequency'],
        { acceptedTranslations: ['never ever'] },
      ),
      w(
        'es-he-visto',
        'he visto',
        'I have seen',
        '¿La película? Ya la he visto dos veces.',
        'The film? I’ve already seen it twice.',
        ['present-perfect'],
        { emoji: '👀' },
      ),
      w(
        'es-he-hecho',
        'he hecho',
        'I have done',
        'Este año he hecho muchos viajes.',
        'This year I have taken a lot of trips.',
        ['present-perfect'],
        { acceptedTranslations: ['I have made'] },
      ),
      w(
        'es-he-dicho',
        'he dicho',
        'I have said',
        'Ya te lo he dicho: el sábado no puedo.',
        'I’ve already told you: I can’t on Saturday.',
        ['present-perfect'],
        { acceptedTranslations: ['I have told'] },
      ),
      w(
        'es-he-escrito',
        'he escrito',
        'I have written',
        'He escrito un correo a mi profesora.',
        'I have written an email to my teacher.',
        ['present-perfect'],
        { emoji: '✍️' },
      ),
      w(
        'es-he-vuelto',
        'he vuelto',
        'I have come back',
        'He vuelto a Oaxaca tres veces.',
        'I have been back to Oaxaca three times.',
        ['present-perfect'],
        { acceptedTranslations: ['I have returned', 'I have been back'] },
      ),
      w(
        'es-he-probado',
        'he probado',
        'I have tried',
        'Nunca he probado los chapulines.',
        'I have never tried grasshoppers.',
        ['present-perfect', 'food'],
        { acceptedTranslations: ['I have tasted'] },
      ),
      w(
        'es-he-conocido',
        'he conocido',
        'I have met',
        'En este viaje he conocido a gente muy simpática.',
        'On this trip I have met some very nice people.',
        ['present-perfect', 'people'],
        { acceptedTranslations: ['I have got to know'] },
      ),
      w(
        'es-inolvidable',
        'inolvidable',
        'unforgettable',
        'Fue un viaje inolvidable.',
        'It was an unforgettable trip.',
        ['experiences', 'adjectives'],
      ),
      w(
        'es-el-idioma',
        'el idioma',
        'language',
        'El español es un idioma muy bonito.',
        'Spanish is a very beautiful language.',
        ['languages'],
        { acceptedTranslations: ['the language'], emoji: '🗣️' },
      ),
      w(
        'es-el-sueno',
        'el sueño',
        'dream',
        'Mi sueño es viajar por todo el mundo.',
        'My dream is to travel all over the world.',
        ['dreams'],
        { acceptedTranslations: ['the dream'], emoji: '💭' },
      ),
      w(
        'es-cumplir-un-sueno',
        'cumplir un sueño',
        'to make a dream come true',
        'El año pasado cumplí un sueño: vi el mar por primera vez.',
        'Last year I made a dream come true: I saw the sea for the first time.',
        ['dreams'],
        { acceptedTranslations: ['to fulfill a dream', 'to fulfil a dream'] },
      ),
      w(
        'es-me-sorprendio',
        'me sorprendió',
        'it surprised me',
        'Me sorprendió el tráfico de la Ciudad de México.',
        'The traffic in Mexico City surprised me.',
        ['feelings'],
        { acceptedTranslations: ['I was surprised by'], emoji: '😮' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Alguna vez has…?',
        objective:
          'Ask someone if they have ever done something and answer about your own experiences.',
        intro: {
          explanation:
            'The present perfect is haber in the present + a participle. Haber goes: (yo) he, (tú) has, (él / ella / usted) ha, (nosotros) hemos, (ellos / ustedes) han. The h is silent, so he sounds like the English “eh”. Regular participles end in -ado (probar → probado, visitar → visitado) or -ido (comer → comido, vivir → vivido). Ver is irregular: visto. Use this tense for life experiences when you don’t say when: ¿Alguna vez has probado…? means “Have you ever tried…?”. Answer Sí, he probado… or No, nunca he probado… (nunca goes before he). En mi vida (in my life) adds emphasis: nunca he visto nada tan bonito en mi vida. Notice the double negative: nunca… nada is correct Spanish.',
          examples: [
            {
              target: '¿Alguna vez has probado el mole? — Sí, lo he probado en Puebla.',
              base: 'Have you ever tried mole? — Yes, I’ve tried it in Puebla.',
            },
            { target: 'Nunca he visto el mar.', base: 'I’ve never seen the sea.' },
          ],
        },
        takeaways: [
          'You form the present perfect with he, has, ha, hemos, han + a participle (probado, vivido, visto).',
          'You ask about experiences with ¿Alguna vez has…? and answer with Sí, he… or No, nunca he…',
        ],
        exercises: [
          ex.translationChoice(
            'he probado',
            'I have tried',
            ['I have seen', 'I have to try', 'I would try'],
            ['es-he-probado'],
            { id: 'es.ex.cwk6mwm6gdohjj' },
          ),
          ex.matchPairs(
            [
              ['he visto', 'I have seen'],
              ['he probado', 'I have tried'],
              ['la experiencia', 'experience'],
              ['en mi vida', 'in my life'],
            ],
            ['es-he-visto', 'es-he-probado', 'es-la-experiencia', 'es-en-mi-vida'],
            { id: 'es.ex.r34pz7tnmikeom' },
          ),
          ex.fillBlank(
            '¿Alguna vez ___ probado el mole?',
            'Have you ever tried mole?',
            'has',
            ['he', 'ha', 'hemos'],
            ['es-he-probado'],
            {
              id: 'es.ex.s130eqnm4z9a4e',
              explanation:
                'With tú, haber is has: ¿alguna vez has probado…? He is yo, ha is él / ella / usted and hemos is nosotros.',
            },
          ),
          ex.fillBlank(
            'Nunca he ___ el mar.',
            'I’ve never seen the sea.',
            'visto',
            ['vi', 'veo'],
            ['es-he-visto'],
            {
              id: 'es.ex.6gkee6t97cyq03',
              explanation:
                'The participle of ver is irregular: visto. Vi (I saw) is the preterite and veo (I see) the present; neither can follow he.',
            },
          ),
          ex.listenChoice(
            'Nunca he visto el mar.',
            ['Nunca vi el mar.', 'Ya he visto el mar.', 'Nunca he ido al mar.'],
            ['es-he-visto'],
            { id: 'es.ex.vffhnala2hquze' },
          ),
          ex.orderWords(
            'Nunca he visto nada tan bonito en mi vida.',
            'I’ve never seen anything so beautiful in my life.',
            ['es-en-mi-vida', 'es-he-visto'],
            { id: 'es.ex.y8yw2m3ii7zzgr' },
          ),
          question(
            'es.ex.3uird1s9djsbo5',
            RADIO,
            'How many countries has Valeria been to?',
            'About twenty',
            ['Exactly ten', 'Only Mexico and Japan', 'About thirty'],
            ['es-la-experiencia'],
            'Valeria answers “En veinte, más o menos”: about twenty, in almost all of Latin America and in Japan.',
          ),
          question(
            'es.ex.be7ctq3ar6nw6z',
            RADIO,
            'What does Valeria say about Machu Picchu?',
            'She has never seen anything so beautiful in her life',
            [
              'She has never been there',
              'She went there last year with her family',
              'It was too crowded at sunrise',
            ],
            ['es-he-visto', 'es-en-mi-vida'],
            'She says “En Perú vi Machu Picchu al amanecer. Nunca he visto nada tan bonito en mi vida.”',
          ),
          ex.translateWrite(
            'Have you ever tried mole?',
            '¿Alguna vez has probado el mole?',
            ['es-he-probado'],
            {
              id: 'es.ex.4sngwc1dryjnk8',
              acceptedAnswers: [
                '¿Alguna vez has probado mole?',
                '¿Has probado alguna vez el mole?',
                '¿Has probado el mole alguna vez?',
                '¿Has probado el mole?',
                '¿Has probado mole alguna vez?',
                '¿Alguna vez probaste el mole?',
                '¿Alguna vez probaste mole?',
                '¿Alguna vez ha probado el mole?',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Alguna vez has visto una película en español?',
            'Answer about yourself with «Sí, he visto…» or «No, nunca he visto…».',
            'Sí, he visto una película en español.',
            [
              'Sí, he visto una película en español',
              'No, nunca he visto una película en español.',
              'Sí, he visto muchas películas en español.',
              'Sí, he visto varias películas en español.',
              'No, nunca.',
              'Sí, la he visto.',
              'Sí, he visto una.',
            ],
            ['es-he-visto'],
            { id: 'es.ex.xlyoinmjr13xfg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Hecho, dicho, escrito, vuelto',
        objective: 'Use the most common irregular participles to talk about what you have done.',
        intro: {
          explanation:
            'Some of the most frequent verbs have irregular participles, and it is best to learn them together with he: hacer → he hecho, decir → he dicho, escribir → he escrito, volver → he vuelto, ver → he visto. You will also meet puesto (poner), abierto (abrir) and roto (romper). The participle is the same for every person: yo he hecho, ellos han hecho. Hecho is used both for “done” and “made”: he hecho un viaje (I have taken a trip), he hecho un pastel. Jamás means never, but it is stronger than nunca, a bit like “never ever”: jamás he dicho eso. Like nunca, it can go before the verb or after it with no: no he dicho eso jamás.',
          examples: [
            {
              target: 'Este año he hecho tres viajes.',
              base: 'This year I have taken three trips.',
            },
            { target: 'Jamás he dicho eso.', base: 'I have never said that.' },
          ],
        },
        takeaways: [
          'You use the irregular participles hecho, dicho, escrito and vuelto (and visto, abierto, roto).',
          'You say never with nunca or with the stronger jamás.',
        ],
        exercises: [
          ex.translationChoice(
            'he escrito',
            'I have written',
            ['I have read', 'I have said', 'I am writing'],
            ['es-he-escrito'],
            { id: 'es.ex.wdm0xl3fleh277' },
          ),
          ex.matchPairs(
            [
              ['he hecho', 'I have done'],
              ['he dicho', 'I have said'],
              ['he escrito', 'I have written'],
              ['he vuelto', 'I have come back'],
            ],
            ['es-he-hecho', 'es-he-dicho', 'es-he-escrito', 'es-he-vuelto'],
            { id: 'es.ex.5w9ydtaa29gdtt' },
          ),
          ex.fillBlank(
            'Ya te lo he ___: el sábado no puedo.',
            'I’ve already told you: I can’t on Saturday.',
            'dicho',
            ['dijo', 'dice'],
            ['es-he-dicho'],
            {
              id: 'es.ex.b86t7q8tzzf4og',
              explanation:
                'The participle of decir is irregular: dicho. Dijo (he said) is the preterite and dice (he says) the present.',
            },
          ),
          ex.fillBlank(
            'Este año he ___ muchos viajes.',
            'This year I have taken a lot of trips.',
            'hecho',
            ['hizo', 'hago'],
            ['es-he-hecho'],
            {
              id: 'es.ex.2ejumplowfm9zo',
              explanation:
                'The participle of hacer is hecho. Hacer un viaje means to take a trip, so he hecho muchos viajes is “I have taken a lot of trips”.',
            },
          ),
          ex.fillBlank(
            'Mis padres ___ vuelto a Mérida.',
            'My parents have gone back to Mérida.',
            'han',
            ['ha', 'hemos', 'has'],
            ['es-he-vuelto'],
            {
              id: 'es.ex.t3l9hn1ccu18la',
              explanation:
                'Mis padres is ellos, so haber is han: han vuelto. The participle vuelto does not change.',
            },
          ),
          ex.listenChoice(
            'Jamás he dicho eso.',
            ['Jamás he hecho eso.', 'Ya he dicho eso.', 'Jamás dije eso.'],
            ['es-jamas', 'es-he-dicho'],
            { id: 'es.ex.gp7jg5x7tm5tu5' },
          ),
          question(
            'es.ex.9jmqt6jfui2l8u',
            LISTA,
            'What has Paola written?',
            'A recipe book that nobody bought',
            ['A travel guide to Colombia', 'A novel about Puebla', 'A blog about her family'],
            ['es-he-escrito'],
            'Paola writes “He escrito un libro de recetas, ¡pero nadie lo compró!”.',
          ),
          question(
            'es.ex.j28ynema4q8qho',
            LISTA,
            'What does Paola say she has never done?',
            'Said no to an adventure',
            ['Travelled alone', 'Gone back to Puebla', 'Lived in Monterrey'],
            ['es-jamas', 'es-he-dicho'],
            'She writes “Jamás he dicho que no a una aventura”. Jamás is a strong never.',
          ),
          ex.translateWrite(
            'I have never said that.',
            'Nunca he dicho eso.',
            ['es-he-dicho', 'es-jamas'],
            {
              id: 'es.ex.fizs97tesp743g',
              acceptedAnswers: [
                'Jamás he dicho eso.',
                'No he dicho eso nunca.',
                'No he dicho eso jamás.',
                'Yo nunca he dicho eso.',
                'Yo jamás he dicho eso.',
                'Nunca dije eso.',
                'Jamás dije eso.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Alguna vez has escrito un poema?',
            'Answer with «Sí, he escrito…» or «No, nunca he escrito…».',
            'No, nunca he escrito un poema.',
            [
              'No, nunca he escrito un poema',
              'Sí, he escrito un poema.',
              'Nunca he escrito un poema.',
              'No, jamás he escrito un poema.',
              'Sí, he escrito varios poemas.',
              'Sí, he escrito muchos poemas.',
              'No, nunca.',
              'Sí, una vez.',
            ],
            ['es-he-escrito'],
            { id: 'es.ex.k0rqldazotrelt' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Ya, todavía no, varias veces',
        objective:
          'Say how many times you have done something and what you have or haven’t done yet.',
        intro: {
          explanation:
            'To say how often: una vez (once), dos veces (twice), varias veces (several times), muchas veces, por primera vez (for the first time). Vez is feminine, so it is la primera vez. Ya (already, yet) and todavía no (not yet) often go with the present perfect: ¿Ya has probado la birria? — Todavía no. Conocer means to meet a person or to get to know a place. With a person Spanish adds a: he conocido a mucha gente; with a place, no a: todavía no he conocido Mérida. El idioma (language) is masculine although it ends in -a, like el problema: los idiomas.',
          examples: [
            {
              target: '¿Ya has probado la birria? — Todavía no.',
              base: 'Have you tried birria yet? — Not yet.',
            },
            {
              target: 'He estado en Bogotá varias veces.',
              base: 'I’ve been to Bogotá several times.',
            },
          ],
        },
        takeaways: [
          'You say how many times with una vez, varias veces and por primera vez.',
          'You use ya and todavía no with the present perfect, and conocer a with people.',
        ],
        exercises: [
          ex.translationChoice(
            'el idioma',
            'language',
            ['idiom', 'country', 'word'],
            ['es-el-idioma'],
            { id: 'es.ex.k7uacklbtrf8al' },
          ),
          ex.fillBlank(
            'Hablo tres ___: español, inglés y francés.',
            'I speak three languages: Spanish, English and French.',
            'idiomas',
            ['países', 'veces', 'ciudades'],
            ['es-el-idioma'],
            {
              id: 'es.ex.fk8e4cfo30bdei',
              skill: 'vocabulary',
              explanation:
                'Languages are idiomas. El idioma is masculine although it ends in -a: el idioma, los idiomas.',
            },
          ),
          ex.fillBlank(
            'En este viaje he conocido ___ mucha gente.',
            'On this trip I have met a lot of people.',
            'a',
            ['de', 'en', 'con'],
            ['es-he-conocido'],
            {
              id: 'es.ex.sng7y87gwny8xi',
              explanation:
                'When the object of conocer is a person, Spanish adds a: he conocido a mucha gente. With a place there is no a: he conocido Mérida.',
            },
          ),
          ex.fillBlank(
            'Fui a Mérida por ___ vez en 2021.',
            'I went to Mérida for the first time in 2021.',
            'primera',
            ['primer', 'una', 'varias'],
            ['es-por-primera-vez'],
            {
              id: 'es.ex.ivsqyh598ohgzj',
              explanation:
                'Vez is feminine, so it is primera vez. Notice the preterite fui: the sentence gives a date (en 2021).',
            },
          ),
          ex.listenChoice(
            'He estado en Bogotá varias veces.',
            [
              'He estado en Bogotá muchas veces.',
              'Estuve en Bogotá varias veces.',
              'He estado en Lima varias veces.',
            ],
            ['es-varias-veces'],
            { id: 'es.ex.1nb3e7wmhmafbx' },
          ),
          question(
            'es.ex.e49nvshvaxll67',
            LISTA,
            'What hasn’t Paola learned yet?',
            'To drive',
            ['To cook', 'To speak English', 'To travel alone'],
            ['es-he-conocido'],
            'She writes “Todavía no he aprendido a manejar”: todavía no means not yet.',
          ),
          question(
            'es.ex.4vaxdeignf1rsh',
            FIESTA,
            'Is it Emma’s first time in Guadalajara?',
            'No, she has been there several times',
            [
              'Yes, she arrived this week',
              'Yes, she came with her university',
              'No, she lives in Guadalajara',
            ],
            ['es-varias-veces', 'es-por-primera-vez'],
            'Emma says “No, he venido varias veces. La primera vez fue en 2019, con mi universidad.”',
          ),
          question(
            'es.ex.nk74vz3fzice75',
            FIESTA,
            'What hasn’t Emma done yet in Guadalajara?',
            'Gone to a Chivas football match',
            ['Tried birria', 'Met friendly people', 'Spoken Spanish'],
            ['es-he-probado'],
            'She says she has tried birria (“¡Claro!”), “pero todavía no he ido a un partido de las Chivas”.',
          ),
          ex.translateWrite(
            'I have met a lot of people here.',
            'He conocido a mucha gente aquí.',
            ['es-he-conocido'],
            {
              id: 'es.ex.t73nr7jlz4tt5y',
              acceptedAnswers: [
                'Aquí he conocido a mucha gente.',
                'He conocido a mucha gente acá.',
                'Acá he conocido a mucha gente.',
                'He conocido mucha gente aquí.',
                'Conocí a mucha gente aquí.',
                'Aquí conocí a mucha gente.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Ya has probado la comida mexicana?',
            'Answer with «Sí, ya la he probado…» or «No, todavía no».',
            'Sí, ya la he probado.',
            [
              'Sí, ya la he probado',
              'Sí, ya he probado la comida mexicana.',
              'Sí, la he probado varias veces.',
              'Sí, ya la he probado varias veces.',
              'No, todavía no.',
              'Todavía no.',
              'No, todavía no la he probado.',
              'Sí, ya la probé.',
            ],
            ['es-he-probado'],
            { id: 'es.ex.ew3xarz9pvbde2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Cuándo fue?',
        objective:
          'Say when an experience happened, switching to the preterite as soon as you give a time.',
        intro: {
          explanation:
            'The present perfect talks about an experience without a date: he estado en Oaxaca. As soon as you say when (en 2023, el año pasado, hace dos años, en julio), Spanish uses the preterite: fui a Oaxaca en 2023. So a typical conversation asks with the perfect and continues with the preterite: ¿Has estado en Oaxaca? — Sí, fui en 2023 y me encantó. Me sorprendió (it surprised me) works like me gustó: the thing that surprises you is the subject, so with a plural it is me sorprendieron los precios. Inolvidable (unforgettable) is the same for masculine and feminine: un viaje inolvidable, una experiencia inolvidable.',
          examples: [
            {
              target: 'He estado en Oaxaca. Fui en 2023 con mi hermana.',
              base: 'I’ve been to Oaxaca. I went in 2023 with my sister.',
            },
            {
              target: 'Me sorprendió el mole: es dulce y picante.',
              base: 'The mole surprised me: it’s sweet and spicy.',
            },
          ],
        },
        takeaways: [
          'You use the present perfect for an experience without a date and the preterite when you say when.',
          'You say what surprised you with me sorprendió and describe an inolvidable experience.',
        ],
        exercises: [
          ex.translationChoice(
            'inolvidable',
            'unforgettable',
            ['unbelievable', 'unforgivable', 'unusual'],
            ['es-inolvidable'],
            { id: 'es.ex.3b7hnrmfj0xbw1' },
          ),
          ex.translationChoice(
            'me sorprendió',
            'it surprised me',
            ['I liked it', 'it scared me', 'I remembered it'],
            ['es-me-sorprendio'],
            { id: 'es.ex.nve2p5fmvwors7' },
          ),
          ex.fillBlank(
            'He estado en Oaxaca varias veces; la primera vez ___ en 2023.',
            'I’ve been to Oaxaca several times; the first time I went in 2023.',
            'fui',
            ['he ido', 'voy', 'iba'],
            ['es-varias-veces'],
            {
              id: 'es.ex.91cjm6tf3or1c5',
              explanation:
                'With a specific date (en 2023), use the preterite: fui. He ido would talk about the experience without a date.',
            },
          ),
          ex.fillBlank(
            'El año pasado ___ un viaje inolvidable a Perú.',
            'Last year I took an unforgettable trip to Peru.',
            'hice',
            ['he hecho', 'hago', 'hacer'],
            ['es-he-hecho', 'es-inolvidable'],
            {
              id: 'es.ex.450lbj2inxlu9x',
              explanation:
                'El año pasado is a finished time, so Spanish uses the preterite hice, not he hecho.',
            },
          ),
          ex.fillBlank(
            'Me ___ los precios de Nueva York.',
            'The prices in New York surprised me.',
            'sorprendieron',
            ['sorprendió', 'sorprende'],
            ['es-me-sorprendio'],
            {
              id: 'es.ex.3uqu1veaeprmnj',
              explanation:
                'Sorprender works like gustar: the thing that surprises you is the subject. Los precios is plural, so the verb is sorprendieron.',
            },
          ),
          ex.listenChoice(
            'Fue una experiencia inolvidable.',
            [
              'Fue una experiencia increíble.',
              'Es una experiencia inolvidable.',
              'Fue un viaje inolvidable.',
            ],
            ['es-inolvidable', 'es-la-experiencia'],
            { id: 'es.ex.yaxnz2a3tzxd1f' },
          ),
          question(
            'es.ex.e3r6jogpu3f3w5',
            CORREO,
            'What surprised Lucía?',
            'The black mole, which is sweet and spicy at the same time',
            ['The price of the hotel', 'The weather in Oaxaca', 'The size of Monte Albán'],
            ['es-me-sorprendio'],
            'Lucía writes “Me sorprendió mucho el mole negro: es dulce y picante a la vez”.',
          ),
          question(
            'es.ex.ktje5qrovrqunk',
            CORREO,
            'When did Lucía go to Monte Albán?',
            'On Tuesday',
            ['On Monday', 'On Sunday', 'In 2022'],
            ['es-inolvidable'],
            'She writes “Llegué el lunes y el martes fui a Monte Albán”: she gives the day, so she uses the preterite fui.',
          ),
          ex.translateWrite(
            'I have been to Mexico several times. The first time I went in 2019.',
            'He estado en México varias veces. La primera vez fui en 2019.',
            ['es-varias-veces'],
            {
              id: 'es.ex.bi6v1jdqasy8d3',
              acceptedAnswers: [
                'He estado en México varias veces. La primera vez fue en 2019.',
                'He estado varias veces en México. La primera vez fui en 2019.',
                'He estado en México varias veces, la primera vez fui en 2019.',
                'Estuve en México varias veces. La primera vez fui en 2019.',
              ],
            },
          ),
          ex.shortAnswer(
            'Fuiste a Oaxaca el año pasado, ¿no? ¿Cómo fue?',
            'Say it was an unforgettable trip (use «inolvidable»).',
            'Fue un viaje inolvidable.',
            [
              'Fue un viaje inolvidable',
              '¡Fue un viaje inolvidable!',
              'Sí, fue un viaje inolvidable.',
              'Fue inolvidable.',
              '¡Inolvidable!',
              'Fue una experiencia inolvidable.',
              'Sí, fue una experiencia inolvidable.',
            ],
            ['es-inolvidable'],
            { id: 'es.ex.f4ojwt7uhmp3cy' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Cumplir un sueño',
        objective:
          'Talk about your dreams and the experiences that changed you, combining both past tenses.',
        intro: {
          explanation:
            'El sueño means dream (it also means sleepiness: tengo sueño, I’m sleepy). Mi sueño es + infinitive tells what you dream of doing: mi sueño es vivir en otro país. Cumplir un sueño is “to make a dream come true”: with a date, use the preterite (el año pasado cumplí un sueño); without one, the perfect (he cumplido un sueño). Now combine everything from this unit: the perfect for your experiences (he estado, he probado, nunca he visto…), and the preterite to tell when and how they happened (fui en 2022, me sorprendió…).',
          examples: [
            {
              target: 'Mi sueño es vivir en otro país.',
              base: 'My dream is to live in another country.',
            },
            {
              target: 'El año pasado cumplí un sueño: fui a Japón.',
              base: 'Last year I made a dream come true: I went to Japan.',
            },
          ],
        },
        takeaways: [
          'You talk about dreams with el sueño and cumplir un sueño.',
          'You combine the present perfect (your experiences) and the preterite (when and how) to talk about your life.',
        ],
        exercises: [
          ex.translationChoice(
            'cumplir un sueño',
            'to make a dream come true',
            ['to have a dream', 'to sleep well', 'to forget a dream'],
            ['es-cumplir-un-sueno'],
            { id: 'es.ex.3kuonofzj0hix1' },
          ),
          ex.matchPairs(
            [
              ['el sueño', 'dream'],
              ['el idioma', 'language'],
              ['inolvidable', 'unforgettable'],
              ['jamás', 'never (ever)'],
            ],
            ['es-el-sueno', 'es-el-idioma', 'es-inolvidable', 'es-jamas'],
            { id: 'es.ex.o0mfbodgivjhj4' },
          ),
          ex.fillBlank(
            'Mi ___ es vivir en otro país.',
            'My dream is to live in another country.',
            'sueño',
            ['idioma', 'experiencia', 'vida'],
            ['es-el-sueno'],
            {
              id: 'es.ex.1qi31b132xp96s',
              skill: 'vocabulary',
              explanation:
                'Mi sueño es + infinitive: my dream is to… El sueño also means sleepiness (tengo sueño).',
            },
          ),
          ex.fillBlank(
            'El año pasado ___ un sueño: vi el mar por primera vez.',
            'Last year I made a dream come true: I saw the sea for the first time.',
            'cumplí',
            ['he cumplido', 'cumplir'],
            ['es-cumplir-un-sueno', 'es-por-primera-vez'],
            {
              id: 'es.ex.u04dyai06y5jed',
              explanation:
                'El año pasado is a finished time, so the preterite cumplí is used. He cumplido would be for an experience without a date.',
            },
          ),
          ex.listenChoice(
            'Este año quiero cumplir un sueño.',
            [
              'Este año he cumplido un sueño.',
              'El año pasado cumplí un sueño.',
              'Este año quiero cumplir dos sueños.',
            ],
            ['es-cumplir-un-sueno'],
            { id: 'es.ex.7z99tfl7j6x9f4' },
          ),
          question(
            'es.ex.fchnk5dr9myix4',
            RADIO,
            'Which country hasn’t Valeria visited yet?',
            'Argentina, but she is going next year',
            ['Japan', 'Peru', 'Mexico'],
            ['es-jamas'],
            'She says “Todavía no he visitado Argentina, pero voy a ir el próximo año”.',
          ),
          question(
            'es.ex.ruzkmdd01e2aof',
            CORREO,
            'What does Lucía ask Marta?',
            'What she liked most when she was in Oaxaca',
            ['When she is coming to Oaxaca', 'If she has ever tried mole', 'Where she should stay'],
            ['es-he-probado'],
            'Lucía writes “Tú estuviste aquí en 2022, ¿verdad? ¿Qué te gustó más?”. Estuviste is preterite because there is a date.',
          ),
          question(
            'es.ex.29ckzvwh6r10cv',
            FIESTA,
            'What does Rodrigo suggest to Emma?',
            'Going to a Chivas match together on Sunday',
            ['Trying birria on Sunday', 'Visiting his university', 'Speaking French together'],
            ['es-he-conocido'],
            'Rodrigo says “Yo he ido muchas veces. Si quieres, el domingo vamos juntos”, and Emma answers “¡Me encantaría!”.',
          ),
          ex.translateWrite(
            'I have never been to Japan, but it is my dream.',
            'Nunca he estado en Japón, pero es mi sueño.',
            ['es-el-sueno', 'es-jamas'],
            {
              id: 'es.ex.vn80owl2y4nvzh',
              acceptedAnswers: [
                'Jamás he estado en Japón, pero es mi sueño.',
                'Nunca he estado en Japón pero es mi sueño.',
                'No he estado nunca en Japón, pero es mi sueño.',
                'Nunca he ido a Japón, pero es mi sueño.',
                'Nunca estuve en Japón, pero es mi sueño.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cuál es tu sueño?',
            'Say what your dream is (Mi sueño es + infinitive).',
            'Mi sueño es viajar por todo el mundo.',
            [
              'Mi sueño es viajar por todo el mundo',
              'Mi sueño es viajar.',
              'Mi sueño es vivir en otro país.',
              'Mi sueño es ir a Japón.',
              'Mi sueño es hablar español muy bien.',
              'Mi sueño es conocer México.',
              'Mi sueño es ver el mar.',
            ],
            ['es-el-sueno'],
            { id: 'es.ex.9eessrvepgoepw' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Participios del perfecto que la unidad enseña o usa. */
const PARTICIPIOS =
  'visto|hecho|dicho|escrito|vuelto|probado|conocido|estado|sido|vivido|visitado|venido|ido|aprendido|cumplido|abierto|roto|puesto';
/** Indefinidos frecuentes (yo y él / ella) para contar cuándo pasó. */
const INDEFINIDOS =
  'fui|fue|vi|vio|hice|hizo|comí|comió|conocí|estuve|estuvo|llegué|llegó|volví|cumplí|tuve|sorprendió|sorprendieron|gustó|encantó|salí|viajamos|vimos';

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U01_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.experiencia',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u01-l05',
    title: 'An unforgettable experience',
    instructions:
      'Write about an unforgettable experience (real or invented). Use the present perfect for your experiences without a date (he estado, nunca he visto…), then tell when it happened and what it was like with the preterite and a time expression (en 2022, el año pasado…).',
    prompts: ['¿Alguna vez has cumplido un sueño?', '¿Cuándo fue y qué te sorprendió?'],
    glossary: [{ term: 'cuy', meaning: 'guinea pig (a traditional dish in Peru)' }],
    requirements: [
      {
        id: 'perfect',
        label: 'You use the present perfect (he visto, he hecho, he estado…)',
        kind: 'pattern',
        patterns: [['he|has|ha|hemos|han', PARTICIPIOS]],
      },
      {
        id: 'preterite',
        label: 'You use the preterite to tell what happened (fui, vi, comí…)',
        kind: 'pattern',
        patterns: [[INDEFINIDOS]],
      },
      {
        id: 'when',
        label: 'You say when it happened (en 2022, el año pasado, hace dos años, en julio…)',
        kind: 'pattern',
        patterns: [
          ['en', '<NUMBER>'],
          ['hace', '<WORD>'],
          ['pasado'],
          [
            'en',
            'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre',
          ],
        ],
      },
      ...common(5),
    ],
    model:
      'Mi sueño siempre fue viajar a Perú. En 2022 fui allá con mi hermana y cumplí mi sueño. Llegué a Cusco en julio y una semana después vimos Machu Picchu al amanecer. Me sorprendió mucho: nunca he visto nada tan bonito en mi vida. También comí cuy por primera vez, pero no me gustó. He hecho muchos viajes, pero este es el mejor de todos.',
    checklist: [
      'I use the present perfect (he visto, he hecho, nunca he…) for experiences without a date.',
      'When I say when (en 2022, el año pasado), I switch to the preterite: fui, vi, comí.',
      'I say how I felt: me sorprendió, fue inolvidable, me encantó.',
    ],
  },
];
