import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U7 «Health and well-being» (docs/ES_B1.md §3): el condicional para dar consejos
 * (deberías, yo que tú + condicional, yo en tu lugar, sería mejor + infinitivo), el subjuntivo con
 * verbos de emoción cuando hay otro sujeto (me alegra que estés mejor, me preocupa que no duermas) y
 * la progresión (cuanto más…, mejor…; cada vez más). Vocabulario de salud y hábitos: la dieta, sano,
 * el ejercicio, bajar de peso, fumar, el estrés, meditar, cuidarse, el bienestar.
 * Variante: español neutro de Latinoamérica, con tú (yo que tú, cuídate). Se menciona «mientras más»
 * (muy frecuente en México) como alternativa de «cuanto más» y se acepta en las respuestas.
 * Pronunciación: la tilde del condicional (descansaría, sería: la í lleva el acento) y el contraste
 * duermes / duermas (indicativo / subjuntivo: sólo cambia una vocal).
 * Cultura: en México y en buena parte de Latinoamérica se consulta a la nutrióloga (el nutriólogo) para
 * la dieta, y se reacciona a las buenas noticias con «¡qué bueno que…!» (+ subjuntivo).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NUTRIOLOGA = dialogue(
  'es.stim.b1-u7-nutriologa',
  'Ricardo sees Daniela, his nutritionist in Monterrey. They have known each other for a long time and speak with tú.',
  [
    ['Daniela', 'Hola, Ricardo. ¿Cómo vas con la dieta?'],
    ['Ricardo', 'Más o menos. Como más verduras, pero sigo tomando refrescos todos los días.'],
    ['Daniela', 'Los refrescos no son nada sanos. Yo que tú, tomaría más agua.'],
    ['Ricardo', 'Está bien. Es que quiero bajar de peso antes del verano.'],
    ['Daniela', 'Para bajar de peso, también es importante hacer ejercicio.'],
    ['Ricardo', 'Ya lo sé, pero llego del trabajo agotado y no tengo tiempo.'],
    ['Daniela', 'Entonces sería mejor caminar media hora por la mañana, antes del trabajo.'],
    ['Ricardo', 'Bueno, voy a probar. ¿Y la carne?'],
    ['Daniela', 'Sí, pero poca. Yo en tu lugar, comería más pescado.'],
  ],
  ES_B1_RATE,
);

const DORMIR = reading(
  'es.stim.b1-u7-dormir',
  'description',
  'A short article from a health website.',
  [
    'Muchas personas duermen poco y están agotadas todo el día.',
    'Dormir bien es muy importante para la salud, y no es tan difícil.',
    'Primero, no tomes café después de las cinco de la tarde.',
    'También es mejor cenar temprano y poco.',
    'Apaga el celular una hora antes de dormir: cuanto más miras la pantalla, peor duermes.',
    'Y si tienes mucho estrés, escribe tus problemas en un cuaderno antes de acostarte.',
    'Cuanto más tranquila es tu noche, mejor duermes.',
  ],
  { title: 'Cómo dormir mejor' },
);

const ESTRES = dialogue(
  'es.stim.b1-u7-estres',
  'Adriana and Paola, two friends who work in the same office in Mexico City, talk at lunchtime.',
  [
    ['Adriana', 'Paola, te veo muy cansada. ¿Estás bien?'],
    ['Paola', 'No mucho. Tengo mucho estrés en el trabajo y duermo muy mal.'],
    ['Adriana', 'Me preocupa que trabajes tantas horas. Ayer saliste de la oficina a las diez.'],
    ['Paola', 'Es que mi jefe quiere el proyecto para el viernes.'],
    ['Adriana', 'Te entiendo, pero tienes que cuidarte. Yo que tú, hablaría con él.'],
    ['Paola', 'Tienes razón. ¿Y tú qué haces cuando tienes estrés?'],
    ['Adriana', 'Medito diez minutos todas las mañanas. Cuanto más medito, más tranquila estoy.'],
    ['Paola', '¿Meditar? Nunca lo he probado.'],
    ['Adriana', 'Es fácil. Esta noche te mando una app para empezar.'],
  ],
  ES_B1_RATE,
);

const ANIMO = reading(
  'es.stim.b1-u7-animo',
  'message',
  'A message from Gabriel to his friend Sergio, who had a difficult year.',
  [
    '¡Hola, Sergio!',
    'Tu hermana me dijo que estás mejor y que ya volviste al trabajo.',
    '¡Me alegra mucho que te cuides!',
    'Ahora tienes una vida más sana: dejaste de fumar, haces ejercicio y comes mejor.',
    'Pero me preocupa que trabajes tanto otra vez.',
    'Recuerda: tu bienestar es lo primero. ¡Cuídate!',
    '¿Por qué no vamos a nadar el sábado?',
    'Un abrazo, Gabriel',
  ],
  { from: 'Gabriel', to: 'Sergio' },
);

export const ES_B1_U07: EsUnitDef = {
  names: ['Ricardo', 'Daniela', 'Adriana', 'Paola', 'Gabriel', 'Sergio', 'Carmen', 'Luis'],
  support: [
    // condicional de consejo
    'descansaría',
    'tomaría',
    'hablaría',
    'comería',
    'dormiría',
    'buscaría',
    // dormir y otros presentes
    'duermo',
    'duermes',
    'duermen',
    'fumo',
    'fuma',
    'medito',
    'cuidarte',
    'cuídate',
    'necesito',
    'empezar',
    'caminar',
    'acostarte',
    'apaga',
    // subjuntivo con emociones
    'duermas',
    'fumes',
    'cuides',
    // pasados nuevos
    'volviste',
    // otras formas
    'refrescos',
    'fácil',
    'difícil',
    'tantas',
    'abrazo',
    'personas',
    'problemas',
    'malo',
  ],
  unit: {
    position: 7,
    title: 'Health and well-being',
    titleEn: 'Salud y bienestar',
    description:
      'Give and ask for health advice with the conditional (yo que tú, sería mejor), talk about diet, exercise, sleep and stress, and react to other people’s news with me alegra que and me preocupa que + subjunctive.',
    emoji: '🧘',
    objective:
      'You can give and ask for health advice, talk about stress and healthy habits, say that the more you do something the better (or worse) you feel, and react with emotion to what another person tells you.',
    grammar: {
      title:
        'Advice with the conditional · me alegra que / me preocupa que + subjunctive · cuanto más…',
      explanation:
        'To give advice, Spanish softens it with the conditional. You already know deberías (you should) + infinitive. To put yourself in the other person’s place, say yo que tú (literally “I, than you”: if I were you) or yo en tu lugar (in your place), followed by a verb in the conditional: yo que tú, descansaría. The conditional is easy to form: take the whole infinitive and add -ía, -ías, -ía, -íamos, -ían, the same endings for -ar, -er and -ir verbs (hablaría, comería, dormiría). The í always carries a written accent. Verbs with an irregular future use the same stem (tendría, podría, saldría). Sería mejor (it would be better) is followed by an infinitive: sería mejor caminar. Verbs of emotion such as me alegra que (I’m glad that) and me preocupa que (it worries me that) take the subjunctive when someone else does the action: me alegra que estés mejor, me preocupa que no duermas. If there is no change of person, use the infinitive: me preocupa dormir poco. The subjunctive “swaps” the vowel: -ar verbs take -e (trabajes, fumes) and -er / -ir verbs take -a (duermas, comas). Finally, to say that two things grow together, use cuanto más…, más / mejor / peor…: cuanto más duermo, mejor me siento (the more I sleep, the better I feel). In Mexico you will hear mientras más… with the same meaning. Cada vez más means more and more: tengo cada vez más estrés.',
      examples: [
        {
          target: 'Yo que tú, descansaría un poco más.',
          base: 'If I were you, I’d rest a bit more.',
        },
        {
          target: 'Me preocupa que no duermas bien.',
          base: 'It worries me that you don’t sleep well.',
        },
        {
          target: 'Cuanto más duermo, mejor me siento.',
          base: 'The more I sleep, the better I feel.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U7), en español neutro de Latinoamérica con tú. Sin revisión nativa. Revisar: «yo que tú» + condicional (en el habla se oye también «yo que tú, + presente»: yo que tú, voy al médico; no se enseña); «yo en tu lugar» enseñado con la palabra «en tu lugar» (¿se entiende solo, sin «yo»?); «sería mejor» + infinitivo (se evita «sería mejor que» + imperfecto de subjuntivo, que es de U11); «me alegra que» frente a «me alegro de que» (aceptado en las respuestas, no enseñado) y «¡qué bueno que…!», sólo mencionado; «mientras más» como alternativa mexicana de «cuanto más» (aceptada); «hacer ejercicio» sin artículo; «bajar de peso» (también «adelgazar», no enseñado); «comer sano» como adverbio; «refrescos» para soft drinks (en otros países «gaseosas»); «nutrióloga» (México) frente a «nutricionista» (sólo en el contexto en inglés); «agotado» como forma enseñada y «agotada» por concordancia; «tomaría más agua» (tomar = beber en Latinoamérica); la nutrióloga tutea al paciente porque se conocen (en una primera consulta se usaría usted). Se evitaron «iría» y «haría» en los consejos porque son palabras de U11.',
    },
    words: [
      w(
        'es-yo-que-tu',
        'yo que tú',
        'if I were you',
        'Yo que tú, descansaría un poco más.',
        'If I were you, I’d rest a bit more.',
        ['b1', 'advice', 'conditional'],
        { acceptedTranslations: ['if I was you'] },
      ),
      w(
        'es-en-tu-lugar',
        'en tu lugar',
        'in your place',
        'Yo en tu lugar, hablaría con el médico.',
        'In your place, I’d talk to the doctor.',
        ['b1', 'advice'],
        { acceptedTranslations: ['in your shoes'] },
      ),
      w(
        'es-seria-mejor',
        'sería mejor',
        'it would be better',
        'Sería mejor ir al médico hoy.',
        'It would be better to go to the doctor today.',
        ['b1', 'advice', 'conditional'],
      ),
      w(
        'es-me-alegra-que',
        'me alegra que',
        "I'm glad that",
        'Me alegra que estés mejor.',
        'I’m glad you’re feeling better.',
        ['b1', 'emotions', 'subjunctive'],
        { acceptedTranslations: ['it makes me happy that'] },
      ),
      w(
        'es-me-preocupa-que',
        'me preocupa que',
        'it worries me that',
        'Me preocupa que no duermas bien.',
        'It worries me that you don’t sleep well.',
        ['b1', 'emotions', 'subjunctive'],
        { acceptedTranslations: ["I'm worried that"] },
      ),
      w(
        'es-la-salud',
        'la salud',
        'health',
        'Fumar es muy malo para la salud.',
        'Smoking is very bad for your health.',
        ['b1', 'health'],
        { emoji: '🩺' },
      ),
      w(
        'es-el-estres',
        'el estrés',
        'stress',
        'Tengo mucho estrés en el trabajo.',
        'I have a lot of stress at work.',
        ['b1', 'health'],
        { emoji: '😫' },
      ),
      w(
        'es-la-dieta',
        'la dieta',
        'diet',
        'Mi dieta tiene muchas verduras y poca carne.',
        'My diet has lots of vegetables and little meat.',
        ['b1', 'health', 'food'],
        { emoji: '🥗' },
      ),
      w(
        'es-sano',
        'sano',
        'healthy',
        'Quiero una vida más sana.',
        'I want a healthier life.',
        ['b1', 'health'],
        { acceptedTexts: ['sana'] },
      ),
      w(
        'es-el-ejercicio',
        'el ejercicio',
        'exercise',
        'Hago ejercicio tres veces por semana.',
        'I exercise three times a week.',
        ['b1', 'health', 'sport'],
        { emoji: '🏃' },
      ),
      w(
        'es-cuidarse',
        'cuidarse',
        'to look after oneself',
        'Cuando hay mucho estrés, es importante cuidarse.',
        'When there is a lot of stress, it’s important to look after yourself.',
        ['b1', 'health', 'verbs'],
        { acceptedTranslations: ['to take care of oneself'] },
      ),
      w(
        'es-bajar-de-peso',
        'bajar de peso',
        'to lose weight',
        'Mi papá quiere bajar de peso antes del verano.',
        'My dad wants to lose weight before the summer.',
        ['b1', 'health', 'verbs'],
      ),
      w(
        'es-fumar',
        'fumar',
        'to smoke',
        'Dejé de fumar hace dos años.',
        'I stopped smoking two years ago.',
        ['b1', 'health', 'verbs'],
        { emoji: '🚭' },
      ),
      w(
        'es-agotado',
        'agotado',
        'exhausted',
        'Trabajo doce horas al día y estoy agotado.',
        'I work twelve hours a day and I’m exhausted.',
        ['b1', 'health', 'adjectives'],
        { acceptedTranslations: ['worn out'], acceptedTexts: ['agotada'] },
      ),
      w(
        'es-el-bienestar',
        'el bienestar',
        'well-being',
        'Para mi bienestar, necesito tiempo libre.',
        'For my well-being, I need free time.',
        ['b1', 'health'],
        { acceptedTranslations: ['wellbeing', 'wellness'] },
      ),
      w(
        'es-cuanto-mas',
        'cuanto más',
        'the more',
        'Cuanto más duermo, mejor me siento.',
        'The more I sleep, the better I feel.',
        ['b1', 'comparison'],
        { acceptedTexts: ['mientras más'] },
      ),
      w(
        'es-meditar',
        'meditar',
        'to meditate',
        'Me gusta meditar por la mañana, antes del trabajo.',
        'I like to meditate in the morning, before work.',
        ['b1', 'health', 'verbs'],
        { emoji: '🧘' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Yo que tú, descansaría',
        objective: 'Give advice with yo que tú, yo en tu lugar and sería mejor.',
        intro: {
          explanation:
            'You already give advice with deberías + infinitive (deberías descansar). To sound like a friend who puts themselves in your place, Spanish says yo que tú (if I were you) or yo en tu lugar (in your place) + a verb in the conditional. The conditional is the whole infinitive + -ía: descansar → descansaría, comer → comería, dormir → dormiría. The í has a written accent, and the stress falls on it: des-can-sa-RÍ-a. Sería mejor (it would be better) goes with an infinitive: sería mejor ir al médico.',
          examples: [
            {
              target: 'Estás agotado. Yo que tú, descansaría un poco.',
              base: 'You’re exhausted. If I were you, I’d rest a little.',
            },
            {
              target: 'Sería mejor ir al médico hoy.',
              base: 'It would be better to go to the doctor today.',
            },
          ],
        },
        takeaways: [
          'You give advice with yo que tú or yo en tu lugar + a verb ending in -ía.',
          'You suggest a better option with sería mejor + infinitive.',
        ],
        exercises: [
          ex.translationChoice(
            'yo que tú',
            'if I were you',
            ['me too', 'you and me', 'I think so'],
            ['es-yo-que-tu'],
            { id: 'es.ex.dv6in0mqculrry' },
          ),
          ex.matchPairs(
            [
              ['yo que tú', 'if I were you'],
              ['en tu lugar', 'in your place'],
              ['sería mejor', 'it would be better'],
              ['la salud', 'health'],
            ],
            ['es-yo-que-tu', 'es-en-tu-lugar', 'es-seria-mejor', 'es-la-salud'],
            { id: 'es.ex.cs0gbixx5aef9a' },
          ),
          ex.fillBlank(
            'Estás agotado. Yo que tú, ___ un poco.',
            'You’re exhausted. If I were you, I’d rest a little.',
            'descansaría',
            ['descansar', 'descanso', 'descansa'],
            ['es-yo-que-tu', 'es-agotado'],
            {
              id: 'es.ex.f4tht9v4a3mqf3',
              explanation:
                'After yo que tú the verb goes in the conditional: infinitive + -ía → descansaría (I would rest). Descanso is the present and descansar is the infinitive.',
            },
          ),
          ex.translationChoice(
            'agotado',
            'exhausted',
            ['bored', 'healthy', 'embarrassed'],
            ['es-agotado'],
            { id: 'es.ex.yawa4mz8a6luzv' },
          ),
          ex.listenChoice(
            'Yo que tú, hablaría con el médico.',
            ['Yo que tú, hablo con el médico.', 'Yo también hablé con el médico.'],
            ['es-yo-que-tu'],
            { id: 'es.ex.so4duxzv53jseb' },
          ),
          ex.fillBlank(
            'Me duele mucho la espalda. — ___ ir al médico.',
            'My back hurts a lot. — It would be better to go to the doctor.',
            'Sería mejor',
            ['Sería mejor que', 'Yo que tú'],
            ['es-seria-mejor'],
            {
              id: 'es.ex.njhhnbch573kqa',
              explanation:
                'Sería mejor goes straight before an infinitive: sería mejor ir. Sería mejor que needs a conjugated verb after it, and yo que tú also needs a conjugated verb (yo que tú, iría…).',
            },
          ),
          ex.fillBlank(
            'Yo en tu ___, dormiría más.',
            'In your place, I would sleep more.',
            'lugar',
            ['casa', 'vida', 'salud'],
            ['es-en-tu-lugar'],
            {
              id: 'es.ex.4c0v6vvgc1mhkc',
              skill: 'vocabulary',
              explanation:
                'Yo en tu lugar means “me in your place”: it works just like yo que tú, with a verb in the conditional (dormiría).',
            },
          ),
          ex.orderWords(
            'Yo en tu lugar buscaría otro médico.',
            'In your place, I’d look for another doctor.',
            ['es-en-tu-lugar'],
            { id: 'es.ex.owybwns2npc0sw' },
          ),
          ex.translateWrite(
            'If I were you, I’d talk to the doctor.',
            'Yo que tú, hablaría con el médico.',
            ['es-yo-que-tu'],
            {
              id: 'es.ex.0yxrecgrrw8zgo',
              acceptedAnswers: [
                'Yo que tú hablaría con el médico.',
                'Yo que tú, hablaría con la médica.',
                'Yo que tú, hablaría con un médico.',
                'Yo que tú, hablaría con una médica.',
                'Yo en tu lugar, hablaría con el médico.',
                'Yo en tu lugar hablaría con el médico.',
                'Yo que tú, hablaría con el doctor.',
              ],
            },
          ),
          ex.shortAnswer(
            'Estoy agotado. ¿Qué hago?',
            'Your friend is exhausted. Give advice with «Yo que tú…» and the conditional of descansar.',
            'Yo que tú, descansaría.',
            [
              'Yo que tú descansaría.',
              'Yo que tú, descansaría un poco.',
              'Yo que tú, descansaría más.',
              'Yo que tú, descansaría mucho.',
              'Yo que tú, descansaría un poco más.',
              'Yo en tu lugar, descansaría.',
              'Yo en tu lugar descansaría.',
              'Yo en tu lugar, descansaría un poco.',
            ],
            ['es-yo-que-tu', 'es-agotado'],
            { id: 'es.ex.0twwpp8o0kzulb' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Una dieta sana',
        objective: 'Talk about diet, exercise, weight and smoking.',
        intro: {
          explanation:
            'La dieta is what you usually eat (una dieta sana, a healthy diet); estar a dieta means to be on a diet. Sano means healthy and agrees like any adjective: una vida sana; comer sano (to eat healthily) is also very common. To exercise is hacer ejercicio, with no article. To lose weight is bajar de peso (the opposite is subir de peso). And to stop smoking is dejar de fumar: dejé de fumar hace un año.',
          examples: [
            {
              target: 'Hago ejercicio tres veces por semana.',
              base: 'I exercise three times a week.',
            },
            {
              target: 'Quiero bajar de peso: voy a comer más sano.',
              base: 'I want to lose weight: I’m going to eat more healthily.',
            },
          ],
        },
        takeaways: [
          'You talk about your diet and say you exercise with hacer ejercicio.',
          'You say someone wants to lose weight or stopped smoking.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['la dieta', 'diet'],
              ['sano', 'healthy'],
              ['el ejercicio', 'exercise'],
              ['bajar de peso', 'to lose weight'],
            ],
            ['es-la-dieta', 'es-sano', 'es-el-ejercicio', 'es-bajar-de-peso'],
            { id: 'es.ex.a2w54j2687ap83' },
          ),
          ex.fillBlank(
            'Hago ___ tres veces por semana.',
            'I exercise three times a week.',
            'ejercicio',
            ['salud', 'peso', 'agua'],
            ['es-el-ejercicio'],
            {
              id: 'es.ex.bkf8t07amn6q0q',
              skill: 'vocabulary',
              explanation:
                'To exercise is hacer ejercicio, with no article: hago ejercicio. Salud is health and peso is weight.',
            },
          ),
          ex.listenChoice(
            'Dejé de fumar hace un año.',
            ['Dejé de fumar hace un mes.', 'Empecé a fumar hace un año.'],
            ['es-fumar'],
            { id: 'es.ex.1pqzqo3wg0tsb5' },
          ),
          question(
            'es.ex.f7kqirddteh4cp',
            NUTRIOLOGA,
            'What does Ricardo still do that is not healthy?',
            'He drinks soft drinks every day',
            ['He eats too much meat', 'He smokes after work', 'He eats no vegetables'],
            ['es-la-dieta', 'es-sano'],
            'Ricardo says “Como más verduras, pero sigo tomando refrescos todos los días”, and Daniela answers that soft drinks are not healthy at all.',
          ),
          question(
            'es.ex.wu1q2p50p4yr3z',
            NUTRIOLOGA,
            'Why doesn’t Ricardo exercise?',
            'He gets home from work exhausted and has no time',
            ['He doesn’t like sport', 'His back hurts', 'He works in the mornings'],
            ['es-el-ejercicio', 'es-agotado'],
            'He says “llego del trabajo agotado y no tengo tiempo”.',
          ),
          question(
            'es.ex.9b1rhbauzct50o',
            NUTRIOLOGA,
            'What does Daniela suggest about exercise?',
            'Walking for half an hour in the morning, before work',
            ['Going to the gym at night', 'Swimming on weekends', 'Running after dinner'],
            ['es-seria-mejor', 'es-bajar-de-peso'],
            'Daniela says “sería mejor caminar media hora por la mañana, antes del trabajo”.',
          ),
          ex.fillBlank(
            'Mi hermana quiere ___ de peso: come más verduras y menos pan.',
            'My sister wants to lose weight: she eats more vegetables and less bread.',
            'bajar',
            ['tomar', 'hacer', 'tener'],
            ['es-bajar-de-peso'],
            {
              id: 'es.ex.wksfeq8wh4cmvu',
              skill: 'vocabulary',
              explanation: 'To lose weight is bajar de peso (literally “to go down in weight”).',
            },
          ),
          ex.orderWords(
            'Quiero una dieta más sana.',
            'I want a healthier diet.',
            ['es-la-dieta', 'es-sano'],
            {
              id: 'es.ex.wvcbq9m02n712t',
            },
          ),
          ex.translateWrite(
            'Smoking is bad for your health.',
            'Fumar es malo para la salud.',
            ['es-fumar', 'es-la-salud'],
            {
              id: 'es.ex.ruh1pvlt8ahek3',
              acceptedAnswers: [
                'Fumar es malo para tu salud.',
                'Fumar es muy malo para la salud.',
                'Fumar no es bueno para la salud.',
                'Fumar no es bueno para tu salud.',
                'Fumar hace mal a la salud.',
                'Fumar es dañino para la salud.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Haces ejercicio?',
            'Say yes: you exercise three times a week.',
            'Sí, hago ejercicio tres veces por semana.',
            [
              'Sí, hago ejercicio tres veces por semana',
              'Hago ejercicio tres veces por semana.',
              'Sí, hago ejercicio tres veces a la semana.',
              'Hago ejercicio tres veces a la semana.',
              'Sí. Hago ejercicio tres veces por semana.',
            ],
            ['es-el-ejercicio'],
            { id: 'es.ex.b8t5loqg3jkd9d' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Cuanto más duermes…',
        objective: 'Say that two things grow together with cuanto más… and cada vez más.',
        intro: {
          explanation:
            'To say that one thing grows with another, Spanish uses cuanto más + verb or noun, and then más, menos, mejor or peor: cuanto más duermo, mejor me siento (the more I sleep, the better I feel). There is no word for “the”. With a noun, cuanto agrees: cuanto más café, cuanta más agua. In Mexico people often say mientras más with the same meaning. To say “more and more”, use cada vez más: tengo cada vez más estrés. Dormir changes o to ue: duermo, duermes, duerme.',
          examples: [
            {
              target: 'Cuanto más duermo, mejor me siento.',
              base: 'The more I sleep, the better I feel.',
            },
            { target: 'Tengo cada vez más estrés.', base: 'I have more and more stress.' },
          ],
        },
        takeaways: [
          'You say the more…, the better… with cuanto más…, mejor…',
          'You talk about stress and sleep, and say cada vez más for more and more.',
        ],
        exercises: [
          ex.translationChoice(
            'el estrés',
            'stress',
            ['rest', 'health', 'diet'],
            ['es-el-estres'],
            { id: 'es.ex.i5t8o4z7g2p13g' },
          ),
          ex.fillBlank(
            'Cuanto más café tomas, ___ duermes.',
            'The more coffee you drink, the worse you sleep.',
            'peor',
            ['mejor', 'muy'],
            ['es-cuanto-mas'],
            {
              id: 'es.ex.vsi5bfkq7b5fkz',
              explanation:
                'After cuanto más… the second part starts with más, menos, mejor or peor. More coffee means worse sleep: peor duermes.',
            },
          ),
          ex.listenChoice(
            'Cuanto más duermo, mejor me siento.',
            ['Cuanto más duermo, peor me siento.', 'Cuando duermo, me siento mejor.'],
            ['es-cuanto-mas'],
            { id: 'es.ex.wwcp6pc3jhlgra' },
          ),
          question(
            'es.ex.q2vk8ubvao66kz',
            DORMIR,
            'According to the article, when should you stop drinking coffee?',
            'After five in the afternoon',
            ['After lunch', 'One hour before bed', 'After dinner'],
            ['es-la-salud'],
            'The article says “no tomes café después de las cinco de la tarde”.',
          ),
          question(
            'es.ex.nfrwdqr999bfjf',
            DORMIR,
            'Why should you switch off your phone an hour before bed?',
            'Because the more you look at the screen, the worse you sleep',
            [
              'Because the light wakes up the family',
              'Because messages cause stress',
              'Because it uses a lot of battery',
            ],
            ['es-cuanto-mas'],
            'It says “cuanto más miras la pantalla, peor duermes”.',
          ),
          question(
            'es.ex.tyxvygekhql1b2',
            DORMIR,
            'What does the article recommend if you have a lot of stress?',
            'Writing your problems in a notebook before going to bed',
            ['Taking a long walk', 'Talking to a doctor', 'Sleeping in the afternoon'],
            ['es-el-estres'],
            'The article says “si tienes mucho estrés, escribe tus problemas en un cuaderno antes de acostarte”.',
          ),
          ex.fillBlank(
            'Tengo cada vez ___ estrés en el trabajo.',
            'I have more and more stress at work.',
            'más',
            ['mucho', 'muy'],
            ['es-el-estres'],
            {
              id: 'es.ex.p5gm8r6jx3cot2',
              explanation: 'More and more is cada vez más: tengo cada vez más estrés.',
            },
          ),
          ex.orderWords(
            'Tengo cada vez más estrés en el trabajo.',
            'I have more and more stress at work.',
            ['es-el-estres'],
            { id: 'es.ex.ca6mhlnhm5uahg' },
          ),
          ex.translateWrite(
            'The more I sleep, the better I feel.',
            'Cuanto más duermo, mejor me siento.',
            ['es-cuanto-mas'],
            {
              id: 'es.ex.gbcn0uteecl1q3',
              acceptedAnswers: [
                'Cuanto más duermo mejor me siento.',
                'Mientras más duermo, mejor me siento.',
                'Mientras más duermo mejor me siento.',
                'Cuanto más duermo, me siento mejor.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Por qué estás agotada?',
            'Say you have a lot of stress at work (start with «Tengo»).',
            'Tengo mucho estrés en el trabajo.',
            [
              'Tengo mucho estrés en el trabajo',
              'Tengo mucho estrés.',
              'Tengo mucho estrés en mi trabajo.',
              'Tengo mucho estrés en la oficina.',
              'Tengo cada vez más estrés en el trabajo.',
              'Porque tengo mucho estrés en el trabajo.',
            ],
            ['es-el-estres', 'es-agotado'],
            { id: 'es.ex.afiwhza72t225s' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me preocupa que trabajes tanto',
        objective:
          'Express worry with me preocupa que + subjunctive and talk about looking after yourself.',
        intro: {
          explanation:
            'When you react to what another person does, the verb after que goes in the subjunctive: me preocupa que trabajes tanto (it worries me that you work so much). The subjunctive swaps the vowel of the present: trabajas → trabajes, fumas → fumes, duermes → duermas. If you talk about yourself, use the infinitive: me preocupa dormir poco. Cuidarse (to look after oneself) is reflexive: me cuido, te cuidas, and to a friend, ¡cuídate! (take care!). Meditar is to meditate.',
          examples: [
            {
              target: 'Me preocupa que no duermas bien.',
              base: 'It worries me that you don’t sleep well.',
            },
            { target: 'Tienes que cuidarte más.', base: 'You have to look after yourself more.' },
          ],
        },
        takeaways: [
          'You say what worries you about someone with me preocupa que + subjunctive.',
          'You tell a friend to look after themselves and talk about meditating.',
        ],
        exercises: [
          ex.translationChoice(
            'me preocupa que',
            'it worries me that',
            ['I hope that', 'I want (someone) to', 'it would be better'],
            ['es-me-preocupa-que'],
            { id: 'es.ex.l3pijeh3b8qmhy' },
          ),
          ex.fillBlank(
            'Me preocupa que no ___ bien.',
            'It worries me that you don’t sleep well.',
            'duermas',
            ['duermes', 'dormir'],
            ['es-me-preocupa-que'],
            {
              id: 'es.ex.j71sw5vry6n58q',
              explanation:
                'Me preocupa que + another person takes the subjunctive: duermes → duermas. The infinitive dormir only works without que (me preocupa dormir poco).',
            },
          ),
          ex.matchPairs(
            [
              ['me preocupa que', 'it worries me that'],
              ['cuidarse', 'to look after oneself'],
              ['meditar', 'to meditate'],
              ['el estrés', 'stress'],
            ],
            ['es-me-preocupa-que', 'es-cuidarse', 'es-meditar', 'es-el-estres'],
            { id: 'es.ex.yqqkytve8yq80f' },
          ),
          question(
            'es.ex.3z2tffi5x03hfo',
            ESTRES,
            'What worries Adriana?',
            'That Paola works so many hours',
            ['That Paola eats badly', 'That Paola wants to change jobs', 'That Paola smokes'],
            ['es-me-preocupa-que'],
            'Adriana says “Me preocupa que trabajes tantas horas” and adds that Paola left the office at ten.',
          ),
          question(
            'es.ex.ne096kvlsheaui',
            ESTRES,
            'What does Adriana advise Paola to do?',
            'To talk to her boss',
            ['To finish the project on Friday', 'To change offices', 'To go to the doctor'],
            ['es-yo-que-tu', 'es-cuidarse'],
            'She says “tienes que cuidarte. Yo que tú, hablaría con él”, and él is Paola’s boss.',
          ),
          question(
            'es.ex.lxndgi0x8y0jdd',
            ESTRES,
            'How does Adriana deal with stress?',
            'She meditates for ten minutes every morning',
            ['She swims after work', 'She sleeps in the afternoon', 'She walks to the office'],
            ['es-meditar', 'es-el-estres'],
            'Adriana says “Medito diez minutos todas las mañanas”.',
          ),
          ex.listenChoice(
            'Tienes que cuidarte más.',
            ['Tienes que descansar más.', 'Tienes que comer más.'],
            ['es-cuidarse'],
            { id: 'es.ex.krwbpqtm2705di' },
          ),
          ex.fillBlank(
            'Me preocupa que ___ tanto.',
            'It worries me that you smoke so much.',
            'fumes',
            ['fumas', 'fumar'],
            ['es-me-preocupa-que', 'es-fumar'],
            {
              id: 'es.ex.6em99mq9xsaw89',
              explanation:
                'After me preocupa que the verb of the other person goes in the subjunctive: fumas → fumes (-ar verbs take -e).',
            },
          ),
          ex.translateWrite(
            'It worries me that you work so much.',
            'Me preocupa que trabajes tanto.',
            ['es-me-preocupa-que'],
            {
              id: 'es.ex.zjpnauelyao5dp',
              acceptedAnswers: [
                'Me preocupa que trabajes mucho.',
                'Me preocupa que tú trabajes tanto.',
                'A mí me preocupa que trabajes tanto.',
                'Me preocupa que trabajes tantas horas.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué haces para cuidarte?',
            'Say you meditate every morning (start with «Medito»).',
            'Medito todas las mañanas.',
            [
              'Medito todas las mañanas',
              'Medito cada mañana.',
              'Medito todos los días por la mañana.',
              'Medito por la mañana.',
              'Medito diez minutos todas las mañanas.',
            ],
            ['es-meditar', 'es-cuidarse'],
            { id: 'es.ex.5gvpwypjtrsjgc' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Me alegra que te cuides',
        objective: 'React to good news with me alegra que + subjunctive and talk about well-being.',
        intro: {
          explanation:
            'Me alegra que (I’m glad that) works like me preocupa que: when someone else does the action, the verb goes in the subjunctive. Estar becomes estés, hacer becomes hagas, cuidarse becomes te cuides: me alegra que estés mejor. You will also hear me alegro de que and, very often in Mexico, ¡qué bueno que…! with the same subjunctive. El bienestar (well-being) is more than health: sleep, free time, friends.',
          examples: [
            { target: 'Me alegra que estés mejor.', base: 'I’m glad you’re feeling better.' },
            {
              target: 'Para mi bienestar, necesito tiempo libre.',
              base: 'For my well-being, I need free time.',
            },
          ],
        },
        takeaways: [
          'You react to good news with me alegra que + subjunctive.',
          'You talk about well-being and encourage a friend.',
        ],
        exercises: [
          ex.translationChoice(
            'me alegra que',
            "I'm glad that",
            ['it worries me that', 'if I were you', 'I hope that'],
            ['es-me-alegra-que'],
            { id: 'es.ex.bfhkej10e30g9y' },
          ),
          ex.fillBlank(
            'Me alegra que ___ mejor.',
            'I’m glad you’re feeling better.',
            'estés',
            ['estás', 'eres'],
            ['es-me-alegra-que'],
            {
              id: 'es.ex.v24lc1jp5p9ndw',
              explanation:
                'Me alegra que + another person takes the subjunctive: estás → estés. Eres (ser) is for who you are, not how you feel.',
            },
          ),
          question(
            'es.ex.lorsj7rmavq5js',
            ANIMO,
            'How does Gabriel know that Sergio is better?',
            'Sergio’s sister told him',
            ['Sergio called him', 'He saw him at work', 'Sergio’s doctor told him'],
            ['es-me-alegra-que'],
            'Gabriel writes “Tu hermana me dijo que estás mejor”.',
          ),
          question(
            'es.ex.u1se68lky5844e',
            ANIMO,
            'What has Sergio changed in his life?',
            'He stopped smoking, he exercises and he eats better',
            [
              'He changed jobs and moved house',
              'He started meditating and sleeps more',
              'He works less and goes on holiday',
            ],
            ['es-fumar', 'es-el-ejercicio', 'es-sano'],
            'Gabriel writes “dejaste de fumar, haces ejercicio y comes mejor”.',
          ),
          question(
            'es.ex.u5xen47s1pt1ai',
            ANIMO,
            'What still worries Gabriel?',
            'That Sergio is working too much again',
            ['That Sergio doesn’t sleep', 'That Sergio smokes again', 'That Sergio is alone'],
            ['es-me-preocupa-que', 'es-el-bienestar'],
            'He writes “me preocupa que trabajes tanto otra vez” and reminds him that his well-being comes first.',
          ),
          ex.listenChoice(
            'Me alegra que hagas ejercicio.',
            ['Me preocupa que no hagas ejercicio.', 'Me alegra hacer ejercicio.'],
            ['es-me-alegra-que', 'es-el-ejercicio'],
            { id: 'es.ex.s5hdnw6l4deccp' },
          ),
          ex.translationChoice(
            'el bienestar',
            'well-being',
            ['stress', 'diet', 'exercise'],
            ['es-el-bienestar'],
            { id: 'es.ex.n7nvv4sd6ulm8c' },
          ),
          ex.orderWords(
            'Me alegra mucho que te cuides.',
            'I’m really glad you’re looking after yourself.',
            ['es-me-alegra-que', 'es-cuidarse'],
            { id: 'es.ex.o30124x9la23o6' },
          ),
          ex.translateWrite(
            'I’m glad you’re feeling better.',
            'Me alegra que estés mejor.',
            ['es-me-alegra-que'],
            {
              id: 'es.ex.aj12a77nwzonfm',
              acceptedAnswers: [
                'Me alegra que ya estés mejor.',
                'Me alegra mucho que estés mejor.',
                'Me alegro de que estés mejor.',
                'Me alegro que estés mejor.',
                'Qué bueno que estés mejor.',
                '¡Qué bueno que estés mejor!',
              ],
            },
          ),
          ex.shortAnswer(
            'Ahora hago ejercicio todos los días.',
            'Your friend tells you some good news. React with «Me alegra que…».',
            'Me alegra que hagas ejercicio.',
            [
              'Me alegra que hagas ejercicio',
              'Me alegra mucho que hagas ejercicio.',
              'Me alegra que hagas ejercicio todos los días.',
              '¡Me alegra que hagas ejercicio!',
              'Me alegra que te cuides.',
              'Me alegro de que hagas ejercicio.',
            ],
            ['es-me-alegra-que', 'es-el-ejercicio'],
            { id: 'es.ex.607bsiwo6ix67s' },
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
export const ES_B1_U07_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.consejos-estres',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u07-l05',
    title: 'Advice for a stressed friend',
    instructions:
      'A friend tells you they are exhausted and stressed. Write them a message: react to what they tell you, say what worries you and give them advice with the conditional.',
    prompts: ['Estoy agotado y tengo mucho estrés. ¿Qué hago?'],
    requirements: [
      {
        id: 'advice',
        label:
          'You give advice with the conditional (yo que tú…, yo en tu lugar…, sería mejor…, deberías…)',
        kind: 'pattern',
        patterns: [['yo', 'que', 'tú'], ['en', 'tu', 'lugar'], ['sería', 'mejor'], ['deberías']],
      },
      {
        id: 'emotion',
        label: 'You react with me preocupa que or me alegra que + subjunctive',
        kind: 'pattern',
        patterns: [['me', 'preocupa|alegra', 'que']],
      },
      {
        id: 'health',
        label: 'You mention a healthy habit (el ejercicio, dormir, meditar, la dieta, cuidarte…)',
        kind: 'pattern',
        patterns: [['ejercicio|dormir|duermas|meditar|dieta|cuidarte|caminar|descansar']],
      },
      ...common(5),
    ],
    model:
      '¡Hola, Luis! Siento mucho que estés agotado. Me preocupa que trabajes tantas horas y que no duermas bien. Yo que tú, hablaría con tu jefe. También sería mejor caminar un poco por la mañana. Y antes de dormir, ¡apaga el celular! ¿Por qué no empiezas a meditar? Cuanto más descansas, mejor te sientes. Un abrazo, Carmen.',
    checklist: [
      'After yo que tú / yo en tu lugar I use a verb in -ía (hablaría, descansaría).',
      'After sería mejor I use an infinitive (sería mejor caminar).',
      'After me preocupa que / me alegra que the other person’s verb is in the subjunctive (trabajes, duermas, estés).',
    ],
  },
];
