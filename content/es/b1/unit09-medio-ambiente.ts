import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U9 «Environment and society» (docs/ES_B1.md §3): hablar del medio ambiente y de la
 * comunidad. Gramática: el se impersonal y el se pasivo (aquí se recicla, no se venden bolsas, se
 * plantaron cien árboles), con el verbo que concuerda con el sustantivo (se recicla el papel / se
 * reciclan las botellas); la voz pasiva con ser + participio (el mercado fue creado por los vecinos),
 * con el participio que concuerda (fue creado / fue creada / fueron limpiados); la opinión negada o
 * dudosa con subjuntivo (no creo que sea, dudo que cambie) frente a creo que + indicativo (creo que es).
 * Variante: español neutro de Latinoamérica, con tú y ustedes; léxico mexicano general (el bote de
 * basura, el carro; el camión es aquí el de la basura). Lugares: Monterrey, Xalapa (Veracruz), Puebla y
 * Bogotá.
 * Pronunciación: la c de reciclar y reciclaje (ci = si por el seseo: re-si-CLAR) y la j de reciclaje
 * (como una h inglesa fuerte); el acento de contaminación y energía (e-ner-GÍ-a, sin diptongo).
 * Cultura: separar la basura (orgánica e inorgánica) es obligatorio en la Ciudad de México desde hace
 * pocos años y muchos barrios organizan jornadas de limpieza y mercados de trueque; se menciona en las
 * explicaciones, sin datos ni cifras reales.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

/** L1 · Una estudiante de Xalapa escribe sobre la naturaleza de su ciudad. */
const XALAPA = reading(
  'es.stim.b1-u9-xalapa',
  'post',
  'Paula writes a post about nature in her city.',
  [
    'Vivo en Xalapa, una ciudad de Veracruz con mucha naturaleza.',
    'Cerca de mi casa hay un bosque muy bonito, donde me gusta caminar los domingos.',
    'Sin embargo, cada año hace más calor y llueve menos.',
    'Creo que es por el cambio climático.',
    'También los carros y las fábricas contaminan el aire de la ciudad.',
    'Por eso, desde hace un año voy al trabajo en bicicleta.',
    'Es poco, pero todos podemos hacer algo para proteger el medio ambiente.',
  ],
  { from: 'Paula' },
);

/** L2 · Programa de radio sobre el reciclaje en Monterrey. */
const RADIO = dialogue(
  'es.stim.b1-u9-radio',
  'A radio presenter in Monterrey talks to a man who organizes recycling in his neighborhood.',
  [
    [
      'Diana',
      'Buenos días, Monterrey. Hoy hablamos del reciclaje. Está con nosotros Rodrigo, que organiza el reciclaje en su barrio.',
    ],
    ['Rodrigo', 'Gracias, Diana. En mi barrio se recicla mucho más que hace dos años.'],
    ['Diana', '¿Y cómo se hace? ¿Qué se recicla?'],
    [
      'Rodrigo',
      'Se separa la basura en casa: el papel, el vidrio y el plástico van en bolsas diferentes.',
    ],
    ['Diana', '¿Y quién lleva todo eso a reciclar?'],
    ['Rodrigo', 'Los sábados, los vecinos llevan las bolsas a la plaza y un camión se las lleva.'],
    ['Diana', '¿Qué es lo más difícil?'],
    [
      'Rodrigo',
      'Las fiestas. Se usa mucho plástico y la gente no separa nada. Tenemos que reciclar también ese día.',
    ],
  ],
  ES_B1_RATE,
);

/** L3 · Cartel de una jornada de voluntarios en un bosque de Puebla. */
const JORNADA = reading(
  'es.stim.b1-u9-jornada',
  'sign',
  'A poster at a community center in Puebla.',
  [
    '¡El bosque necesita voluntarios!',
    'El sábado 14 de marzo, de 8 a 13 horas, vamos a limpiar el bosque del barrio.',
    'El año pasado, el bosque fue limpiado por 200 voluntarios y se plantaron 300 árboles.',
    'Este año se van a plantar 500 árboles más.',
    'Puede venir toda la familia: los niños van con sus papás.',
    'Por favor, trae tu botella de agua: en el bosque no se usa plástico.',
    'Organiza la comunidad del barrio. ¡Te esperamos!',
  ],
);

/** L4 · Dos vecinos de la Ciudad de México hablan de la contaminación del río. */
const VECINOS = dialogue(
  'es.stim.b1-u9-vecinos',
  'Two neighbors in Mexico City talk about the river near their street.',
  [
    ['Valeria', 'Oye, Andrés, ¿viste el río? Hay mucha basura otra vez.'],
    ['Andrés', 'Sí, ¡qué mal! Creo que la fábrica de la esquina contamina el agua.'],
    [
      'Valeria',
      'No sé, no creo que sea la fábrica. Creo que es la basura de las calles: cuando llueve, llega al río.',
    ],
    ['Andrés', 'Puede ser. Pero dudo que la ciudad haga algo pronto.'],
    ['Valeria', 'Entonces, ¿por qué no vamos a limpiar el río el domingo con los vecinos?'],
    ['Andrés', 'Me parece bien. Y la calle necesita más botes de basura.'],
    ['Valeria', 'Perfecto. Yo hablo con los vecinos de la esquina.'],
  ],
  ES_B1_RATE,
);

/** L4–L5 · Artículo sobre un mercado sin plástico en Bogotá. */
const MERCADO = reading(
  'es.stim.b1-u9-mercado',
  'description',
  'An article in a local newspaper in Bogotá.',
  [
    'En un barrio de Bogotá hay un mercado diferente: acá no se usa plástico.',
    'El mercado fue creado hace tres años por los vecinos del barrio.',
    'No se venden bolsas: cada cliente trae sus bolsas y sus botellas.',
    'El café, el pan y el queso se venden sin plástico.',
    'Los vecinos están contentos: ahora hay mucha menos basura en el barrio.',
    'Sin embargo, para algunos clientes, los precios son altos.',
    '«No creo que sea más caro. Solo es diferente», dice Marta, una vecina.',
    'Ahora la comunidad quiere abrir dos mercados más en la ciudad.',
  ],
);

export const ES_B1_U09: EsUnitDef = {
  names: [
    'Paula',
    'Xalapa',
    'Veracruz',
    'Diana',
    'Rodrigo',
    'Monterrey',
    'Puebla',
    'Valeria',
    'Andrés',
    'Bogotá',
    'Marta',
  ],
  support: [
    'recicla',
    'reciclan',
    'recicle',
    'separa',
    'venden',
    'vende',
    'contamina',
    'contaminan',
    'contamine',
    'proteja',
    'gastamos',
    'organiza',
    'plantar',
    'plantaron',
    'crees',
    'fueron',
    'creado',
    'limpiado',
    'papel',
    'vidrio',
    'botella',
    'bolsa',
    'bote',
    'fábrica',
    'aire',
    'río',
    'pronto',
  ],
  unit: {
    position: 9,
    title: 'Environment and society',
    titleEn: 'Medio ambiente y sociedad',
    description:
      'Talk about the environment and your community: say what is done with se (se recicla, se venden), use the passive with ser + participle (fue creado por…) and give a nuanced opinion with no creo que and dudo que + subjunctive.',
    emoji: '♻️',
    objective:
      'You can talk about environmental and community problems, explain what is done to solve them and give a nuanced opinion, saying what you think, what you don’t think and what you doubt.',
    grammar: {
      title: 'Se recicla, se venden · fue creado por · no creo que + subjunctive',
      explanation:
        'Spanish often says what is done without saying who does it with se + a verb in the third person. When there is a noun, the verb agrees with it: se recicla el papel (paper is recycled), but se reciclan las botellas (bottles are recycled); se vende fruta, se venden bolsas. This is the “passive se”, and it is the most natural way to translate English passives like “is recycled” or “are sold”. Without a noun, se + a singular verb means “people / you / one” in general: aquí se vive bien (people live well here), ¿cómo se dice…? There is also a passive like the English one, with ser + participle + por (by): el mercado fue creado por los vecinos (the market was created by the neighbors). The participle agrees like an adjective: el bosque fue limpiado, la plaza fue limpiada, los árboles fueron plantados. This passive sounds more formal and is typical of news and written texts; in conversation, people prefer se or an active sentence (los vecinos crearon el mercado). Opinions: creo que is followed by the normal verb (the indicative): creo que es la fábrica. But when you deny or doubt something, Spanish switches to the subjunctive: no creo que sea la fábrica (I don’t think it’s the factory), dudo que la ciudad haga algo (I doubt the city will do anything). Present subjunctive endings swap the vowel: -ar verbs take -e (reciclar → recicle, cambiar → cambie), -er / -ir verbs take -a (hacer → haga, tener → tenga); ser → sea and haber → haya are irregular. Note: the subjunctive after dudo que often translates as “will” in English: dudo que cambie = I doubt it will change.',
      examples: [
        {
          target: 'En mi barrio se recicla el papel y se reciclan las botellas.',
          base: 'In my neighborhood, paper is recycled and bottles are recycled.',
        },
        {
          target: 'El mercado fue creado por los vecinos del barrio.',
          base: 'The market was created by the people of the neighborhood.',
        },
        {
          target: 'Creo que la fábrica contamina, pero no creo que sea el problema más grande.',
          base: 'I think the factory pollutes, but I don’t think it’s the biggest problem.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U9), español neutro con tú. Sin revisión nativa. Revisar: (1) la explicación del se pasivo frente al impersonal (se recicla el papel / se reciclan las botellas) y si conviene aceptar la falta de concordancia coloquial («se vende casas») en las respuestas: no se acepta; con sujeto compuesto se enseña el plural (se reciclan el papel y el plástico) y se acepta el singular, muy frecuente (se recicla el papel y el plástico); (2) se usa «el barrio» en todos los textos (no «la colonia», más mexicana, para ahorrar apoyo); «el bote de basura» (México) sin alternativa mostrada (en otros países: el basurero, la caneca en Colombia, el tacho): ¿agregar acceptedAnswers?; (3) «el camión» en Monterrey es aquí el camión de la basura (en México también es el autobús): ¿puede confundir?; (4) la pasiva con ser + participio presentada como formal y escrita: ¿está bien el ejemplo «el bosque fue limpiado por 200 voluntarios» o suena forzado frente a «200 voluntarios limpiaron el bosque»?; (5) «dudo que la ciudad haga algo» traducido como «I doubt the city will do anything»; (6) no se enseña «no dudo que + indicativo» ni la alternancia «no creo que + indicativo» que se oye en el habla (no creo que es…); el fill_blank evita «fue» como distractor tras «no creo que» por eso; (7) «gastar» se practica con energía y agua (gastar agua, gastar menos energía), no sólo con dinero: ¿natural en todos los países? (también «usar», «consumir»); (8) «trae tu botella» (imperativo de tú) en un cartel: ¿mejor «traigan» (ustedes)?; (9) la nota cultural sobre la separación de basura (orgánica / inorgánica) va sin fechas ni cifras; (10) «acá» en el mercado de Bogotá y en los ejercicios porque «aquí» no está enseñado todavía (las dos son generales); (11) «también» al principio de oración en lugar de «además» (no enseñado): revisar si suena natural; (12) «Puede ser» y «¡qué mal!» como reacciones en el diálogo de los vecinos.',
    },
    words: [
      w(
        'es-el-medio-ambiente',
        'el medio ambiente',
        'the environment',
        'Todos podemos hacer algo para proteger el medio ambiente.',
        'We can all do something to protect the environment.',
        ['b1', 'environment'],
        { acceptedTranslations: ['environment'], emoji: '🌎' },
      ),
      w(
        'es-la-naturaleza',
        'la naturaleza',
        'nature',
        'Me encanta caminar en la naturaleza los domingos.',
        'I love walking in nature on Sundays.',
        ['b1', 'environment'],
        { emoji: '🌿' },
      ),
      w(
        'es-reciclar',
        'reciclar',
        'to recycle',
        'En mi casa queremos reciclar todo el papel.',
        'At home we want to recycle all the paper.',
        ['b1', 'environment', 'verbs'],
      ),
      w(
        'es-la-basura',
        'la basura',
        'trash',
        'Hay mucha basura en el río otra vez.',
        'There’s a lot of trash in the river again.',
        ['b1', 'environment'],
        { acceptedTranslations: ['rubbish', 'garbage', 'the trash'], emoji: '🗑️' },
      ),
      w(
        'es-la-contaminacion',
        'la contaminación',
        'pollution',
        'La contaminación del aire es un problema en las ciudades grandes.',
        'Air pollution is a problem in big cities.',
        ['b1', 'environment'],
        { acceptedTranslations: ['the pollution'], emoji: '🏭' },
      ),
      w(
        'es-contaminar',
        'contaminar',
        'to pollute',
        'Los carros contaminan el aire de la ciudad.',
        'Cars pollute the city’s air.',
        ['b1', 'environment', 'verbs'],
      ),
      w(
        'es-proteger',
        'proteger',
        'to protect',
        'Tenemos que proteger la naturaleza.',
        'We have to protect nature.',
        ['b1', 'environment', 'verbs'],
      ),
      w(
        'es-la-energia',
        'la energía',
        'energy',
        'En casa gastamos menos energía que antes.',
        'At home we use less energy than before.',
        ['b1', 'environment'],
        { acceptedTranslations: ['the energy'], emoji: '⚡' },
      ),
      w(
        'es-el-plastico',
        'el plástico',
        'plastic',
        'En este mercado no se usa plástico.',
        'No plastic is used in this market.',
        ['b1', 'environment'],
        { acceptedTranslations: ['the plastic'] },
      ),
      w(
        'es-el-bosque',
        'el bosque',
        'forest',
        'Cerca de mi casa hay un bosque muy bonito.',
        'There’s a very beautiful forest near my house.',
        ['b1', 'environment'],
        { acceptedTranslations: ['the forest', 'woods'], emoji: '🌲' },
      ),
      w(
        'es-el-cambio-climatico',
        'el cambio climático',
        'climate change',
        'Creo que el cambio climático es un problema de todos.',
        'I think climate change is everyone’s problem.',
        ['b1', 'environment'],
        { emoji: '🌡️' },
      ),
      w(
        'es-gastar',
        'gastar',
        'to use up',
        'Tenemos que gastar menos agua y menos energía.',
        'We have to use less water and less energy.',
        ['b1', 'verbs'],
        { acceptedTranslations: ['to spend', 'to waste'] },
      ),
      w(
        'es-el-voluntario',
        'el voluntario',
        'volunteer',
        'El sábado fui voluntario en el bosque.',
        'On Saturday I was a volunteer in the forest.',
        ['b1', 'society'],
        { acceptedTranslations: ['the volunteer'], emoji: '🙋' },
      ),
      w(
        'es-la-comunidad',
        'la comunidad',
        'community',
        'La comunidad del barrio hizo una fiesta para todos.',
        'The neighborhood community had a party for everyone.',
        ['b1', 'society'],
        { acceptedTranslations: ['the community'] },
      ),
      w(
        'es-no-creo-que',
        'no creo que',
        "I don't think that",
        'No creo que sea la fábrica.',
        'I don’t think it’s the factory.',
        ['b1', 'opinions', 'subjunctive'],
      ),
      w(
        'es-dudo-que',
        'dudo que',
        'I doubt that',
        'Dudo que la ciudad haga algo pronto.',
        'I doubt the city will do anything soon.',
        ['b1', 'opinions', 'subjunctive'],
      ),
      w(
        'es-el-reciclaje',
        'el reciclaje',
        'recycling',
        'El reciclaje es más fácil cuando se separa la basura en casa.',
        'Recycling is easier when trash is separated at home.',
        ['b1', 'environment'],
        { acceptedTranslations: ['the recycling'], emoji: '♻️' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'El medio ambiente',
        objective: 'Talk about nature and the main environmental problems.',
        intro: {
          explanation:
            'El medio ambiente (the environment) is two words and always takes the article el: proteger el medio ambiente. La naturaleza is nature in general, and el bosque a forest. La contaminación (pollution) comes from contaminar (to pollute), a regular -ar verb: los carros contaminan el aire. Words in -ción are always feminine and lose the accent in the plural: la contaminación. Climate change is el cambio climático: in Spanish the adjective goes after the noun. Proteger (to protect) changes g to j only before o and a: protejo (I protect), but proteges, protege, protegemos. Pronunciation: contaminación is stressed on the last syllable (con-ta-mi-na-CIÓN), and the c before i sounds like s in Latin America.',
          examples: [
            {
              target: 'Los carros contaminan el aire de la ciudad.',
              base: 'Cars pollute the city’s air.',
            },
            {
              target: 'Tenemos que proteger la naturaleza.',
              base: 'We have to protect nature.',
            },
          ],
        },
        takeaways: [
          'You name nature and the environment: el medio ambiente, la naturaleza, el bosque.',
          'You talk about problems like la contaminación and el cambio climático.',
        ],
        exercises: [
          ex.translationChoice(
            'el medio ambiente',
            'the environment',
            ['nature', 'climate change', 'pollution'],
            ['es-el-medio-ambiente'],
            { id: 'es.ex.kk5tybvk5xj0mh' },
          ),
          ex.matchPairs(
            [
              ['la naturaleza', 'nature'],
              ['el bosque', 'forest'],
              ['la contaminación', 'pollution'],
              ['el cambio climático', 'climate change'],
            ],
            ['es-la-naturaleza', 'es-el-bosque', 'es-la-contaminacion', 'es-el-cambio-climatico'],
            { id: 'es.ex.zp2kcmr2boco2f' },
          ),
          ex.imageChoice(
            '🌲',
            'el bosque',
            ['la playa', 'la montaña', 'el mar'],
            ['es-el-bosque'],
            {
              id: 'es.ex.83tgm9u3yftoly',
            },
          ),
          ex.fillBlank(
            'Los carros ___ el aire de la ciudad.',
            'Cars pollute the city’s air.',
            'contaminan',
            ['contaminación', 'contamina', 'contaminar'],
            ['es-contaminar', 'es-proteger'],
            {
              id: 'es.ex.sjscmmaca12j1c',
              explanation:
                'The subject is los carros (plural), so the verb is plural: contaminan. Contamina is singular (la fábrica contamina) and la contaminación is the noun (pollution).',
            },
          ),
          ex.listenChoice(
            'Tenemos que proteger la naturaleza.',
            [
              'Tenemos que proteger el bosque.',
              'Queremos proteger la naturaleza.',
              'Tenemos que caminar en la naturaleza.',
            ],
            ['es-proteger', 'es-la-naturaleza'],
            { id: 'es.ex.xp0jmkkam921ex' },
          ),
          question(
            'es.ex.l9r4e616ba3g7p',
            XALAPA,
            'Why does Paula think it is hotter every year?',
            'Because of climate change',
            ['Because of the factories', 'Because there is no forest', 'Because it rains a lot'],
            ['es-el-cambio-climatico'],
            'Paula writes “cada año hace más calor y llueve menos. Creo que es por el cambio climático”.',
          ),
          question(
            'es.ex.p0o8f64gzi3o53',
            XALAPA,
            'What does Paula do to help the environment?',
            'She cycles to work',
            [
              'She walks in the forest every day',
              'She sold her car last year',
              'She works in a factory',
            ],
            ['es-el-medio-ambiente', 'es-proteger', 'es-contaminar'],
            'She writes “desde hace un año voy al trabajo en bicicleta”, because cars and factories pollute the air.',
          ),
          ex.orderWords(
            'El cambio climático es un problema de todos.',
            'Climate change is everyone’s problem.',
            ['es-el-cambio-climatico'],
            { id: 'es.ex.hzbbf20anc1qtz' },
          ),
          ex.translateWrite(
            'Pollution is a big problem in my city.',
            'La contaminación es un gran problema en mi ciudad.',
            ['es-la-contaminacion'],
            {
              id: 'es.ex.hbdc7ypkqnh3s9',
              acceptedAnswers: [
                'La contaminación es un problema grande en mi ciudad.',
                'La contaminación es un gran problema en mi ciudad',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué haces para proteger el medio ambiente?',
            'Say one thing you do (e.g. you go to work by bike: voy al trabajo en bicicleta).',
            'Voy al trabajo en bicicleta.',
            [
              'Voy en bicicleta al trabajo.',
              'Voy al trabajo en bicicleta para proteger el medio ambiente.',
              'Para proteger el medio ambiente, voy al trabajo en bicicleta.',
              'Camino al trabajo.',
              'Voy al trabajo en autobús.',
              'Voy al trabajo en metro.',
            ],
            ['es-proteger', 'es-el-medio-ambiente'],
            { id: 'es.ex.hok3a7wn18mfz7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Se recicla',
        objective: 'Say what is done, in general, with se + verb: se recicla, se separan.',
        intro: {
          explanation:
            'To say what is done without saying who does it, Spanish uses se + a verb in the third person. If the noun is singular, the verb is singular: se recicla el papel (paper is recycled). If the noun is plural, the verb is plural: se reciclan las botellas, se separan las bolsas. Without a noun, se + verb means “people / you” in general: en mi barrio se recicla mucho (people recycle a lot in my neighborhood). La basura is uncountable, like trash: la basura (never “las basuras” for “trash”). In Mexico the trash can is el bote de basura. Pronunciation: in reciclaje, the c before i sounds like s (re-si-CLA-je) and the j is like a strong English h. Many Mexican neighborhoods now separate trash into organic (orgánica) and inorganic (inorgánica).',
          examples: [
            {
              target: 'En mi barrio se recicla mucho más que antes.',
              base: 'People recycle much more than before in my neighborhood.',
            },
            {
              target: 'Acá se reciclan el papel y el plástico.',
              base: 'Paper and plastic are recycled here.',
            },
          ],
        },
        takeaways: [
          'You say what is done with se + verb: se recicla el papel, se reciclan las botellas.',
          'You talk about trash and recycling: la basura, el plástico, el reciclaje.',
        ],
        exercises: [
          ex.translationChoice(
            'el reciclaje',
            'recycling',
            ['trash', 'plastic', 'energy'],
            ['es-el-reciclaje'],
            { id: 'es.ex.di2hfvuw5tttvd' },
          ),
          ex.matchPairs(
            [
              ['reciclar', 'to recycle'],
              ['la basura', 'trash'],
              ['el plástico', 'plastic'],
              ['el reciclaje', 'recycling'],
            ],
            ['es-reciclar', 'es-la-basura', 'es-el-plastico', 'es-el-reciclaje'],
            { id: 'es.ex.q44amyvwnso7jg' },
          ),
          ex.fillBlank(
            'En mi casa se ___ las botellas de plástico.',
            'At home, plastic bottles are recycled.',
            'reciclan',
            ['recicla', 'reciclaje', 'reciclar'],
            ['es-reciclar', 'es-el-plastico'],
            {
              id: 'es.ex.e0fki5vbnzxp6z',
              explanation:
                'With se, the verb agrees with the noun: las botellas is plural, so se reciclan. Se recicla goes with a singular noun (se recicla el papel).',
            },
          ),
          ex.fillBlank(
            'Acá ___ separa la basura en tres bolsas.',
            'Here trash is separated into three bags.',
            'se',
            ['es', 'le', 'lo'],
            ['es-la-basura'],
            {
              id: 'es.ex.zkh9qut7jbaon3',
              explanation:
                'Se + verb says what is done without saying who does it: se separa la basura (trash is separated).',
            },
          ),
          ex.listenChoice(
            'Se reciclan el papel y el vidrio.',
            [
              'Se reciclan el papel y el plástico.',
              'Se recicla el plástico.',
              'No se reciclan el papel ni el vidrio.',
            ],
            ['es-reciclar'],
            { id: 'es.ex.bvsjqbvm1nx8aw' },
          ),
          question(
            'es.ex.7ibju1bykv1w7d',
            RADIO,
            'How is trash separated in Rodrigo’s neighborhood?',
            'At home, in different bags for paper, glass and plastic',
            [
              'At the recycling center, by a truck driver',
              'In the square, only on Sundays',
              'It isn’t separated at all',
            ],
            ['es-la-basura', 'es-el-plastico', 'es-reciclar'],
            'Rodrigo says “Se separa la basura en casa: el papel, el vidrio y el plástico van en bolsas diferentes”.',
          ),
          question(
            'es.ex.p6cnsqjciporlh',
            RADIO,
            'According to Rodrigo, what is the most difficult moment for recycling?',
            'Parties, because a lot of plastic is used and nobody separates it',
            [
              'Saturdays, because the truck is late',
              'Winter, because it rains',
              'Mondays, because there is too much paper',
            ],
            ['es-el-plastico', 'es-el-reciclaje'],
            'He answers “Las fiestas. Se usa mucho plástico y la gente no separa nada”.',
          ),
          ex.orderWords(
            'En mi barrio se recicla mucho más que antes.',
            'People recycle much more than before in my neighborhood.',
            ['es-reciclar'],
            { id: 'es.ex.elobr9c257brmc' },
          ),
          ex.translateWrite(
            'Plastic is recycled here.',
            'Acá el plástico se recicla.',
            ['es-reciclar', 'es-el-plastico'],
            {
              id: 'es.ex.7dib56ulfo42fi',
              acceptedAnswers: [
                'Acá se recicla el plástico.',
                'Se recicla el plástico acá.',
                'El plástico se recicla acá.',
                'Aquí se recicla el plástico.',
                'Acá el plástico se recicla.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué se recicla en tu casa?',
            'Say what is recycled at home (e.g. paper and plastic: se reciclan el papel y el plástico).',
            'En mi casa se reciclan el papel y el plástico.',
            [
              'Se reciclan el papel y el plástico.',
              'En mi casa se recicla el papel y el plástico.',
              'Se recicla el papel y el plástico.',
              'En mi casa se recicla el plástico.',
              'Se recicla el plástico.',
              'Se recicla el papel.',
              'Se recicla el vidrio.',
              'En mi casa se recicla el papel, el vidrio y el plástico.',
              'En mi casa no se recicla nada.',
            ],
            ['es-reciclar', 'es-el-plastico'],
            { id: 'es.ex.uu1jg4g1hgjv6l' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Fue creado por…',
        objective: 'Use the passive with ser + participle and talk about volunteering.',
        intro: {
          explanation:
            'Spanish also has a passive like the English one: ser + participle + por (by). Fue (was) is the preterite of ser: el bosque fue limpiado por 200 voluntarios. The participle agrees like an adjective: el mercado fue creado, la plaza fue limpiada, los árboles fueron plantados. This passive is more typical of news, posters and written texts; in conversation people usually say se plantaron 300 árboles or los voluntarios plantaron 300 árboles. A volunteer is el voluntario or la voluntaria, and la comunidad is the community. Gastar means to spend money, but also to use up water or energy: gastar menos energía. La energía has a stressed í: e-ner-GÍ-a.',
          examples: [
            {
              target: 'El bosque fue limpiado por 200 voluntarios.',
              base: 'The forest was cleaned by 200 volunteers.',
            },
            {
              target: 'En casa gastamos menos energía que antes.',
              base: 'At home we use less energy than before.',
            },
          ],
        },
        takeaways: [
          'You use the passive with fue / fueron + participle + por.',
          'You talk about volunteers, the community and using less energy.',
        ],
        exercises: [
          ex.translationChoice(
            'el voluntario',
            'volunteer',
            ['neighbor', 'boss', 'witness'],
            ['es-el-voluntario'],
            { id: 'es.ex.b5zm053jhlhhxa' },
          ),
          ex.matchPairs(
            [
              ['el voluntario', 'volunteer'],
              ['la comunidad', 'community'],
              ['la energía', 'energy'],
              ['gastar', 'to use up'],
            ],
            ['es-el-voluntario', 'es-la-comunidad', 'es-la-energia', 'es-gastar'],
            { id: 'es.ex.xbivfxmdg002ve' },
          ),
          ex.fillBlank(
            'El mercado fue ___ por los vecinos del barrio.',
            'The market was created by the people of the neighborhood.',
            'creado',
            ['creada', 'creados', 'creadas'],
            ['es-la-comunidad'],
            {
              id: 'es.ex.ohx4lnln8io2ae',
              explanation:
                'In the passive, the participle agrees with the subject: el mercado is masculine singular, so fue creado. La plaza fue creada; los mercados fueron creados.',
            },
          ),
          ex.fillBlank(
            'Las calles ___ limpiadas por los voluntarios.',
            'The streets were cleaned by the volunteers.',
            'fueron',
            ['fue', 'son', 'era'],
            ['es-el-voluntario'],
            {
              id: 'es.ex.f866gkksvzaob6',
              explanation:
                'Las calles is plural, so the preterite of ser is fueron (were): fueron limpiadas. Fue is singular: la calle fue limpiada.',
            },
          ),
          ex.fillBlank(
            'En casa ___ menos energía que antes.',
            'At home we use less energy than before.',
            'gastamos',
            ['gastar', 'reciclar', 'contaminar'],
            ['es-gastar', 'es-la-energia'],
            {
              id: 'es.ex.5mev6hgl4scnu3',
              explanation:
                'Gastar is used for money, but also for water and energy: gastar energía = to use energy. We: gastamos.',
            },
          ),
          ex.listenChoice(
            'El bosque fue limpiado por los voluntarios.',
            [
              'El bosque fue limpiado por los vecinos.',
              'El bosque fue limpiado por los niños.',
              'La plaza fue limpiada por los voluntarios.',
            ],
            ['es-el-bosque', 'es-el-voluntario'],
            { id: 'es.ex.v6aguexo593dhe' },
          ),
          question(
            'es.ex.jn8bbskqh95bvk',
            JORNADA,
            'What happened in the forest last year?',
            'Volunteers cleaned it and planted trees',
            ['There was a big fire', 'A new market was opened', 'Nobody came to help'],
            ['es-el-bosque', 'es-el-voluntario'],
            'The poster says “El año pasado, el bosque fue limpiado por 200 voluntarios y se plantaron 300 árboles”.',
          ),
          question(
            'es.ex.31s0q4gtx589rb',
            JORNADA,
            'What are people asked to bring, and why?',
            'Their own bottle of water, because no plastic is used in the forest',
            [
              'Plastic bags, to collect the trash',
              'Food for the volunteers',
              'A tree, because there are no trees',
            ],
            ['es-el-plastico', 'es-la-comunidad'],
            'The poster says “Por favor, trae tu botella de agua: en el bosque no se usa plástico”.',
          ),
          ex.translateWrite(
            'The street was cleaned by the community.',
            'La calle fue limpiada por la comunidad.',
            ['es-la-comunidad'],
            {
              id: 'es.ex.tuxg0hnojm8c4z',
              acceptedAnswers: [
                'La comunidad limpió la calle.',
                'La calle fue limpiada por la comunidad',
              ],
            },
          ),
          ex.translateWrite(
            'We have to use less energy.',
            'Tenemos que gastar menos energía.',
            ['es-gastar', 'es-la-energia'],
            {
              id: 'es.ex.4nj3l0e4umob6o',
              acceptedAnswers: [
                'Tenemos que usar menos energía.',
                'Hay que gastar menos energía.',
                'Debemos gastar menos energía.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'No creo que sea…',
        objective:
          'Give a nuanced opinion: creo que + indicative, no creo que and dudo que + subjunctive.',
        intro: {
          explanation:
            'Creo que (I think that) is followed by the normal verb, the indicative: creo que es la fábrica. When you deny or doubt something, Spanish uses the subjunctive: no creo que sea la fábrica (I don’t think it’s the factory), dudo que la ciudad haga algo (I doubt the city will do anything). The present subjunctive swaps the typical vowel: -ar verbs take e (cambiar → cambie, reciclar → recicle), -er / -ir verbs take a (hacer → haga, tener → tenga, poder → pueda). Ser → sea and haber → haya are irregular. A useful way to think about it: creo que states something as true, while no creo que and dudo que talk about something you do not accept as true. To sound polite in a discussion, start softly: Mmm, no creo que…',
          examples: [
            {
              target: 'Creo que es la fábrica.',
              base: 'I think it’s the factory.',
            },
            {
              target: 'No creo que sea la fábrica.',
              base: 'I don’t think it’s the factory.',
            },
          ],
        },
        takeaways: [
          'You say what you think with creo que + indicative (creo que es).',
          'You say what you don’t think or doubt with no creo que / dudo que + subjunctive (no creo que sea).',
        ],
        exercises: [
          ex.translationChoice(
            'dudo que',
            'I doubt that',
            ['I don’t think that', 'I think that', 'I hope that'],
            ['es-dudo-que'],
            { id: 'es.ex.ig8k1rgysvuere' },
          ),
          ex.fillBlank(
            'No creo que ___ la fábrica.',
            'I don’t think it’s the factory.',
            'sea',
            ['es', 'era', 'está'],
            ['es-no-creo-que'],
            {
              id: 'es.ex.z25j5z6nh1z33l',
              explanation:
                'No creo que is followed by the subjunctive: sea (from ser). With creo que, use the indicative: creo que es la fábrica.',
            },
          ),
          ex.fillBlank(
            'Creo que la fábrica ___ el agua del río.',
            'I think the factory pollutes the river water.',
            'contamina',
            ['contamine', 'contaminar', 'contaminación'],
            ['es-contaminar'],
            {
              id: 'es.ex.36r5lbpezb242m',
              explanation:
                'Creo que states something as true, so it takes the indicative: contamina. With no creo que you would use the subjunctive: no creo que la fábrica contamine el agua.',
            },
          ),
          ex.fillBlank(
            'Dudo que la ciudad ___ algo pronto.',
            'I doubt the city will do anything soon.',
            'haga',
            ['hace', 'hacer', 'hizo'],
            ['es-dudo-que'],
            {
              id: 'es.ex.6i3xsh4tlm3x5z',
              explanation:
                'Dudo que + subjunctive: haga (from hacer). In English it often translates with “will”: I doubt it will do anything.',
            },
          ),
          ex.listenChoice(
            'No creo que sea la fábrica.',
            ['Creo que es la fábrica.', 'No creo que sea el agua.', 'Dudo que sea la fábrica.'],
            ['es-no-creo-que', 'es-dudo-que'],
            { id: 'es.ex.36dhb046az40as' },
          ),
          question(
            'es.ex.yb664cotp3iab5',
            VECINOS,
            'What does Valeria think is polluting the river?',
            'Trash from the streets that the rain carries to the river',
            ['The factory on the corner', 'The neighbors on the corner', 'A truck from the city'],
            ['es-no-creo-que', 'es-la-basura'],
            'Valeria says “no creo que sea la fábrica. Creo que es la basura de las calles: cuando llueve, llega al río”.',
          ),
          question(
            'es.ex.9iy25kjaqt9q7o',
            VECINOS,
            'What does Andrés doubt?',
            'That the city will do something soon',
            [
              'That the factory pollutes the water',
              'That the neighbors will help',
              'That the river is dirty',
            ],
            ['es-dudo-que'],
            'Andrés says “dudo que la ciudad haga algo pronto”: dudo que + subjunctive (haga).',
          ),
          question(
            'es.ex.pzhmefpt0gsh8p',
            MERCADO,
            'What does Marta think about the prices of the market?',
            'She doesn’t think it is more expensive',
            [
              'She thinks the prices are too high',
              'She doesn’t know the prices',
              'She thinks it is cheaper than other markets',
            ],
            ['es-no-creo-que'],
            'Marta says “No creo que sea más caro. Solo es diferente”. It is some customers who think the prices are high.',
          ),
          ex.translateWrite(
            'I don’t think it’s a big problem.',
            'No creo que sea un gran problema.',
            ['es-no-creo-que'],
            {
              id: 'es.ex.td0w7yixahxdit',
              acceptedAnswers: [
                'No creo que sea un problema grande.',
                'No creo que sea un gran problema',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Crees que la gente recicla lo suficiente?',
            'Answer with «no creo que» or «dudo que» + subjunctive (e.g. no creo que recicle lo suficiente).',
            'No creo que recicle lo suficiente.',
            [
              'No, no creo que recicle lo suficiente.',
              'Dudo que recicle lo suficiente.',
              'No, dudo que recicle lo suficiente.',
              'No creo que la gente recicle lo suficiente.',
              'Dudo que la gente recicle lo suficiente.',
              'Sí, creo que recicla lo suficiente.',
              'Creo que recicla lo suficiente.',
            ],
            ['es-no-creo-que', 'es-dudo-que', 'es-reciclar'],
            { id: 'es.ex.cettxfgfwli2vw' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi barrio y el medio ambiente',
        objective:
          'Describe what is done in your neighborhood and give a nuanced opinion about it.',
        intro: {
          explanation:
            'To describe your neighborhood, combine everything: what is done (se recicla, se venden, no se usa plástico), what was done (fue creado por…, se plantaron árboles) and your opinion (creo que…, no creo que…, dudo que…). Connectors help you build a short argument: también (also), sin embargo (however), por eso (that’s why). A balanced opinion often has two halves: creo que es una buena idea, pero dudo que sea suficiente.',
          examples: [
            {
              target: 'En mi barrio se recicla, pero no creo que sea suficiente.',
              base: 'People recycle in my neighborhood, but I don’t think it’s enough.',
            },
            {
              target: 'La calle también fue limpiada por los voluntarios.',
              base: 'The street was also cleaned by the volunteers.',
            },
          ],
        },
        takeaways: [
          'You describe what is done in your neighborhood with se and the passive.',
          'You give a balanced opinion with creo que, no creo que and dudo que.',
        ],
        exercises: [
          question(
            'es.ex.x4gouatnqffq0a',
            MERCADO,
            'What is special about the market in Bogotá?',
            'No plastic is used and customers bring their own bags',
            [
              'Everything is cheaper than in other markets',
              'It only sells coffee',
              'It was created by the city',
            ],
            ['es-el-plastico'],
            'The article says “acá no se usa plástico” and “no se venden bolsas: cada cliente trae sus bolsas y sus botellas”.',
          ),
          question(
            'es.ex.va09jv1omh2a21',
            MERCADO,
            'Why are the neighbors happy?',
            'There is much less trash in the neighborhood',
            ['Prices are lower', 'There are three new markets', 'The city created the market'],
            ['es-la-basura', 'es-la-comunidad'],
            'The article says “Los vecinos están contentos: ahora hay mucha menos basura en el barrio”. The community wants to open two more markets, but they don’t exist yet.',
          ),
          question(
            'es.ex.76wrr7dd1iivab',
            RADIO,
            'What happens on Saturdays in Rodrigo’s neighborhood?',
            'The neighbors take the bags to the square and a truck takes them away',
            [
              'There is a party in the square',
              'The neighbors separate the trash at home',
              'Rodrigo talks about recycling on the radio',
            ],
            ['es-el-reciclaje'],
            'Rodrigo says “Los sábados, los vecinos llevan las bolsas a la plaza y un camión se las lleva”. The trash is separated at home; on Saturdays the bags are taken to the square.',
          ),
          question(
            'es.ex.2wkbr9rtivieop',
            JORNADA,
            'Who organizes the day in the forest?',
            'The neighborhood community',
            ['The city', 'A school', 'A group of children'],
            ['es-la-comunidad', 'es-el-voluntario'],
            'The poster ends with “Organiza la comunidad del barrio”.',
          ),
          ex.listenChoice(
            'Dudo que se recicle todo el plástico.',
            [
              'Creo que se recicla todo el plástico.',
              'Dudo que se recicle todo el papel.',
              'Dudo que se recicle toda la basura.',
            ],
            ['es-dudo-que', 'es-el-plastico'],
            { id: 'es.ex.7v8xsetnyhc3rl' },
          ),
          ex.matchPairs(
            [
              ['no creo que', "I don't think that"],
              ['dudo que', 'I doubt that'],
              ['proteger', 'to protect'],
              ['contaminar', 'to pollute'],
            ],
            ['es-no-creo-que', 'es-dudo-que', 'es-proteger', 'es-contaminar'],
            { id: 'es.ex.vzdsbo7vtgncf0' },
          ),
          ex.fillBlank(
            'En este mercado no se ___ bolsas de plástico.',
            'Plastic bags are not sold in this market.',
            'venden',
            ['vende', 'usa'],
            ['es-el-plastico'],
            {
              id: 'es.ex.tytztivninnyzl',
              explanation:
                'Bolsas is plural, so the verb with se is plural too: no se venden bolsas. Se vende and se usa go with a singular noun (se usa plástico).',
            },
          ),
          ex.orderWords(
            'Creo que es bueno pero dudo que sea suficiente.',
            'I think it’s good, but I doubt it’s enough.',
            ['es-dudo-que'],
            { id: 'es.ex.m27jvyhkorht1p' },
          ),
          ex.translateWrite(
            'I don’t think the city will protect the forest.',
            'No creo que la ciudad proteja el bosque.',
            ['es-no-creo-que', 'es-proteger', 'es-el-bosque'],
            {
              id: 'es.ex.tu9wxxt8mv6cz9',
              acceptedAnswers: [
                'Dudo que la ciudad proteja el bosque.',
                'No creo que la ciudad vaya a proteger el bosque.',
                'No creo que la ciudad proteja el bosque',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué se hace en tu barrio para proteger el medio ambiente?',
            'Say what is done with se + verb (e.g. se recicla la basura, se plantan árboles).',
            'En mi barrio se recicla la basura.',
            [
              'Se recicla la basura.',
              'En mi barrio se separa la basura.',
              'Se separa la basura.',
              'En mi barrio se plantan árboles.',
              'Se plantan árboles.',
              'En mi barrio se recicla el plástico.',
              'Se recicla el plástico.',
              'En mi barrio se reciclan el papel y el plástico.',
              'En mi barrio se recicla el papel y el plástico.',
              'En mi barrio no se hace nada.',
            ],
            ['es-reciclar', 'es-la-basura', 'es-el-medio-ambiente'],
            { id: 'es.ex.wvupr87313bib4' },
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

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U09_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.barrio-ambiente',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u09-l05',
    title: 'Your neighborhood and the environment',
    instructions:
      'Write about your neighborhood (real or invented) and the environment: what problems there are, what is done to solve them (se recicla, se separa…) and what you think about it. Include one thing you think and one thing you don’t think or doubt (no creo que / dudo que + subjunctive).',
    prompts: [
      '¿Qué se hace en tu barrio para proteger el medio ambiente?',
      '¿Crees que es suficiente?',
    ],
    requirements: [
      {
        id: 'se',
        label: 'You say what is done with se + verb (se recicla, se separa, se venden…)',
        kind: 'pattern',
        patterns: [
          [
            'se',
            'recicla|reciclan|separa|separan|usa|usan|vende|venden|plantan|plantaron|limpia|hace|gasta',
          ],
        ],
      },
      {
        id: 'doubt',
        label: 'You say what you don’t think or doubt (no creo que… / dudo que…)',
        kind: 'pattern',
        patterns: [
          ['no', 'creo', 'que'],
          ['dudo', 'que'],
        ],
      },
      {
        id: 'subjunctive',
        label: 'You use a subjunctive after it (sea, haya, cambie, recicle, haga…)',
        kind: 'pattern',
        patterns: [
          [
            'que',
            'sea|sean|haya|cambie|recicle|reciclen|haga|hagan|pueda|puedan|tenga|esté|proteja',
          ],
          [
            'que',
            '<WORD>',
            'sea|sean|haya|cambie|recicle|reciclen|haga|hagan|pueda|puedan|tenga|esté|proteja',
          ],
          ['que', 'la', '<WORD>', 'sea|haya|cambie|recicle|haga|pueda|tenga|esté|proteja'],
        ],
      },
      {
        id: 'environment',
        label:
          'You use environment words (la basura, el reciclaje, la contaminación, el plástico…)',
        kind: 'pattern',
        patterns: [
          ['basura|reciclaje|contaminación|plástico|energía|bosque|naturaleza|reciclar|ambiente'],
        ],
      },
      ...common(5),
    ],
    model:
      'Vivo en un barrio de Monterrey. El problema más grande es la basura: hay mucha en las calles. En mi casa se separa la basura y los sábados se reciclan el papel y el plástico. El año pasado, el bosque del barrio también fue limpiado por los voluntarios. Creo que la comunidad está haciendo mucho. Sin embargo, no creo que sea suficiente, porque se usa mucho plástico. Dudo que la ciudad haga algo pronto, por eso los vecinos tenemos que hacer algo.',
    checklist: [
      'I use se + verb, and the verb agrees with the noun: se recicla el papel, se reciclan las botellas.',
      'After creo que I use the indicative (es); after no creo que / dudo que, the subjunctive (sea, haga).',
      'I link my ideas with también, sin embargo and por eso.',
    ],
  },
];
