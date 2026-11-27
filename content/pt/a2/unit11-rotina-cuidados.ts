import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U11 «Rutina y cuidados» (docs/PT_A1_A2.md): los verbos reflexivos con el pronombre antes
 * del verbo, como en Brasil (eu me levanto, você se deita), los que no son reflexivos en portugués
 * (tomar banho, acordar), la frecuencia (às vezes, de vez em quando, uma vez por semana) y la duración
 * (há / faz… , desde). Falso amigo: academia es el «gimnasio».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PODCAST = dialogue(
  'pt.stim.a2-u11-podcast',
  'Un podcast sobre hábitos saludables entrevista a una corredora.',
  [
    ['Apresentador', 'Como é a sua rotina, Joana?'],
    ['Joana', 'Eu me levanto às cinco e meia, tomo banho e corro uma hora no parque.'],
    ['Apresentador', 'Todo dia?'],
    ['Joana', 'Quase. Às vezes eu descanso no domingo. E me deito cedo, às dez.'],
    ['Apresentador', 'Há quanto tempo você corre?'],
    ['Joana', 'Há oito anos. Comecei na faculdade.'],
  ],
);

const ACADEMIA = reading(
  'pt.stim.a2-u11-academia',
  'post',
  'Un chico cuenta sus hábitos en una red social.',
  [
    'Faz dois anos que eu vou à academia três vezes por semana.',
    'Antes eu me sentia cansado o tempo todo. Agora me sinto muito melhor!',
    'Eu nunca como fast-food e só bebo refrigerante de vez em quando.',
    'O segredo? Dormir bem e não desistir.',
  ],
  { from: 'Mateus', title: 'Dois anos de academia' },
);

const MANHA = reading(
  'pt.stim.a2-u11-manha',
  'description',
  'Una madre describe la mañana en su casa.',
  [
    'Na minha casa a manhã é uma correria.',
    'Eu acordo às seis e me arrumo rápido. O meu marido prepara o café.',
    'As crianças se vestem sozinhas, mas sempre perdem um sapato!',
    'A gente sai de casa às sete e meia.',
  ],
  { title: 'As nossas manhãs' },
);

export const PT_A2_U11: PtUnitDef = {
  names: ['Apresentador', 'Joana', 'Mateus'],
  support: [
    'vestir',
    'correria',
    'marido',
    'prepara',
    'vestem',
    'sozinhas',
    'perdem',
    'sai',
    'lavo',
    'rotina',
    'corro',
    'quase',
    'descanso',
    'corre',
    'comecei',
    'sentia',
    'fast',
    'food',
    'refrigerante',
    'segredo',
    'desistir',
    'frequência',
    'primo',
    'meses',
  ],
  unit: {
    position: 11,
    title: 'Rutina y cuidados',
    titleEn: 'Rotina e cuidados',
    description:
      'Los verbos reflexivos (me levanto, me deito, me sinto), tomar banho, la frecuencia, la duración con há / faz y desde, y el falso amigo academia.',
    emoji: '⏰',
    objective:
      'Puedes contar tu rutina con verbos reflexivos, decir con qué frecuencia haces algo y desde hace cuánto tiempo.',
    grammar: {
      title: 'Reflexivos · frecuencia y duración',
      explanation:
        'En Brasil el pronombre reflexivo va antes del verbo: eu me levanto, você / ele se levanta, nós nos levantamos, eles se levantam. No son reflexivos tomar banho (bañarse) ni acordar (despertarse). Duración: há / faz + tiempo («hace»): moro aqui há dois anos; faz dois anos que moro aqui. Desde es igual.',
      examples: [
        { target: 'Eu me levanto às seis.', base: 'Me levanto a las seis.' },
        { target: 'Às vezes eu vou à academia.', base: 'A veces voy al gimnasio.' },
        { target: 'Moro em Recife há dois anos.', base: 'Vivo en Recife hace dos años.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U11). Sin revisión nativa: revisar la colocación de los reflexivos y há / faz.',
    },
    words: [
      w(
        'pt-me-levanto',
        'me levanto',
        'me levanto',
        'Eu me levanto às sete.',
        'Me levanto a las siete.',
        ['routine', 'reflexive'],
        {
          acceptedTexts: ['se levanta'],
        },
      ),
      w(
        'pt-me-deito',
        'me deito',
        'me acuesto',
        'Eu me deito às onze.',
        'Me acuesto a las once.',
        ['routine', 'reflexive'],
        {
          acceptedTexts: ['se deita'],
        },
      ),
      w(
        'pt-me-visto',
        'me visto',
        'me visto',
        'Eu me visto rápido.',
        'Me visto rápido.',
        ['routine', 'reflexive'],
        {
          acceptedTexts: ['se veste'],
        },
      ),
      w(
        'pt-me-arrumo',
        'me arrumo',
        'me arreglo / me preparo',
        'Eu me arrumo para sair.',
        'Me arreglo para salir.',
        ['routine', 'reflexive'],
        {
          acceptedTexts: ['se arruma'],
          acceptedTranslations: ['me arreglo', 'me preparo'],
        },
      ),
      w(
        'pt-me-sinto',
        'me sinto',
        'me siento (estado)',
        'Hoje eu me sinto bem.',
        'Hoy me siento bien.',
        ['feelings', 'reflexive'],
        {
          acceptedTexts: ['se sente'],
          acceptedTranslations: ['me siento'],
        },
      ),
      w(
        'pt-tomo-banho',
        'tomo banho',
        'me baño / me ducho',
        'Eu tomo banho de manhã.',
        'Me baño por la mañana.',
        ['routine'],
        {
          acceptedTexts: ['tomar banho', 'toma banho'],
          acceptedTranslations: ['me baño', 'me ducho'],
          emoji: '🚿',
        },
      ),
      w(
        'pt-as-vezes',
        'às vezes',
        'a veces',
        'Às vezes eu almoço em casa.',
        'A veces almuerzo en casa.',
        ['frequency'],
      ),
      w(
        'pt-de-vez-em-quando',
        'de vez em quando',
        'de vez en cuando',
        'De vez em quando eu como pizza.',
        'De vez en cuando como pizza.',
        ['frequency'],
      ),
      w(
        'pt-nunca',
        'nunca',
        'nunca',
        'Eu nunca bebo café à noite.',
        'Nunca tomo café por la noche.',
        ['frequency'],
      ),
      w(
        'pt-toda-semana',
        'toda semana',
        'todas las semanas',
        'Eu jogo futebol toda semana.',
        'Juego al fútbol todas las semanas.',
        ['frequency'],
        {
          acceptedTexts: ['toda a semana'],
          acceptedTranslations: ['cada semana'],
        },
      ),
      w(
        'pt-vez-por-semana',
        'uma vez por semana',
        'una vez por semana',
        'Eu vou à academia uma vez por semana.',
        'Voy al gimnasio una vez por semana.',
        ['frequency'],
        {
          acceptedTexts: ['duas vezes por semana', 'três vezes por semana'],
        },
      ),
      w(
        'pt-ha-muito-tempo',
        'há muito tempo',
        'hace mucho tiempo',
        'Moro aqui há muito tempo.',
        'Vivo aquí hace mucho tiempo.',
        ['duration'],
        {
          acceptedTexts: ['faz muito tempo'],
        },
      ),
      w(
        'pt-faz-tempo',
        'faz tempo',
        'hace tiempo',
        'Faz tempo que eu não vejo você!',
        '¡Hace tiempo que no te veo!',
        ['duration'],
      ),
      w(
        'pt-desde',
        'desde',
        'desde',
        'Eu estudo português desde março.',
        'Estudio portugués desde marzo.',
        ['duration'],
      ),
      w(
        'pt-academia',
        'academia',
        'gimnasio',
        'Eu vou à academia de manhã.',
        'Voy al gimnasio por la mañana.',
        ['health', 'places'],
        {
          acceptedTranslations: ['gym'],
          emoji: '🏋️',
        },
      ),
      w('pt-cedo', 'cedo', 'temprano', 'Eu acordo cedo.', 'Me despierto temprano.', [
        'routine',
        'time',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Eu me levanto cedo',
        objective: 'Contar tu mañana con verbos reflexivos.',
        intro: {
          explanation:
            'En Brasil el reflexivo va antes del verbo: eu me levanto, você se levanta. Cedo es «temprano». Ojo: acordar («despertarse») no lleva pronombre: eu acordo às seis e me levanto às seis e meia.',
          examples: [
            {
              target: 'Eu acordo cedo e me levanto às seis.',
              base: 'Me despierto temprano y me levanto a las seis.',
            },
            { target: 'Você se levanta tarde no domingo?', base: '¿Te levantas tarde el domingo?' },
          ],
        },
        takeaways: [
          'Cuentas tu mañana: me levanto, me visto.',
          'Pones el pronombre antes del verbo.',
        ],
        exercises: [
          ex.translationChoice(
            'cedo',
            'temprano',
            ['tarde', 'pronto (rápido)', 'siempre'],
            ['pt-cedo'],
            { id: 'pt.ex.i2zk5sitthw1x2' },
          ),
          ex.listenChoice(
            'Eu me levanto às seis.',
            ['Eu me levanto às sete.', 'Ele se levanta às seis.', 'Eu me visto às seis.'],
            ['pt-me-levanto'],
            { id: 'pt.ex.gd6pf8peil0kpx' },
          ),
          ex.fillBlank(
            'Eu ___ levanto às sete.',
            'Me levanto a las siete.',
            'me',
            ['se', 'te', 'eu'],
            ['pt-me-levanto'],
            {
              id: 'pt.ex.eks6lm7rmdjukb',
              explanation: 'Con eu, el reflexivo es me, antes del verbo.',
            },
          ),
          ex.fillBlank(
            'A Joana ___ levanta muito cedo.',
            'Joana se levanta muy temprano.',
            'se',
            ['me', 'te', 'nos'],
            ['pt-me-levanto', 'pt-cedo'],
            { id: 'pt.ex.410jr4b87mwxb6', explanation: 'Con ela: se levanta.' },
          ),
          ex.fillBlank(
            'Eu me ___ rápido e saio.',
            'Me visto rápido y salgo.',
            'visto',
            ['veste', 'vestir', 'levanta'],
            ['pt-me-visto'],
            { id: 'pt.ex.5j8ehpd6oiu2wv' },
          ),
          question(
            'pt.ex.54y4vmcsk4xkvd',
            MANHA,
            '¿Qué hace la madre a las seis?',
            'Se despierta y se arregla rápido',
            ['Prepara el café', 'Viste a los chicos', 'Sale de casa'],
            ['pt-me-arrumo'],
            'Escribe: «Eu acordo às seis e me arrumo rápido».',
          ),
          question(
            'pt.ex.36vqk6hoiqxxwz',
            MANHA,
            '¿Qué pasa siempre con los chicos?',
            'Se visten solos, pero pierden un zapato',
            ['Se levantan tarde', 'No quieren vestirse', 'Llegan tarde a la escuela'],
            ['pt-me-visto'],
            'Dice: «As crianças se vestem sozinhas, mas sempre perdem um sapato!».',
          ),
          ex.orderWords(
            'Eu me arrumo para o trabalho.',
            'Me arreglo para el trabajo.',
            ['pt-me-arrumo'],
            { id: 'pt.ex.v24htlg7yeofd1' },
          ),
          ex.shortAnswer(
            'A que horas você se levanta? (7h)',
            '¿A qué hora te levantas? (Responde que a las siete.)',
            'Eu me levanto às sete.',
            ['Me levanto às sete.', 'Às sete.', 'Eu me levanto às sete horas.'],
            ['pt-me-levanto'],
            { id: 'pt.ex.tc7mvic6qchjbj' },
          ),
          ex.translateWrite('Me levanto temprano.', 'Eu me levanto cedo.', ['pt-cedo'], {
            id: 'pt.ex.lou1dkp09l0vt1',
            acceptedAnswers: ['Me levanto cedo.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tomo banho e me deito',
        objective: 'Contar tu noche y los verbos que cambian.',
        intro: {
          explanation:
            'Algunos verbos no son reflexivos como en español: «bañarse» es tomar banho (eu tomo banho) y «despertarse», acordar. Deitar-se es «acostarse»: eu me deito às onze.',
          examples: [
            {
              target: 'À noite eu tomo banho e me deito.',
              base: 'Por la noche me baño y me acuesto.',
            },
            { target: 'Ela se deita muito tarde.', base: 'Ella se acuesta muy tarde.' },
          ],
        },
        takeaways: ['Dices «bañarse»: tomar banho.', 'Dices a qué hora te acuestas: me deito.'],
        exercises: [
          ex.translationChoice(
            'me deito',
            'me acuesto',
            ['me despierto', 'me dejo', 'me siento (estado)'],
            ['pt-me-deito'],
            { id: 'pt.ex.pyieeehr091dwz' },
          ),
          ex.imageChoice(
            '🚿',
            'tomo banho',
            ['me deito', 'me visto', 'me levanto'],
            ['pt-tomo-banho'],
            { id: 'pt.ex.fqww5w0iitimq9' },
          ),
          ex.listenChoice(
            'Eu tomo banho à noite.',
            ['Eu tomo banho de manhã.', 'Ele toma banho à noite.', 'Eu tomo café à noite.'],
            ['pt-tomo-banho'],
            { id: 'pt.ex.zz2tlsjxvtcx62' },
          ),
          ex.fillBlank(
            'Eu ___ banho de manhã.',
            'Me baño por la mañana.',
            'tomo',
            ['me tomo', 'faço', 'me lavo'],
            ['pt-tomo-banho'],
            { id: 'pt.ex.fbl71cm7w7d7aq', explanation: '«Bañarse» es tomar banho, sin pronombre.' },
          ),
          ex.fillBlank(
            'Eu me ___ às onze da noite.',
            'Me acuesto a las once de la noche.',
            'deito',
            ['deita', 'levanto', 'acordo'],
            ['pt-me-deito'],
            { id: 'pt.ex.ajshpybom6z9fa' },
          ),
          question(
            'pt.ex.ezlc97z31sjqzt',
            PODCAST,
            '¿Qué hace Joana después de levantarse?',
            'Se baña y corre una hora en el parque',
            ['Desayuna y va a trabajar', 'Corre y después se baña', 'Va al gimnasio'],
            ['pt-me-levanto', 'pt-tomo-banho'],
            'Joana dice: «Eu me levanto às cinco e meia, tomo banho e corro uma hora no parque».',
          ),
          question(
            'pt.ex.1z0ia2q173a7j2',
            PODCAST,
            '¿A qué hora se acuesta?',
            'Temprano, a las diez',
            ['A las once', 'Tarde, a las doce', 'A las cinco y media'],
            ['pt-me-deito', 'pt-cedo'],
            'Dice: «E me deito cedo, às dez».',
          ),
          ex.orderWords(
            'Ela se deita muito tarde.',
            'Ella se acuesta muy tarde.',
            ['pt-me-deito'],
            { id: 'pt.ex.7i6yn6y55kvp3c' },
          ),
          ex.shortAnswer(
            'Você toma banho de manhã ou à noite?',
            '¿Te bañas por la mañana o por la noche? (Responde que por la noche.)',
            'Eu tomo banho à noite.',
            ['Tomo banho à noite.', 'À noite.'],
            ['pt-tomo-banho'],
            { id: 'pt.ex.e5lcn34f7cbmgq' },
          ),
          ex.translateWrite(
            'Por la noche me baño y me acuesto.',
            'À noite eu tomo banho e me deito.',
            ['pt-tomo-banho', 'pt-me-deito'],
            {
              id: 'pt.ex.8hxho5b35s7ua2',
              acceptedAnswers: [
                'À noite tomo banho e me deito.',
                'De noite eu tomo banho e me deito.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Às vezes, nunca, toda semana',
        objective: 'Decir con qué frecuencia haces algo.',
        intro: {
          explanation:
            'De más a menos: sempre (siempre), toda semana (todas las semanas), às vezes (a veces), de vez em quando (de vez en cuando), nunca. Para contar veces: uma vez por semana, duas vezes por semana.',
          examples: [
            { target: 'Às vezes eu almoço em casa.', base: 'A veces almuerzo en casa.' },
            {
              target: 'Eu jogo futebol duas vezes por semana.',
              base: 'Juego al fútbol dos veces por semana.',
            },
          ],
        },
        takeaways: [
          'Dices la frecuencia: às vezes, nunca, toda semana.',
          'Cuentas veces: duas vezes por semana.',
        ],
        exercises: [
          ex.translationChoice(
            'de vez em quando',
            'de vez en cuando',
            ['siempre', 'todas las semanas', 'nunca'],
            ['pt-de-vez-em-quando'],
            {
              id: 'pt.ex.fumwbewb10hgp0',
            },
          ),
          ex.translationChoice(
            'às vezes',
            'a veces',
            ['a la vez', 'otra vez', 'siempre'],
            ['pt-as-vezes'],
            { id: 'pt.ex.5a1g1wwmb3qhd9' },
          ),
          ex.matchPairs(
            [
              ['às vezes', 'a veces'],
              ['toda semana', 'todas las semanas'],
              ['de vez em quando', 'de vez en cuando'],
              ['uma vez por semana', 'una vez por semana'],
            ],
            ['pt-as-vezes', 'pt-toda-semana', 'pt-de-vez-em-quando', 'pt-vez-por-semana'],
            { id: 'pt.ex.q595z4k879mh5s' },
          ),
          ex.listenChoice(
            'Eu nunca bebo café à noite.',
            [
              'Eu sempre bebo café à noite.',
              'Eu nunca bebo café de manhã.',
              'Às vezes eu bebo café à noite.',
            ],
            ['pt-nunca'],
            { id: 'pt.ex.vzzsjguezuh386' },
          ),
          ex.fillBlank(
            'Eu vou ao cinema ___ vezes.',
            'A veces voy al cine.',
            'às',
            ['nas', 'a', 'em'],
            ['pt-as-vezes'],
            { id: 'pt.ex.pvu10482mp5oaq' },
          ),
          ex.fillBlank(
            'Eu jogo futebol duas ___ por semana.',
            'Juego al fútbol dos veces por semana.',
            'vezes',
            ['vez', 'dias', 'horas'],
            ['pt-vez-por-semana'],
            { id: 'pt.ex.7h16ufdrgmouzj' },
          ),
          question(
            'pt.ex.h51moj91cz0jem',
            ACADEMIA,
            '¿Cuántas veces por semana va Mateus al gimnasio?',
            'Tres veces por semana',
            ['Una vez por semana', 'Todos los días', 'Dos veces por semana'],
            ['pt-vez-por-semana', 'pt-academia', 'pt-me-sinto'],
            'Mateus escribe: «eu vou à academia três vezes por semana».',
          ),
          question(
            'pt.ex.6o922sm62hpdkw',
            ACADEMIA,
            '¿Qué dice de la comida rápida y la gaseosa?',
            'Nunca come comida rápida y toma gaseosa de vez en cuando',
            ['Come comida rápida a veces', 'Toma gaseosa todos los días', 'Nunca toma gaseosa'],
            ['pt-nunca', 'pt-de-vez-em-quando'],
            'Dice: «Eu nunca como fast-food e só bebo refrigerante de vez em quando».',
          ),
          ex.shortAnswer(
            'Com que frequência você vai ao cinema? (às vezes)',
            '¿Con qué frecuencia vas al cine? (Responde que a veces.)',
            'Eu vou ao cinema às vezes.',
            ['Às vezes.', 'Às vezes eu vou ao cinema.', 'Vou às vezes.', 'Vou ao cinema às vezes.'],
            ['pt-as-vezes'],
            { id: 'pt.ex.7uck1u89z4nyhx' },
          ),
          ex.translateWrite(
            'Juego al fútbol todas las semanas.',
            'Eu jogo futebol toda semana.',
            ['pt-toda-semana'],
            {
              id: 'pt.ex.c4dyk6w0ehwmsv',
              acceptedAnswers: [
                'Jogo futebol toda semana.',
                'Eu jogo futebol todas as semanas.',
                'Jogo futebol todas as semanas.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Há dois anos, desde março',
        objective: 'Decir desde hace cuánto tiempo haces algo.',
        intro: {
          explanation:
            '«Hace» + tiempo se dice há o faz: moro aqui há dois anos, faz dois anos que moro aqui. Para preguntar: há quanto tempo…? Desde es igual: desde março. Faz tempo que não… es «hace tiempo que no…».',
          examples: [
            {
              target: 'Eu estudo português há dois anos.',
              base: 'Estudio portugués hace dos años.',
            },
            { target: 'Faz tempo que eu não vejo você!', base: '¡Hace tiempo que no te veo!' },
          ],
        },
        takeaways: [
          'Dices la duración: há dois anos, desde março.',
          'Preguntas: há quanto tempo…?',
        ],
        exercises: [
          ex.translationChoice(
            'há muito tempo',
            'hace mucho tiempo',
            ['hay mucho tiempo', 'en mucho tiempo', 'por poco tiempo'],
            ['pt-ha-muito-tempo'],
            {
              id: 'pt.ex.m5wupa71cnuii6',
            },
          ),
          ex.translationChoice(
            'faz tempo',
            'hace tiempo',
            ['hace calor', 'a tiempo', 'tienes tiempo'],
            ['pt-faz-tempo'],
            { id: 'pt.ex.pu51bciltm2dp7' },
          ),
          ex.listenChoice(
            'Moro aqui há muito tempo.',
            ['Moro aqui há pouco tempo.', 'Morei aqui muito tempo.', 'Moro aqui desde março.'],
            ['pt-ha-muito-tempo'],
            { id: 'pt.ex.29iw01cfmsx0j0' },
          ),
          ex.fillBlank(
            'Eu estudo português ___ dois anos.',
            'Estudio portugués hace dos años.',
            'há',
            ['faz', 'desde', 'por'],
            ['pt-ha-muito-tempo'],
            {
              id: 'pt.ex.11lim60kg7entg',
              explanation:
                'Tiempo + verbo antes: há dois anos (faz va al principio: faz dois anos que…).',
            },
          ),
          ex.fillBlank(
            'Eu trabalho aqui ___ março.',
            'Trabajo aquí desde marzo.',
            'desde',
            ['há', 'faz', 'em'],
            ['pt-desde'],
            { id: 'pt.ex.gqa6gew7di3vsp' },
          ),
          ex.fillBlank(
            '___ tempo que eu não vejo o meu primo.',
            'Hace tiempo que no veo a mi primo.',
            'Faz',
            ['Há', 'Desde', 'Tem'],
            ['pt-faz-tempo'],
            { id: 'pt.ex.gcbc1jurawo920', explanation: 'Al principio de la frase: faz tempo que…' },
          ),
          question(
            'pt.ex.sfv40refxrahzf',
            PODCAST,
            '¿Desde hace cuánto corre Joana?',
            'Hace ocho años: empezó en la facultad',
            ['Hace dos años', 'Desde el año pasado', 'Desde chica'],
            ['pt-ha-muito-tempo'],
            'Joana dice: «Há oito anos. Comecei na faculdade».',
          ),
          question(
            'pt.ex.wf1zhcpylm6vct',
            ACADEMIA,
            '¿Desde hace cuánto va Mateus al gimnasio?',
            'Hace dos años',
            ['Hace tres años', 'Hace dos meses', 'Desde la semana pasada'],
            ['pt-faz-tempo', 'pt-academia'],
            'Escribe: «Faz dois anos que eu vou à academia».',
          ),
          ex.shortAnswer(
            'Há quanto tempo você estuda português? (três meses)',
            '¿Hace cuánto estudias portugués? (Responde que hace tres meses.)',
            'Eu estudo português há três meses.',
            [
              'Há três meses.',
              'Estudo há três meses.',
              'Faz três meses.',
              'Faz três meses que eu estudo português.',
            ],
            ['pt-ha-muito-tempo'],
            { id: 'pt.ex.qo5hioxlfhw3fo' },
          ),
          ex.translateWrite(
            '¡Hace tiempo que no te veo!',
            'Faz tempo que eu não vejo você!',
            ['pt-faz-tempo'],
            {
              id: 'pt.ex.y3p1nx7xfn9e4b',
              acceptedAnswers: [
                'Faz tempo que não vejo você!',
                'Faz tempo que eu não te vejo!',
                'Faz tempo que não te vejo!',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Me sinto melhor',
        objective: 'Contar cómo te sientes y tus hábitos de salud.',
        intro: {
          explanation:
            'Sentir-se es «sentirse»: eu me sinto bem, ela se sente cansada. Falso amigo: academia es el «gimnasio» (la academia de idiomas es escola de idiomas).',
          examples: [
            {
              target: 'Depois da academia eu me sinto muito melhor.',
              base: 'Después del gimnasio me siento mucho mejor.',
            },
            { target: 'Você se sente cansado?', base: '¿Te sientes cansado?' },
          ],
        },
        takeaways: ['Dices cómo te sientes: me sinto…', 'Sabes que academia es «gimnasio».'],
        exercises: [
          ex.translationChoice(
            'academia',
            'gimnasio',
            ['academia de idiomas', 'facultad', 'escuela'],
            ['pt-academia'],
            {
              id: 'pt.ex.5l56i9e5pb3loj',
              explanation: 'Falso amigo: academia es el gimnasio.',
            },
          ),
          ex.translationChoice(
            'me sinto',
            'me siento (estado)',
            ['me siento (en una silla)', 'lo siento', 'me quedo'],
            ['pt-me-sinto'],
            {
              id: 'pt.ex.egmgi3depquue9',
              explanation: 'Me sinto es cómo te sientes; «sentarse» es sentar-se (eu me sento).',
            },
          ),
          ex.listenChoice(
            'Hoje eu me sinto muito melhor.',
            [
              'Hoje eu me sinto muito cansado.',
              'Hoje ela se sente melhor.',
              'Hoje eu estou muito melhor.',
            ],
            ['pt-me-sinto'],
            { id: 'pt.ex.ihxhkaqkx3a9wk' },
          ),
          ex.fillBlank(
            'Eu vou à ___ três vezes por semana.',
            'Voy al gimnasio tres veces por semana.',
            'academia',
            ['faculdade', 'farmácia', 'consulta'],
            ['pt-academia', 'pt-vez-por-semana'],
            { id: 'pt.ex.mk7s1f009the2w', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Ela ___ sente cansada hoje.',
            'Ella se siente cansada hoy.',
            'se',
            ['me', 'te', 'nos'],
            ['pt-me-sinto'],
            { id: 'pt.ex.7w5xi177mojtn3' },
          ),
          question(
            'pt.ex.ne870uw8q9a02m',
            ACADEMIA,
            '¿Cómo se sentía Mateus antes?',
            'Cansado todo el tiempo',
            ['Muy bien', 'Feliz pero sin energía', 'Enfermo'],
            ['pt-me-sinto'],
            'Escribe: «Antes eu me sentia cansado o tempo todo. Agora me sinto muito melhor!».',
          ),
          question(
            'pt.ex.2gbaux36but7xg',
            ACADEMIA,
            '¿Cuál es su secreto?',
            'Dormir bien y no rendirse',
            ['Comer comida rápida', 'Ir al gimnasio todos los días', 'Tomar mucha gaseosa'],
            ['pt-academia'],
            'Al final: «O segredo? Dormir bem e não desistir».',
          ),
          ex.orderWords(
            'Depois da academia eu me sinto melhor.',
            'Después del gimnasio me siento mejor.',
            ['pt-academia', 'pt-me-sinto'],
            {
              id: 'pt.ex.mjlmux2dtedgyd',
            },
          ),
          ex.shortAnswer(
            'Como você se sente hoje? (bem)',
            '¿Cómo te sientes hoy? (Responde que te sientes bien.)',
            'Eu me sinto bem.',
            [
              'Me sinto bem.',
              'Hoje eu me sinto bem.',
              'Me sinto bem, obrigado.',
              'Me sinto bem, obrigada.',
            ],
            ['pt-me-sinto'],
            { id: 'pt.ex.evluyuatpv1c66' },
          ),
          ex.translateWrite(
            'Voy al gimnasio una vez por semana.',
            'Eu vou à academia uma vez por semana.',
            ['pt-academia'],
            {
              id: 'pt.ex.djibbze284492k',
              acceptedAnswers: ['Vou à academia uma vez por semana.'],
            },
          ),
        ],
      },
    ],
  },
};
