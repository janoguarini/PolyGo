import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U8 «Technology and communication» (docs/ES_B1.md §3): oraciones de relativo con que
 * (la app que uso), donde (la escuela donde estudio, sin tilde), lo que (lo que pasa es que…), el que /
 * la que (¿qué foto? — la que publiqué ayer) y quien (sólo como apoyo, para personas: la profesora con
 * quien hablo; la palabra «quién» con tilde es de A1); el subjuntivo en la relativa cuando no se sabe si
 * existe lo que se busca (busco una app que sea gratis) frente al indicativo (tengo una app que es
 * gratis); repaso de los pronombres de objeto (te lo mando, se lo mando). Vocabulario de apps, redes
 * sociales y ayuda técnica.
 * Variante: español neutro de Latinoamérica, con tú y ustedes (descarguen, guarden); usted en el soporte
 * técnico. «El celular», «la computadora», «la app»; se acepta «el link» junto a «el enlace».
 * Pronunciación: donde / ¿dónde? suenan casi igual, cambia la entonación y la tilde; la ll de «llamada»
 * y la y de «ya» suenan igual (yeísmo).
 * Cultura: en Latinoamérica se dice «subir» o «publicar» una foto, y «mandar» un mensaje o un enlace;
 * las videollamadas familiares del domingo son una costumbre muy extendida.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RESENA = reading(
  'es.stim.b1-u8-resena',
  'post',
  'Fernanda, a student in Guadalajara, posts a review of a language app.',
  [
    'Hace seis meses descargué Lingua, una app para aprender idiomas.',
    'Es la app que uso todos los días en el metro.',
    'Lo mejor es la sala de conversación, donde hablas por videollamada con usuarios de otros países.',
    'Los usuarios que conocí ahí son muy simpáticos y pacientes.',
    'La app es gratis, pero para tener todas las lecciones pagas cinco dólares al mes.',
    'Lo malo es que la app no funciona sin internet.',
    'Por eso le doy cuatro estrellas de cinco.',
  ],
  { title: 'Lingua: una app que recomiendo', from: 'Fernanda' },
);

const SOPORTE = dialogue(
  'es.stim.b1-u8-soporte',
  'Héctor, who lives in Puebla, calls his phone company’s technical support. Mariana, the agent, speaks to him with usted.',
  [
    ['Mariana', 'Buenas tardes, habla Mariana. ¿En qué le puedo ayudar?'],
    ['Héctor', 'Buenas tardes. Lo que pasa es que mi celular no carga bien.'],
    ['Mariana', '¿Desde cuándo tiene el problema?'],
    ['Héctor', 'Desde ayer. Lo cargo toda la noche y en la mañana la batería está casi en cero.'],
    ['Mariana', '¿Actualizó el sistema hace poco?'],
    ['Héctor', 'Sí, el lunes. Y también descargué muchas apps nuevas.'],
    [
      'Mariana',
      'Entonces lo que necesita es borrar las apps que no usa y apagar el celular un momento.',
    ],
    ['Héctor', '¿Y mis fotos? No quiero perder las fotos de mi hija.'],
    ['Mariana', 'No se preocupe: antes de borrar nada, guarde sus archivos en la nube.'],
  ],
  ES_B1_RATE,
);

const HERMANOS = dialogue(
  'es.stim.b1-u8-hermanos',
  'Natalia and her younger brother Julián, at home in Bogotá.',
  [
    ['Natalia', 'Julián, ¿otra vez con el celular? Llevas dos horas en las redes sociales.'],
    ['Julián', 'Es que estoy viendo los comentarios de la foto que publiqué ayer.'],
    ['Natalia', '¿La foto de la fiesta? Mamá me dijo que no le gustó.'],
    ['Julián', '¿Cuál? ¿La que compartí con mis amigos? Esa no es para mamá.'],
    ['Natalia', 'Lo que publicas en internet lo puede ver todo el mundo.'],
    ['Julián', 'Eso no es cierto: mi cuenta es privada.'],
    ['Natalia', 'Bueno, pero yo en tu lugar, borraría esa foto.'],
    ['Julián', 'Tú también pasas mucho tiempo en internet, ¿o no?'],
    ['Natalia', 'Sí, pero yo uso las redes sociales para cosas del trabajo.'],
  ],
  ES_B1_RATE,
);

const CLASE = reading(
  'es.stim.b1-u8-clase',
  'email',
  'An email from Inés, a Spanish teacher in Lima, to her students the day before an online class.',
  [
    'Mañana la clase es por videollamada.',
    'Primero, descarguen la app que usamos en la escuela y actualícenla.',
    'Diez minutos antes de la clase, les mando el enlace por correo.',
    'Quien no reciba el enlace puede escribirme un mensaje.',
    'Es mejor que la computadora esté cargada antes de empezar.',
    'Al final, guarden el archivo con la tarea en la carpeta donde están las otras tareas.',
    '¡Nos vemos mañana!',
  ],
  { title: 'Clase por videollamada', from: 'Inés', to: 'Estudiantes' },
);

export const ES_B1_U08: EsUnitDef = {
  names: ['Fernanda', 'Lingua', 'Héctor', 'Mariana', 'Natalia', 'Julián', 'Inés', 'Rodrigo'],
  support: [
    // relativos y subjuntivo en la relativa
    'quien',
    'funcione',
    'guarde',
    // presentes y pasados nuevos
    'carga',
    'cargo',
    'usa',
    'necesita',
    'publico',
    'publicas',
    'publiqué',
    'compartí',
    'descargué',
    'actualizó',
    'ayudó',
    'viendo',
    'doy',
    // infinitivos y enclíticos
    'ayudar',
    'apagar',
    'cargarlo',
    'actualizarla',
    'escribirme',
    'borraría',
    // ustedes (imperativo) y usted
    'descarguen',
    'actualícenla',
    'guarden',
    'reciba',
    'olvides',
    // sustantivos y otras formas
    'internet',
    'lecciones',
    'dólares',
    'estrellas',
    'sistema',
    'nube',
    'cero',
    'tarea',
    'carpeta',
    'ahí',
    'pacientes',
    'cierto',
    'privada',
    'tuyo',
    'cargada',
    'foto',
    'guarda',
    'actualizaste',
    'usamos',
    'descargaría',
    'comparto',
    'ayude',
    'conversación',
  ],
  unit: {
    position: 8,
    title: 'Technology and communication',
    titleEn: 'Tecnología y comunicación',
    description:
      'Describe apps and devices with relative clauses (que, donde, lo que, el que, quien), say what kind of app you are looking for with the subjunctive, ask for technical help and talk about social media.',
    emoji: '📱',
    objective:
      'You can describe apps and devices, say what you are looking for, explain a technical problem and understand the solution, and talk about what you post and share on social media.',
    grammar: {
      title:
        'Relative clauses: que, donde, lo que, el que, quien · busco una app que + subjunctive',
      explanation:
        'Relative words join two ideas in one sentence. Que is the most common and works for people and things (that, which, who): la app que uso, los usuarios que conocí. Unlike English, Spanish never drops it: “the app I use” is always la app que uso. Donde (without an accent) refers to a place: la escuela donde estudio; with an accent, ¿dónde? is only for questions. Lo que means “what” in the sense of “the thing that”: lo que necesito es un celular nuevo; lo que pasa es que… (the thing is…) is the usual way to start explaining a problem. El que, la que, los que, las que mean “the one(s) that” and agree with the noun you leave out: ¿Qué foto? — La que publiqué ayer. Quien (no accent) is for people, mostly after a preposition (la profesora con quien hablo) or meaning “whoever” (quien no reciba el enlace…). Finally, the mood of the verb after que depends on whether the thing is known. If it exists and you know it, use the indicative: tengo una app que funciona sin internet. If you are looking for it and don’t know if it exists, use the subjunctive: busco una app que funcione sin internet, necesito una computadora que sea rápida. Object pronouns still go before the conjugated verb: te lo mando, and le + lo becomes se lo: se lo mando.',
      examples: [
        { target: 'Es la app que uso todos los días.', base: 'It’s the app I use every day.' },
        {
          target: 'Lo que pasa es que mi celular no carga bien.',
          base: 'The thing is, my phone isn’t charging properly.',
        },
        { target: 'Busco una app que sea gratis.', base: 'I’m looking for an app that’s free.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U8), en español neutro de Latinoamérica con tú y ustedes. Sin revisión nativa. Revisar: «quien» sólo en el apoyo (la palabra «quién» con tilde es de A1) y en la lectura con el valor de «whoever» (quien no reciba el enlace…); «el que» enseñado con «la que / los que / las que» como formas aceptadas; el contraste «busco una app que sea / tengo una app que es» (subjuntivo en la relativa) con pocos verbos (sea, funcione, tenga); «lo que pasa es que» como fórmula para explicar un problema; «el enlace» frente a «el link» (aceptado; muy frecuente en México); «descargar» frente a «bajar» (A2); «la nube» y «el sistema» sin explicación detallada; «en la mañana» (México) frente a «por la mañana»; «actualícenla», «descarguen», «guarden» (imperativo de ustedes) en el correo de la profesora; «es mejor que + subjuntivo» de U6 en la lectura; «llevas dos horas en las redes sociales» (llevar + tiempo de U2, sin gerundio); «la app» y «la computadora» frente a «la aplicación» y «el computador» (Colombia, no enseñado, aunque la conversación de los hermanos es en Bogotá); «yo en tu lugar, borraría» (condicional de U7).',
    },
    words: [
      w(
        'es-lo-que',
        'lo que',
        'what (the thing that)',
        'Lo que más uso es el celular.',
        'What I use most is my phone.',
        ['b1', 'relatives'],
      ),
      w(
        'es-el-que',
        'el que',
        'the one that',
        '¿Qué computadora? — La que compré el año pasado.',
        'Which computer? — The one I bought last year.',
        ['b1', 'relatives'],
        { acceptedTexts: ['la que', 'los que', 'las que'], acceptedTranslations: ['the one who'] },
      ),
      w(
        'es-el-usuario',
        'el usuario',
        'user',
        'Esta app tiene muchos usuarios en México.',
        'This app has a lot of users in Mexico.',
        ['b1', 'technology'],
        { acceptedTexts: ['la usuaria'] },
      ),
      w(
        'es-donde',
        'donde',
        'where (relative)',
        'Es la app donde hablo con mi familia.',
        'It’s the app where I talk to my family.',
        ['b1', 'relatives'],
        { acceptedTranslations: ['in which'] },
      ),
      w(
        'es-las-redes-sociales',
        'las redes sociales',
        'social media',
        'Paso mucho tiempo en las redes sociales.',
        'I spend a lot of time on social media.',
        ['b1', 'technology'],
        { acceptedTranslations: ['social networks'], acceptedTexts: ['las redes'], emoji: '🌐' },
      ),
      w(
        'es-publicar',
        'publicar',
        'to post',
        'Me gusta publicar fotos de mis viajes.',
        'I like to post photos of my trips.',
        ['b1', 'technology', 'verbs'],
        { acceptedTranslations: ['to publish'] },
      ),
      w(
        'es-compartir',
        'compartir',
        'to share',
        'No comparto fotos de mi familia en las redes sociales.',
        'I don’t share photos of my family on social media.',
        ['b1', 'technology', 'verbs'],
      ),
      w(
        'es-descargar',
        'descargar',
        'to download',
        'Yo que tú, descargaría esta app hoy.',
        'If I were you, I’d download this app today.',
        ['b1', 'technology', 'verbs'],
        { emoji: '⬇️' },
      ),
      w(
        'es-la-videollamada',
        'la videollamada',
        'video call',
        'Hago una videollamada con mis abuelos todos los domingos.',
        'I have a video call with my grandparents every Sunday.',
        ['b1', 'technology'],
        { emoji: '📹' },
      ),
      w(
        'es-el-archivo',
        'el archivo',
        'file',
        'Te mando el archivo por correo.',
        'I’ll send you the file by email.',
        ['b1', 'technology'],
        { emoji: '📁' },
      ),
      w(
        'es-la-bateria',
        'la batería',
        'battery',
        'Mi celular casi no tiene batería.',
        'My phone is almost out of battery.',
        ['b1', 'technology'],
        { emoji: '🔋' },
      ),
      w(
        'es-cargar',
        'cargar',
        'to charge',
        'Tengo que cargar el celular antes de salir.',
        'I have to charge my phone before I go out.',
        ['b1', 'technology', 'verbs'],
      ),
      w(
        'es-actualizar',
        'actualizar',
        'to update',
        'Es importante actualizar las apps.',
        'It’s important to update your apps.',
        ['b1', 'technology', 'verbs'],
      ),
      w(
        'es-borrar',
        'borrar',
        'to delete',
        'Voy a borrar las fotos viejas.',
        'I’m going to delete the old photos.',
        ['b1', 'technology', 'verbs'],
        { acceptedTranslations: ['to erase'] },
      ),
      w(
        'es-el-enlace',
        'el enlace',
        'link',
        'Te mando el enlace por mensaje.',
        'I’ll send you the link in a message.',
        ['b1', 'technology'],
        { acceptedTexts: ['el link'], emoji: '🔗' },
      ),
      w(
        'es-el-comentario',
        'el comentario',
        'comment',
        'Gracias por tu comentario.',
        'Thanks for your comment.',
        ['b1', 'technology'],
        { emoji: '💬' },
      ),
      w(
        'es-guardar',
        'guardar',
        'to save',
        'Tienes que guardar el archivo antes de salir.',
        'You have to save the file before you leave.',
        ['b1', 'technology', 'verbs'],
        { acceptedTranslations: ['to keep'], emoji: '💾' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La app que uso',
        objective: 'Describe apps and places with que and donde.',
        intro: {
          explanation:
            'Que joins two ideas and refers to people or things: es la app que uso (it’s the app I use). English often drops “that”, but Spanish never drops que. For a place, use donde, without an accent: la escuela donde estudio. With an accent, ¿dónde? is the question word; the sound is almost the same, but in the question the word is stressed. Descargar is to download (in A2 you also learned bajar), and a user is el usuario or la usuaria.',
          examples: [
            { target: 'Es la app que uso todos los días.', base: 'It’s the app I use every day.' },
            {
              target: 'Es la app donde hablo con mi familia.',
              base: 'It’s the app where I talk to my family.',
            },
          ],
        },
        takeaways: [
          'You describe an app or a person with que, and you never leave it out.',
          'You describe a place with donde, without an accent.',
        ],
        exercises: [
          ex.translationChoice(
            'descargar',
            'to download',
            ['to send', 'to receive', 'to work'],
            ['es-descargar'],
            { id: 'es.ex.7kwwyy6dl7k36a' },
          ),
          ex.fillBlank(
            'Es la app ___ uso todos los días.',
            'It’s the app I use every day.',
            'que',
            ['donde', 'cuando'],
            ['es-descargar'],
            {
              id: 'es.ex.gnatjz9dr95grp',
              explanation:
                'Que joins the app with what you do with it: la app que uso. In English you can say “the app I use”, but in Spanish que is always there.',
            },
          ),
          ex.fillBlank(
            'Este es el café ___ conocí a mi novia.',
            'This is the café where I met my girlfriend.',
            'donde',
            ['que', 'cuando'],
            ['es-donde'],
            {
              id: 'es.ex.z8525qkhwel6bh',
              explanation:
                'El café is a place, so the relative word is donde (no accent): el café donde conocí a mi novia.',
            },
          ),
          ex.matchPairs(
            [
              ['descargar', 'to download'],
              ['el usuario', 'user'],
              ['donde', 'where (relative)'],
              ['la videollamada', 'video call'],
            ],
            ['es-descargar', 'es-el-usuario', 'es-donde', 'es-la-videollamada'],
            { id: 'es.ex.rmui7uln8bixvq' },
          ),
          ex.listenChoice(
            'Hago una videollamada con mi abuela.',
            ['Hice una videollamada con mi abuela.', 'Hago una videollamada con mi abuelo.'],
            ['es-la-videollamada'],
            { id: 'es.ex.amihxi0ntupmjj' },
          ),
          question(
            'es.ex.s9ot5vf20lup6g',
            RESENA,
            'When does Fernanda use the app?',
            'Every day on the metro',
            ['Only on weekends', 'At night before bed', 'In class with her teacher'],
            ['es-descargar'],
            'She writes “Es la app que uso todos los días en el metro”.',
          ),
          question(
            'es.ex.f9l02eck5m7is3',
            RESENA,
            'What does Fernanda like best about the app?',
            'The conversation room, where you talk by video call with users from other countries',
            [
              'That it is completely free',
              'The games for children',
              'That it works without internet',
            ],
            ['es-donde', 'es-la-videollamada', 'es-el-usuario'],
            'She writes “Lo mejor es la sala de conversación, donde hablas por videollamada con usuarios de otros países”.',
          ),
          question(
            'es.ex.puolq7oxh0lsqn',
            RESENA,
            'Why does she give the app four stars and not five?',
            'Because it doesn’t work without internet',
            [
              'Because it is very expensive',
              'Because the users are rude',
              'Because it has few lessons',
            ],
            ['es-el-usuario'],
            'She writes “Lo malo es que la app no funciona sin internet. Por eso le doy cuatro estrellas de cinco”.',
          ),
          ex.translateWrite(
            'This is the app that I use every day.',
            'Esta es la app que uso todos los días.',
            ['es-descargar'],
            {
              id: 'es.ex.6xw9uwhcpinz5j',
              acceptedAnswers: [
                'Esta es la app que uso cada día.',
                'Es la app que uso todos los días.',
                'Ésta es la app que uso todos los días.',
                'Esta es la aplicación que uso todos los días.',
                'Esta es la app que yo uso todos los días.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo hablas con tu familia?',
            'Say you have a video call with them every Sunday (start with «Hago»).',
            'Hago una videollamada todos los domingos.',
            [
              'Hago una videollamada todos los domingos',
              'Hago una videollamada con ellos todos los domingos.',
              'Hago una videollamada con mi familia todos los domingos.',
              'Hago videollamadas todos los domingos.',
              'Hago una videollamada cada domingo.',
            ],
            ['es-la-videollamada'],
            { id: 'es.ex.cb5mf6p0gsj8wo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Busco una app que funcione',
        objective: 'Say what kind of app or device you are looking for, with the subjunctive.',
        intro: {
          explanation:
            'After que, the verb depends on what you know. If the thing exists and you know it, use the indicative: tengo una app que guarda mis archivos. If you are looking for it and don’t know if it exists, use the subjunctive: busco una app que sea gratis, necesito una computadora que funcione bien. Guardar is to save (a file) and also to keep; actualizar is to update. Remember that a pronoun can go at the end of an infinitive: voy a actualizarla = la voy a actualizar.',
          examples: [
            {
              target: 'Tengo una app que guarda mis archivos.',
              base: 'I have an app that saves my files.',
            },
            {
              target: 'Busco una app que sea gratis.',
              base: 'I’m looking for an app that’s free.',
            },
          ],
        },
        takeaways: [
          'You describe something you know with que + indicative (tengo una app que funciona).',
          'You describe something you are looking for with que + subjunctive (busco una app que funcione).',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['guardar', 'to save'],
              ['el archivo', 'file'],
              ['actualizar', 'to update'],
              ['descargar', 'to download'],
            ],
            ['es-guardar', 'es-el-archivo', 'es-actualizar', 'es-descargar'],
            { id: 'es.ex.xgezc20zhfkuaw' },
          ),
          ex.fillBlank(
            'Busco una app que ___ gratis, pero no sé si hay una.',
            'I’m looking for an app that’s free, but I don’t know if there is one.',
            'sea',
            ['es', 'está'],
            ['es-descargar'],
            {
              id: 'es.ex.l6l9uy522wvmjn',
              explanation:
                'You are looking for the app and don’t know if it exists, so the verb goes in the subjunctive: que sea. Tengo una app que es gratis would use the indicative.',
            },
          ),
          ex.fillBlank(
            'Tengo una app que ___ todos mis archivos.',
            'I have an app that saves all my files.',
            'guarda',
            ['guarde', 'guardar'],
            ['es-guardar', 'es-el-archivo'],
            {
              id: 'es.ex.v561u2keeq0fh4',
              explanation:
                'You already have the app, so it is a real, known thing: indicative, que guarda. Que guarde would mean you are still looking for one.',
            },
          ),
          ex.translationChoice(
            'actualizar',
            'to update',
            ['to download', 'to save', 'to work'],
            ['es-actualizar'],
            { id: 'es.ex.2ky93fqjsugt8i' },
          ),
          ex.listenChoice(
            'Busco una computadora que funcione bien.',
            ['Tengo una computadora que funciona bien.', 'Busco una computadora que sea barata.'],
            ['es-guardar'],
            { id: 'es.ex.ujrms86b7yc32n' },
          ),
          ex.fillBlank(
            'No olvides ___ el archivo antes de salir.',
            'Don’t forget to save the file before you leave.',
            'guardar',
            ['guarda', 'guarde'],
            ['es-guardar', 'es-el-archivo'],
            {
              id: 'es.ex.z8aziu1f7ndird',
              explanation:
                'After olvidar (no olvides) comes an infinitive, just like after tener que or ir a: no olvides guardar.',
            },
          ),
          ex.translationChoice(
            'el archivo',
            'file',
            ['password', 'screen', 'message'],
            ['es-el-archivo'],
            { id: 'es.ex.blcpvftavrfv22' },
          ),
          ex.orderWords(
            'Busco una app que me ayude con el inglés.',
            'I’m looking for an app that helps me with English.',
            ['es-descargar'],
            { id: 'es.ex.78rzg184syjy3s' },
          ),
          ex.translateWrite(
            'I’m looking for an app that’s free.',
            'Busco una app que sea gratis.',
            ['es-descargar'],
            {
              id: 'es.ex.2a0akoyy6945yv',
              acceptedAnswers: [
                'Estoy buscando una app que sea gratis.',
                'Busco una aplicación que sea gratis.',
                'Busco una app que sea gratuita.',
                'Busco una aplicación que sea gratuita.',
                'Estoy buscando una aplicación que sea gratis.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Ya actualizaste la app?',
            'Say no, you are going to update it tonight (start with «No»).',
            'No, voy a actualizarla esta noche.',
            [
              'No, voy a actualizarla esta noche',
              'No, la voy a actualizar esta noche.',
              'No. Voy a actualizarla esta noche.',
              'No, todavía no. Voy a actualizarla esta noche.',
              'No, la actualizo esta noche.',
            ],
            ['es-actualizar'],
            { id: 'es.ex.bd84albvbo7ajl' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Lo que pasa es que…',
        objective: 'Explain a technical problem with lo que and understand the solution.',
        intro: {
          explanation:
            'Lo que means “what” when it is not a question: it is “the thing that”. Lo que necesito es un celular nuevo (what I need is a new phone). Lo que pasa es que… (the thing is…) is the natural way to start explaining a problem, for example on the phone with technical support. Don’t mix it up with ¿qué?, which is only for questions. For a phone, cargar is to charge (lo cargo toda la noche) and la batería is the battery; borrar is to delete.',
          examples: [
            {
              target: 'Lo que pasa es que mi celular no carga bien.',
              base: 'The thing is, my phone isn’t charging properly.',
            },
            { target: 'Lo que necesito es un celular nuevo.', base: 'What I need is a new phone.' },
          ],
        },
        takeaways: [
          'You explain a problem with lo que pasa es que…',
          'You talk about the battery, charging and deleting apps.',
        ],
        exercises: [
          ex.translationChoice(
            'lo que',
            'what (the thing that)',
            ['where (relative)', 'the more', 'if I were you'],
            ['es-lo-que'],
            { id: 'es.ex.8kuwevogjoig9c' },
          ),
          ex.fillBlank(
            '___ necesito es un celular nuevo.',
            'What I need is a new phone.',
            'Lo que',
            ['Qué', 'Donde'],
            ['es-lo-que'],
            {
              id: 'es.ex.iiagqt4h13y0bc',
              explanation:
                'This is not a question, so “what” is lo que (the thing that). ¿Qué? is only for questions.',
            },
          ),
          ex.matchPairs(
            [
              ['la batería', 'battery'],
              ['cargar', 'to charge'],
              ['borrar', 'to delete'],
              ['lo que', 'what (the thing that)'],
            ],
            ['es-la-bateria', 'es-cargar', 'es-borrar', 'es-lo-que'],
            { id: 'es.ex.aiqaiz1uc3i4eh' },
          ),
          ex.listenChoice(
            'Lo que pasa es que mi celular no carga.',
            [
              'Lo que pasa es que mi celular no funciona.',
              'Lo que pasó es que mi celular no carga.',
            ],
            ['es-lo-que', 'es-cargar'],
            { id: 'es.ex.umb9o5o5k97whl' },
          ),
          question(
            'es.ex.jkrceht42a4tp7',
            SOPORTE,
            'What is Héctor’s problem?',
            'His phone doesn’t charge well: in the morning the battery is almost at zero',
            ['His screen is black', 'He forgot his password', 'He can’t make calls'],
            ['es-cargar', 'es-la-bateria'],
            'Héctor says “Lo cargo toda la noche y en la mañana la batería está casi en cero”.',
          ),
          question(
            'es.ex.3wivnm9fpg36p6',
            SOPORTE,
            'What did Héctor do recently?',
            'He updated the system and downloaded many new apps',
            ['He bought a new phone', 'He deleted all his photos', 'He changed his battery'],
            ['es-actualizar', 'es-descargar'],
            'He answers “Sí, el lunes” about updating the system and adds “descargué muchas apps nuevas”.',
          ),
          question(
            'es.ex.m8zs95z5vqax8k',
            SOPORTE,
            'What does Mariana tell him to do before deleting anything?',
            'To save his files in the cloud',
            ['To call again tomorrow', 'To charge the phone all night', 'To buy a new battery'],
            ['es-guardar', 'es-el-archivo', 'es-borrar'],
            'Mariana says “antes de borrar nada, guarde sus archivos en la nube”.',
          ),
          ex.fillBlank(
            'Mi celular casi no tiene ___: tengo que cargarlo.',
            'My phone is almost out of battery: I have to charge it.',
            'batería',
            ['archivo', 'usuario'],
            ['es-la-bateria', 'es-cargar'],
            {
              id: 'es.ex.bw2mb1g4mep6w8',
              skill: 'vocabulary',
              explanation: 'You charge (cargar) a phone when it has no batería.',
            },
          ),
          ex.translateWrite(
            'I’m going to delete the old photos.',
            'Voy a borrar las fotos viejas.',
            ['es-borrar'],
            {
              id: 'es.ex.si891rrrxsaod3',
              acceptedAnswers: [
                'Voy a borrar las viejas fotos.',
                'Voy a borrar las fotos antiguas.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué le pasa a tu celular?',
            'Explain that the battery doesn’t charge, starting with «Lo que pasa es que…».',
            'Lo que pasa es que la batería no carga.',
            [
              'Lo que pasa es que la batería no carga',
              'Lo que pasa es que la batería no carga bien.',
              'Lo que pasa es que no carga la batería.',
              'Lo que pasa es que mi celular no carga.',
              'Lo que pasa es que el celular no carga.',
            ],
            ['es-lo-que', 'es-la-bateria', 'es-cargar'],
            { id: 'es.ex.poc4nc74w5pl31' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'En las redes sociales',
        objective: 'Talk about what you post and share, and point to things with el que / la que.',
        intro: {
          explanation:
            'El que, la que, los que and las que mean “the one(s) that”. They agree with the noun you don’t repeat: ¿Qué foto? — La que publiqué ayer (la foto). On social media (las redes sociales) you publicar (post), compartir (share) and leave un comentario. For people after a preposition you can also use quien: el amigo con quien hablo (= con el que hablo).',
          examples: [
            {
              target: '¿Qué foto? — La que publiqué ayer.',
              base: 'Which photo? — The one I posted yesterday.',
            },
            {
              target: 'Paso mucho tiempo en las redes sociales.',
              base: 'I spend a lot of time on social media.',
            },
          ],
        },
        takeaways: [
          'You talk about posting, sharing and comments on social media.',
          'You say “the one that” with el que, la que, los que, las que.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['las redes sociales', 'social media'],
              ['publicar', 'to post'],
              ['compartir', 'to share'],
              ['el comentario', 'comment'],
            ],
            ['es-las-redes-sociales', 'es-publicar', 'es-compartir', 'es-el-comentario'],
            { id: 'es.ex.uq95nza96h5x7m' },
          ),
          ex.fillBlank(
            '¿Qué foto te gusta? — ___ que publiqué ayer.',
            'Which photo do you like? — The one I posted yesterday.',
            'La',
            ['El', 'Lo'],
            ['es-el-que', 'es-publicar'],
            {
              id: 'es.ex.pc112vfb6afer3',
              explanation:
                'La que agrees with the noun you don’t repeat: la foto → la que. Lo que means “what” (the thing that), not “the one that”.',
            },
          ),
          ex.translationChoice(
            'el que',
            'the one that',
            ['what (the thing that)', 'where (relative)', 'the more'],
            ['es-el-que'],
            { id: 'es.ex.c55v7hpoxcsfaq' },
          ),
          question(
            'es.ex.f88tbtnj5lrow8',
            HERMANOS,
            'Why has Julián been on his phone for two hours?',
            'He is reading the comments on a photo he posted yesterday',
            [
              'He is talking to his friends by video call',
              'He is downloading a new app',
              'He is working on a project',
            ],
            ['es-el-comentario', 'es-publicar'],
            'Julián says “estoy viendo los comentarios de la foto que publiqué ayer”.',
          ),
          question(
            'es.ex.b8e89c41y1f1co',
            HERMANOS,
            'What does Natalia advise him to do?',
            'To delete the photo',
            ['To close his account', 'To show the photo to their mom', 'To post fewer photos'],
            ['es-borrar', 'es-el-que'],
            'Natalia says “yo en tu lugar, borraría esa foto”.',
          ),
          question(
            'es.ex.hyl6vckudli5cp',
            HERMANOS,
            'What does Natalia use social media for?',
            'For work',
            ['To post photos of parties', 'To talk to her family', 'To learn languages'],
            ['es-las-redes-sociales'],
            'She says “yo uso las redes sociales para cosas del trabajo”.',
          ),
          ex.listenChoice(
            'Me gusta compartir fotos de mis viajes.',
            [
              'Me gusta publicar fotos de mis viajes.',
              'No me gusta compartir fotos de mis viajes.',
            ],
            ['es-compartir'],
            { id: 'es.ex.7xfdr74uqkh79v' },
          ),
          ex.fillBlank(
            'Gracias por tu ___: me ayudó mucho.',
            'Thanks for your comment: it helped me a lot.',
            'comentario',
            ['archivo', 'usuario'],
            ['es-el-comentario'],
            {
              id: 'es.ex.tjgy6679mbw1fa',
              skill: 'vocabulary',
              explanation: 'What you leave under a post is un comentario.',
            },
          ),
          ex.translateWrite(
            'I spend a lot of time on social media.',
            'Paso mucho tiempo en las redes sociales.',
            ['es-las-redes-sociales'],
            {
              id: 'es.ex.cvne77bueolcwq',
              acceptedAnswers: [
                'Paso mucho tiempo en las redes.',
                'Yo paso mucho tiempo en las redes sociales.',
                'Paso muchas horas en las redes sociales.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué celular es el tuyo?',
            'Say it’s the one that is on the table (start with «El que»).',
            'El que está en la mesa.',
            [
              'El que está en la mesa',
              'Es el que está en la mesa.',
              'El que está encima de la mesa.',
              'Mi celular es el que está en la mesa.',
            ],
            ['es-el-que'],
            { id: 'es.ex.051tblvvmgb25v' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Te mando el enlace',
        objective:
          'Send and share things with object pronouns and understand online-class instructions.',
        intro: {
          explanation:
            'To share a link or a file, Spanish usually says mandar: te mando el enlace (in Mexico you will also hear el link). With two pronouns, the person goes first: te lo mando (I’ll send it to you). When le or les meets lo or la, le becomes se: ¿El enlace para Diego? Se lo mando ahora. Quien (no accent) can mean “whoever”: quien no reciba el enlace puede escribirme.',
          examples: [
            {
              target: '¿El enlace? Te lo mando ahora.',
              base: 'The link? I’ll send it to you now.',
            },
            {
              target: '¿Y el archivo para Diego? Se lo mando por correo.',
              base: 'And the file for Diego? I’ll send it to him by email.',
            },
          ],
        },
        takeaways: [
          'You send and share things with te lo mando and se lo mando.',
          'You understand instructions for an online class.',
        ],
        exercises: [
          ex.translationChoice(
            'el enlace',
            'link',
            ['file', 'comment', 'battery'],
            ['es-el-enlace'],
            { id: 'es.ex.ycle24p0gxsfl8' },
          ),
          ex.fillBlank(
            '¿El enlace para Diego? ___ lo mando ahora.',
            'The link for Diego? I’ll send it to him now.',
            'Se',
            ['Le', 'Lo'],
            ['es-el-enlace'],
            {
              id: 'es.ex.8s7yioz5j60ch0',
              explanation:
                'To him is le, but le + lo becomes se lo: se lo mando. “Le lo” is never correct.',
            },
          ),
          question(
            'es.ex.0s2i8qf4gyglog',
            CLASE,
            'When will the teacher send the link?',
            'Ten minutes before the class, by email',
            ['Tonight, by message', 'Right now, in this email', 'At the end of the class'],
            ['es-el-enlace'],
            'Inés writes “Diez minutos antes de la clase, les mando el enlace por correo”.',
          ),
          question(
            'es.ex.4fdrwt1rf3pj63',
            CLASE,
            'What should students do if they don’t get the link?',
            'Write a message to the teacher',
            ['Download the app again', 'Call the school', 'Wait for the next class'],
            ['es-el-enlace', 'es-descargar'],
            'The email says “Quien no reciba el enlace puede escribirme un mensaje”.',
          ),
          question(
            'es.ex.lz0rky5o63ov30',
            CLASE,
            'Where should they save the homework file?',
            'In the folder where the other homework is',
            ['On their phone', 'In an email to the teacher', 'On social media'],
            ['es-guardar', 'es-el-archivo', 'es-donde'],
            'Inés writes “guarden el archivo con la tarea en la carpeta donde están las otras tareas”.',
          ),
          ex.listenChoice(
            'Te mando el enlace por correo.',
            ['Te mando el archivo por correo.', 'Te mandé el enlace por correo.'],
            ['es-el-enlace'],
            { id: 'es.ex.a5r1donj5si48g' },
          ),
          ex.fillBlank(
            'Es la profesora con ___ hablo por videollamada.',
            'She’s the teacher I talk to by video call.',
            'quien',
            ['que', 'donde'],
            ['es-la-videollamada'],
            {
              id: 'es.ex.sele8y3zhse9pp',
              explanation:
                'After a preposition (con), a person takes quien (or la que): con quien hablo. Con que alone doesn’t work for a person, and donde is for places.',
            },
          ),
          ex.orderWords(
            'Te lo mando por mensaje esta noche.',
            'I’ll send it to you in a message tonight.',
            ['es-el-enlace'],
            { id: 'es.ex.z80xwx73bdxpou' },
          ),
          ex.translateWrite(
            'Can you send me the link?',
            '¿Me mandas el enlace?',
            ['es-el-enlace'],
            {
              id: 'es.ex.34mbursjyzieg2',
              acceptedAnswers: [
                '¿Me puedes mandar el enlace?',
                '¿Puedes mandarme el enlace?',
                '¿Me mandas el link?',
                '¿Me pasas el enlace?',
                '¿Me envías el enlace?',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Me mandas el archivo?',
            'Say yes, you’ll send it to them tonight (use te lo).',
            'Sí, te lo mando esta noche.',
            [
              'Sí, te lo mando esta noche',
              'Sí, esta noche te lo mando.',
              'Claro, te lo mando esta noche.',
              'Sí. Te lo mando esta noche.',
              'Sí, te lo mando hoy en la noche.',
            ],
            ['es-el-archivo'],
            { id: 'es.ex.kytaqghonfwy1q' },
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

/** Tareas de escritura de la unidad (docs/ES_B1.md): la guiada y la libre del final de U8. */
export const ES_B1_U08_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.recomendar-app',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u08-l05',
    title: 'Recommend an app',
    instructions:
      'Write a short review of an app you use (real or invented) for a friend: what it is for, what you like best, what is not so good and who you recommend it to. Use relative words (que, donde, lo que…).',
    prompts: ['¿Qué app usas todos los días?', '¿Qué es lo que más te gusta?'],
    requirements: [
      {
        id: 'relative',
        label: 'You use a relative clause (la app que…, donde…, lo que…, el que / la que…)',
        kind: 'pattern',
        patterns: [
          ['app|apps|aplicación|usuarios|personas|página', 'que|donde'],
          ['lo', 'que'],
          ['el|la|los|las', 'que'],
          ['donde'],
        ],
      },
      {
        id: 'tech',
        label:
          'You use a technology word (descargar, guardar, compartir, la videollamada, el archivo…)',
        kind: 'pattern',
        patterns: [
          [
            'descargar|descargué|guardar|guarda|compartir|publicar|actualizar|videollamada|videollamadas|archivo|archivos|enlace|usuarios|batería|redes',
          ],
        ],
      },
      ...common(5),
    ],
    model:
      'Te recomiendo Lingua, una app que uso todos los días. Es una app para aprender idiomas donde hablas por videollamada con usuarios de otros países. Lo que más me gusta es que puedes guardar las lecciones. Lo malo es que no funciona sin internet. Es gratis, pero para tener todas las lecciones pagas cinco dólares al mes. Yo que tú, la descargaría hoy.',
    checklist: [
      'I never leave out que: la app que uso.',
      'I use donde (no accent) for places and lo que for “what” (the thing that).',
      'If I describe an app I am still looking for, I use the subjunctive: busco una app que sea gratis.',
    ],
  },
  {
    ...base,
    id: 'es.b1.wt.libre-tecnologia',
    kind: 'free',
    codes: [],
    lesson: 'es-b1-u08-final',
    block: 1,
    title: 'Free writing: technology in your life',
    instructions:
      'Write about the role of technology in your life: which devices and apps you use, how you stay in touch with people, what you post or share on social media and what worries you about technology. There is no right answer: compare your text with the model and go through the checklist.',
    prompts: [
      '¿Qué apps usas todos los días?',
      '¿Cómo hablas con tu familia y tus amigos?',
      '¿Qué te preocupa de las redes sociales?',
    ],
    requirements: [
      {
        id: 'relative',
        label:
          'Tip: describe things with que, donde or lo que (la app que uso…, lo que más me gusta…)',
        kind: 'pattern',
        patterns: [
          ['lo', 'que'],
          ['donde'],
          ['app|apps|celular|computadora|redes|personas', 'que'],
        ],
        optional: true,
      },
      {
        id: 'opinion',
        label: 'Tip: react or give your opinion (me preocupa que…, me alegra que…, creo que…)',
        kind: 'pattern',
        patterns: [
          ['me', 'preocupa|alegra', 'que'],
          ['creo', 'que'],
        ],
        optional: true,
      },
      { id: 'words', label: 'Tip: about 90 words', kind: 'min_words', min: 90, optional: true },
    ],
    model:
      'Uso el celular todo el día. Lo que más uso son las redes sociales y una app donde hablo con mi familia. Todos los domingos hago una videollamada con mis abuelos, que viven en Oaxaca. También uso la computadora para el trabajo: guardo todos mis archivos en la nube y comparto los enlaces con mis compañeros. Me gusta publicar fotos de mis viajes, pero no publico todo. Lo que me preocupa es el tiempo: creo que paso mucho tiempo con el celular, y cuanto más lo uso, peor duermo. Por eso, por la noche lo apago una hora antes de dormir. Ahora busco una app que me ayude a usar menos el celular.',
    checklist: [
      'I use que, donde and lo que to join my ideas.',
      'I use the subjunctive after busco una app que… (que me ayude).',
      'I give my opinion or say what worries me (me preocupa que…, lo que me preocupa es…).',
    ],
  },
];
