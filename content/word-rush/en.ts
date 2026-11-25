import type { WordRushBank, WordRushSentenceDef } from './types';

/** Frase nueva de A1 con id `en.wr.uNN-<slug>`. */
const a1 = (
  unit: number,
  slug: string,
  sentence: string,
  translation: string,
  extra: Pick<WordRushSentenceDef, 'accepted' | 'onlyOrder'> = {},
): WordRushSentenceDef => ({
  id: `en.wr.u${String(unit).padStart(2, '0')}-${slug}`,
  level: 'A1',
  unit,
  sentence,
  translation,
  ...extra,
});

/** Banco de Word Rush del curso «en» (ver docs/WORD_RUSH_CONTENT.md). */
export const EN_WORD_RUSH: WordRushBank = {
  language: 'en',
  names: ['Ana', 'Tom'],
  sentences: [
    // U1 — Saludos y presentaciones
    a1(1, 'is-your-name-tom', 'Is your name Tom?', '¿Te llamás Tom?'),
    a1(1, 'hi-how-are-you', 'Hi, how are you?', 'Hola, ¿cómo estás?'),
    a1(1, 'excuse-me-are-you-ana', 'Excuse me, are you Ana?', 'Disculpá, ¿sos Ana?'),
    a1(1, 'good-morning-tom', 'Good morning, Tom.', 'Buenos días, Tom.'),
    a1(1, 'yes-i-am-tom', 'Yes, I am Tom.', 'Sí, soy Tom.'),
    a1(1, 'no-my-name-is-ana', 'No, my name is Ana.', 'No, me llamo Ana.'),

    // U2 — Pronombres y verbo to be
    a1(2, 'we-are-friends', 'We are friends.', 'Somos amigos.'),
    a1(2, 'they-are-not-tired', 'They are not tired.', 'Ellos no están cansados.'),
    a1(2, 'is-she-your-teacher', 'Is she your teacher?', '¿Ella es tu profesora?'),
    a1(2, 'are-you-tired', 'Are you tired?', '¿Estás cansado?'),
    a1(2, 'he-is-not-happy', 'He is not happy.', 'Él no está contento.'),
    a1(2, 'we-are-students', 'We are students.', 'Somos estudiantes.'),
    a1(2, 'is-he-your-friend', 'Is he your friend?', '¿Él es tu amigo?'),
    a1(2, 'you-are-my-friend', 'You are my friend.', 'Sos mi amigo.'),
    a1(2, 'they-are-teachers', 'They are teachers.', 'Ellos son profesores.'),
    a1(2, 'are-they-students', 'Are they students?', '¿Ellos son estudiantes?'),
    a1(2, 'ana-is-tired', 'Ana is tired.', 'Ana está cansada.'),
    a1(2, 'tom-is-not-my-teacher', 'Tom is not my teacher.', 'Tom no es mi profesor.'),

    // U3 — Números, edades y países
    a1(3, 'he-is-from-mexico', 'He is from Mexico.', 'Él es de México.'),
    a1(3, 'where-is-ana-from', 'Where is Ana from?', '¿De dónde es Ana?'),
    a1(3, 'my-friend-is-from-england', 'My friend is from England.', 'Mi amigo es de Inglaterra.'),
    a1(3, 'we-are-from-the-us', 'We are from the United States.', 'Somos de Estados Unidos.'),
    a1(3, 'are-you-from-spain', 'Are you from Spain?', '¿Sos de España?'),
    a1(3, 'she-is-eleven', 'She is eleven years old.', 'Ella tiene once años.'),
    a1(
      3,
      'how-old-is-your-teacher',
      'How old is your teacher?',
      '¿Cuántos años tiene tu profesor?',
    ),
    a1(3, 'tom-is-fifteen', 'Tom is fifteen.', 'Tom tiene quince.'),
    a1(3, 'where-are-they-from', 'Where are they from?', '¿De dónde son ellos?'),
    a1(3, 'im-not-from-argentina', "I'm not from Argentina.", 'No soy de Argentina.'),
    a1(3, 'is-she-twelve', 'Is she twelve?', '¿Ella tiene doce años?'),

    // U4 — Familia y personas
    a1(4, 'my-sister-is-ten', 'My sister is ten.', 'Mi hermana tiene diez años.'),
    a1(4, 'who-is-your-teacher', 'Who is your teacher?', '¿Quién es tu profesor?'),
    a1(
      4,
      'their-mother-is-a-teacher',
      'Their mother is a teacher.',
      'La mamá de ellos es profesora.',
    ),
    a1(4, 'i-have-a-sister', 'I have a sister.', 'Tengo una hermana.'),
    a1(
      4,
      'our-grandfather-is-from-spain',
      'Our grandfather is from Spain.',
      'Nuestro abuelo es de España.',
    ),
    a1(4, 'his-sister-is-a-student', 'His sister is a student.', 'La hermana de él es estudiante.'),
    a1(4, 'they-have-a-baby', 'They have a baby.', 'Tienen un bebé.'),
    a1(
      4,
      'my-grandmother-is-from-mexico',
      'My grandmother is from Mexico.',
      'Mi abuela es de México.',
    ),
    a1(4, 'the-girl-is-six', 'The girl is six years old.', 'La nena tiene seis años.'),
    a1(4, 'is-your-father-a-teacher', 'Is your father a teacher?', '¿Tu papá es profesor?'),
    a1(4, 'my-parents-are-tired', 'My parents are tired.', 'Mis papás están cansados.'),
    a1(4, 'the-boy-is-not-my-brother', 'The boy is not my brother.', 'El chico no es mi hermano.'),

    // U5 — Objetos cotidianos
    a1(5, 'is-this-your-phone', 'Is this your phone?', '¿Este es tu teléfono?'),
    a1(5, 'that-bag-is-big', 'That bag is big.', 'Ese bolso es grande.'),
    a1(5, 'i-have-a-blue-pen', 'I have a blue pen.', 'Tengo una lapicera azul.'),
    a1(5, 'these-are-not-my-keys', 'These are not my keys.', 'Estas no son mis llaves.'),
    a1(5, 'my-computer-is-small', 'My computer is small.', 'Mi computadora es chica.'),
    a1(5, 'where-is-my-phone', 'Where is my phone?', '¿Dónde está mi teléfono?'),
    a1(5, 'her-bag-is-green', 'Her bag is green.', 'El bolso de ella es verde.'),
    a1(5, 'those-books-are-red', 'Those books are red.', 'Esos libros son rojos.'),
    a1(5, 'this-is-an-old-phone', 'This is an old phone.', 'Este es un teléfono viejo.'),
    a1(5, 'where-are-my-keys', 'Where are my keys?', '¿Dónde están mis llaves?'),
    a1(5, 'that-is-not-my-pen', 'That is not my pen.', 'Esa no es mi lapicera.'),
    a1(5, 'he-has-a-black-computer', 'He has a black computer.', 'Él tiene una computadora negra.'),

    // U6 — Casa y habitaciones
    a1(
      6,
      'my-bed-is-under-the-window',
      'My bed is under the window.',
      'Mi cama está debajo de la ventana.',
    ),
    a1(6, 'is-there-a-garden', 'Is there a garden?', '¿Hay un jardín?'),
    a1(6, 'there-are-two-bathrooms', 'There are two bathrooms.', 'Hay dos baños.'),
    a1(6, 'the-sofa-is-green', 'The sofa is green.', 'El sillón es verde.'),
    a1(
      6,
      'their-apartment-is-big',
      'Their apartment is big.',
      'El departamento de ellos es grande.',
    ),
    a1(6, 'the-book-is-on-the-table', 'The book is on the table.', 'El libro está sobre la mesa.'),
    a1(6, 'where-is-the-kitchen', 'Where is the kitchen?', '¿Dónde está la cocina?'),
    a1(6, 'there-is-no-door', 'There is no door.', 'No hay puerta.'),
    a1(6, 'my-phone-is-on-the-sofa', 'My phone is on the sofa.', 'Mi teléfono está en el sillón.'),
    a1(
      6,
      'the-living-room-has-two-windows',
      'The living room has two windows.',
      'El living tiene dos ventanas.',
    ),
    a1(6, 'is-the-bathroom-big', 'Is the bathroom big?', '¿El baño es grande?'),
    a1(6, 'there-are-four-chairs', 'There are four chairs.', 'Hay cuatro sillas.'),

    // U7 — Comida y bebidas
    a1(7, 'i-am-hungry', 'I am hungry.', 'Tengo hambre.'),
    a1(7, 'are-they-thirsty', 'Are they thirsty?', '¿Ellos tienen sed?'),
    a1(7, 'i-want-a-coffee-please', 'I want a coffee, please.', 'Quiero un café, por favor.'),
    a1(7, 'we-want-three-apples', 'We want three apples.', 'Queremos tres manzanas.'),
    a1(7, 'dinner-is-on-the-table', 'Dinner is on the table.', 'La cena está en la mesa.'),
    a1(7, 'the-baby-drinks-milk', 'The baby drinks milk.', 'El bebé toma leche.'),
    a1(7, 'she-wants-an-apple', 'She wants an apple.', 'Ella quiere una manzana.'),
    a1(
      7,
      'the-milk-is-in-the-kitchen',
      'The milk is in the kitchen.',
      'La leche está en la cocina.',
    ),
    a1(7, 'this-cheese-is-good', 'This cheese is good.', 'Este queso es rico.'),
    a1(7, 'my-sister-drinks-juice', 'My sister drinks juice.', 'Mi hermana toma jugo.'),

    // U8 — Rutinas y presente simple
    a1(8, 'i-go-to-work-every-day', 'I go to work every day.', 'Voy a trabajar todos los días.', {
      accepted: ['Every day I go to work.'],
    }),
    a1(8, 'she-lives-in-spain', 'She lives in Spain.', 'Ella vive en España.'),
    a1(8, 'do-you-work-at-home', 'Do you work at home?', '¿Trabajás desde casa?'),
    a1(8, 'he-never-drinks-coffee', 'He never drinks coffee.', 'Él nunca toma café.'),
    a1(8, 'they-play-in-the-garden', 'They play in the garden.', 'Ellos juegan en el jardín.'),
    a1(8, 'does-she-read-every-day', 'Does she read every day?', '¿Ella lee todos los días?'),
    a1(8, 'i-wake-up-at-seven', 'I wake up at seven.', 'Me despierto a las siete.'),
    a1(8, 'he-doesnt-live-in-england', "He doesn't live in England.", 'Él no vive en Inglaterra.'),
    a1(8, 'where-do-you-live', 'Where do you live?', '¿Dónde vivís?'),
    a1(8, 'i-usually-read-at-home', 'I usually read at home.', 'Normalmente leo en casa.'),
    a1(8, 'do-they-go-to-school', 'Do they go to school?', '¿Ellos van a la escuela?'),

    // U9 — Horarios y días
    a1(9, 'what-time-is-it', 'What time is it?', '¿Qué hora es?'),
    a1(9, 'i-study-in-the-afternoon', 'I study in the afternoon.', 'Estudio a la tarde.', {
      accepted: ['In the afternoon I study.'],
    }),
    a1(9, 'see-you-on-friday', 'See you on Friday.', 'Nos vemos el viernes.'),
    a1(9, 'is-today-tuesday', 'Is today Tuesday?', '¿Hoy es martes?'),
    a1(
      9,
      'i-work-on-saturday-morning',
      'I work on Saturday morning.',
      'Trabajo el sábado a la mañana.',
    ),
    a1(9, 'they-dont-watch-tv', "They don't watch TV.", 'Ellos no miran televisión.'),
    a1(9, 'its-half-past-seven', "It's half past seven.", 'Son las siete y media.'),
    a1(9, 'what-time-do-you-eat-lunch', 'What time do you eat lunch?', '¿A qué hora almorzás?'),
    a1(9, 'i-read-on-the-weekend', 'I read on the weekend.', 'Leo los fines de semana.'),
    a1(9, 'i-dont-work-tomorrow', "I don't work tomorrow.", 'Mañana no trabajo.', {
      accepted: ["Tomorrow I don't work."],
    }),
    a1(9, 'she-gets-up-at-six', "She gets up at six o'clock.", 'Ella se levanta a las seis.'),

    // U10 — Lugares de la ciudad
    a1(10, 'the-bank-is-on-the-left', 'The bank is on the left.', 'El banco está a la izquierda.'),
    a1(10, 'is-the-hospital-far', 'Is the hospital far?', '¿El hospital queda lejos?'),
    a1(10, 'where-is-the-supermarket', 'Where is the supermarket?', '¿Dónde está el supermercado?'),
    a1(10, 'turn-left-at-the-bank', 'Turn left at the bank.', 'Doblá a la izquierda en el banco.'),
    a1(
      10,
      'the-park-is-near-my-house',
      'The park is near my house.',
      'El parque está cerca de mi casa.',
    ),
    a1(
      10,
      'the-bus-station-is-far',
      'The bus station is far.',
      'La estación de colectivos queda lejos.',
    ),
    a1(10, 'go-straight-on', 'Go straight on.', 'Seguí derecho.'),
    a1(
      10,
      'my-city-has-a-big-park',
      'My city has a big park.',
      'Mi ciudad tiene un parque grande.',
    ),
    a1(
      10,
      'the-restaurant-is-not-far',
      'The restaurant is not far.',
      'El restaurante no queda lejos.',
    ),
    a1(
      10,
      'she-works-at-the-hospital',
      'She works at the hospital.',
      'Ella trabaja en el hospital.',
    ),
    a1(10, 'i-live-on-this-street', 'I live on this street.', 'Vivo en esta calle.'),
    a1(
      10,
      'the-shop-is-on-the-right',
      'The shop is on the right.',
      'El negocio está a la derecha.',
    ),

    // U11 — Gustos y preferencias
    a1(11, 'she-likes-music', 'She likes music.', 'A ella le gusta la música.'),
    a1(11, 'can-you-swim', 'Can you swim?', '¿Sabés nadar?'),
    a1(
      11,
      'my-favorite-sport-is-football',
      'My favorite sport is football.',
      'Mi deporte favorito es el fútbol.',
      {
        accepted: ['Football is my favorite sport.'],
      },
    ),
    a1(11, 'we-dont-like-this-movie', "We don't like this movie.", 'No nos gusta esta película.'),
    a1(11, 'he-sings-very-well', 'He sings very well.', 'Él canta muy bien.'),
    a1(11, 'i-hate-mondays', 'I hate Mondays.', 'Odio los lunes.'),
    a1(11, 'do-you-like-cooking', 'Do you like cooking?', '¿Te gusta cocinar?'),
    a1(11, 'my-brother-can-cook', 'My brother can cook.', 'Mi hermano sabe cocinar.'),
    a1(11, 'this-game-is-fun', 'This game is fun.', 'Este juego es divertido.'),
    a1(11, 'i-like-football-too', 'I like football too.', 'A mí también me gusta el fútbol.'),
    a1(
      11,
      'what-is-your-favorite-movie',
      'What is your favorite movie?',
      '¿Cuál es tu película favorita?',
    ),
    a1(11, 'she-cant-sing', "She can't sing.", 'Ella no sabe cantar.'),

    // U12 — Preguntas y conversaciones básicas
    a1(
      12,
      'can-you-repeat-that-please',
      'Can you repeat that, please?',
      '¿Podés repetir eso, por favor?',
    ),
    a1(12, 'what-does-this-word-mean', 'What does this word mean?', '¿Qué significa esta palabra?'),
    a1(12, 'why-are-you-tired', 'Why are you tired?', '¿Por qué estás cansado?'),
    a1(12, 'i-dont-know', "I don't know.", 'No sé.'),
    a1(12, 'do-you-speak-spanish', 'Do you speak Spanish?', '¿Hablás español?'),
    a1(
      12,
      'how-many-brothers-do-you-have',
      'How many brothers do you have?',
      '¿Cuántos hermanos tenés?',
    ),
    a1(12, 'when-do-you-work', 'When do you work?', '¿Cuándo trabajás?'),
    a1(12, 'which-book-do-you-want', 'Which book do you want?', '¿Qué libro querés?'),
    a1(12, 'how-much-is-the-coffee', 'How much is the coffee?', '¿Cuánto sale el café?'),
    a1(12, 'i-know-the-answer', 'I know the answer.', 'Sé la respuesta.'),
    a1(12, 'please-speak-slowly', 'Please speak slowly.', 'Hablá despacio, por favor.', {
      accepted: ['Speak slowly, please.'],
    }),
    a1(
      12,
      'she-speaks-english-very-well',
      'She speaks English very well.',
      'Ella habla inglés muy bien.',
    ),
    a1(12, 'i-understand-the-question', 'I understand the question.', 'Entiendo la pregunta.'),
  ],
  variants: [
    {
      exercise: 'a1-u07-l03-e05',
      accepted: ['They eat rice and chicken.'],
      reason: 'Conector «and» entre dos comidas: el orden de los dos lados es indistinto.',
    },
    {
      exercise: 'a2-u05-l01-e06',
      accepted: ['Now he is writing an email.'],
      reason: '«now» al principio es igual de natural.',
    },
    {
      exercise: 'a2-u11-l03-e07',
      accepted: ['Today the sky is very blue.'],
      reason: '«today» al principio es igual de natural.',
    },
    {
      exercise: 'a2-u16-l05-e06',
      accepted: ["Tonight I'll call you back."],
      reason: '«tonight» al principio es natural.',
    },
  ],
  onlyOrder: [
    {
      exercise: 'a2-u14-l03-e07',
      reason: '«How about…?» fija el orden: «tonight» no va al principio de forma natural.',
    },
  ],
};
