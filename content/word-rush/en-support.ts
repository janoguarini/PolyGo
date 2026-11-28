/**
 * Ranked compartido (docs/RANKED_SHARED_POOL.md): la consigna de cada frase nueva del banco de Word
 * Rush de inglés (content/word-rush/en.ts) en los otros idiomas de apoyo de los cursos de inglés
 * (en-from-pt, en-from-it, en-from-fr). El inglés, las fichas y las respuestas no cambian: un
 * hispanohablante y un brasileño que juegan juntos arman la misma frase; cada uno lee la consigna en
 * su idioma.
 *
 * Registro, como en los cursos (docs/EN_MULTI_SOURCE.md §3): portugués de Brasil con «você»; italiano
 * estándar con «tu»; francés de Francia con «tu» y su tipografía (espacio fina antes de ? ! ; :, que
 * pone `fr()`). Mismo significado que el inglés; los nombres propios no se tocan.
 *
 * Lo carga scripts/build-word-rush-sql.ts en public.word_rush_sentence_translations
 * (supabase/pending/20270110120100_word_rush_sentence_translations.sql). Revisión nativa pendiente,
 * como el resto del contenido nuevo.
 */

export const WORD_RUSH_SUPPORT_LANGUAGES = ['pt', 'it', 'fr'] as const;
export type WordRushSupportLanguage = (typeof WORD_RUSH_SUPPORT_LANGUAGES)[number];

/** Espacio no separable antes de ? ! : ; (misma convención que content/en-src/fr/*.json). */
const fr = (text: string) => text.replace(/ ([?!:;])/g, ' $1');

/** [slug sin `en.wr.`, portugués, italiano, francés]. */
const ROWS: readonly (readonly [string, string, string, string])[] = [
  // U1
  ['u01-is-your-name-tom', 'Seu nome é Tom?', 'Ti chiami Tom?', 'Tu t’appelles Tom ?'],
  ['u01-hi-how-are-you', 'Oi, como você está?', 'Ciao, come stai?', 'Salut, comment ça va ?'],
  [
    'u01-excuse-me-are-you-ana',
    'Com licença, você é a Ana?',
    'Scusa, sei Ana?',
    'Excuse-moi, tu es Ana ?',
  ],
  ['u01-good-morning-tom', 'Bom dia, Tom.', 'Buongiorno, Tom.', 'Bonjour, Tom.'],
  ['u01-yes-i-am-tom', 'Sim, eu sou o Tom.', 'Sì, sono Tom.', 'Oui, je suis Tom.'],
  ['u01-no-my-name-is-ana', 'Não, meu nome é Ana.', 'No, mi chiamo Ana.', 'Non, je m’appelle Ana.'],
  // U2
  ['u02-we-are-friends', 'Nós somos amigos.', 'Siamo amici.', 'Nous sommes amis.'],
  [
    'u02-they-are-not-tired',
    'Eles não estão cansados.',
    'Loro non sono stanchi.',
    'Ils ne sont pas fatigués.',
  ],
  [
    'u02-is-she-your-teacher',
    'Ela é sua professora?',
    'Lei è la tua insegnante?',
    'C’est ta professeure ?',
  ],
  ['u02-are-you-tired', 'Você está cansado?', 'Sei stanco?', 'Tu es fatigué ?'],
  ['u02-he-is-not-happy', 'Ele não está feliz.', 'Lui non è felice.', 'Il n’est pas content.'],
  ['u02-we-are-students', 'Nós somos estudantes.', 'Siamo studenti.', 'Nous sommes étudiants.'],
  ['u02-is-he-your-friend', 'Ele é seu amigo?', 'Lui è tuo amico?', 'C’est ton ami ?'],
  ['u02-you-are-my-friend', 'Você é meu amigo.', 'Sei mio amico.', 'Tu es mon ami.'],
  [
    'u02-they-are-teachers',
    'Eles são professores.',
    'Loro sono insegnanti.',
    'Ils sont professeurs.',
  ],
  ['u02-are-they-students', 'Eles são estudantes?', 'Loro sono studenti?', 'Ils sont étudiants ?'],
  ['u02-ana-is-tired', 'A Ana está cansada.', 'Ana è stanca.', 'Ana est fatiguée.'],
  [
    'u02-tom-is-not-my-teacher',
    'O Tom não é meu professor.',
    'Tom non è il mio insegnante.',
    'Tom n’est pas mon professeur.',
  ],
  // U3
  ['u03-he-is-from-mexico', 'Ele é do México.', 'Lui è del Messico.', 'Il vient du Mexique.'],
  ['u03-where-is-ana-from', 'De onde a Ana é?', 'Di dov’è Ana?', 'D’où vient Ana ?'],
  [
    'u03-my-friend-is-from-england',
    'Meu amigo é da Inglaterra.',
    'Il mio amico è dell’Inghilterra.',
    'Mon ami vient d’Angleterre.',
  ],
  [
    'u03-we-are-from-the-us',
    'Nós somos dos Estados Unidos.',
    'Siamo degli Stati Uniti.',
    'Nous venons des États-Unis.',
  ],
  ['u03-are-you-from-spain', 'Você é da Espanha?', 'Sei della Spagna?', 'Tu viens d’Espagne ?'],
  ['u03-she-is-eleven', 'Ela tem onze anos.', 'Lei ha undici anni.', 'Elle a onze ans.'],
  [
    'u03-how-old-is-your-teacher',
    'Quantos anos tem o seu professor?',
    'Quanti anni ha il tuo insegnante?',
    'Quel âge a ton professeur ?',
  ],
  ['u03-tom-is-fifteen', 'O Tom tem quinze.', 'Tom ne ha quindici.', 'Tom a quinze ans.'],
  ['u03-where-are-they-from', 'De onde eles são?', 'Di dove sono loro?', 'D’où viennent-ils ?'],
  [
    'u03-im-not-from-argentina',
    'Eu não sou da Argentina.',
    'Non sono dell’Argentina.',
    'Je ne viens pas d’Argentine.',
  ],
  ['u03-is-she-twelve', 'Ela tem doze anos?', 'Lei ha dodici anni?', 'Elle a douze ans ?'],
  // U4
  [
    'u04-my-sister-is-ten',
    'Minha irmã tem dez anos.',
    'Mia sorella ha dieci anni.',
    'Ma sœur a dix ans.',
  ],
  [
    'u04-who-is-your-teacher',
    'Quem é o seu professor?',
    'Chi è il tuo insegnante?',
    'Qui est ton professeur ?',
  ],
  [
    'u04-their-mother-is-a-teacher',
    'A mãe deles é professora.',
    'La loro madre è insegnante.',
    'Leur mère est professeure.',
  ],
  ['u04-i-have-a-sister', 'Eu tenho uma irmã.', 'Ho una sorella.', 'J’ai une sœur.'],
  [
    'u04-our-grandfather-is-from-spain',
    'Nosso avô é da Espanha.',
    'Nostro nonno è della Spagna.',
    'Notre grand-père vient d’Espagne.',
  ],
  [
    'u04-his-sister-is-a-student',
    'A irmã dele é estudante.',
    'Sua sorella è una studentessa.',
    'Sa sœur est étudiante.',
  ],
  ['u04-they-have-a-baby', 'Eles têm um bebê.', 'Loro hanno un bambino.', 'Ils ont un bébé.'],
  [
    'u04-my-grandmother-is-from-mexico',
    'Minha avó é do México.',
    'Mia nonna è del Messico.',
    'Ma grand-mère vient du Mexique.',
  ],
  [
    'u04-the-girl-is-six',
    'A menina tem seis anos.',
    'La bambina ha sei anni.',
    'La fille a six ans.',
  ],
  [
    'u04-is-your-father-a-teacher',
    'Seu pai é professor?',
    'Tuo padre è insegnante?',
    'Ton père est professeur ?',
  ],
  [
    'u04-my-parents-are-tired',
    'Meus pais estão cansados.',
    'I miei genitori sono stanchi.',
    'Mes parents sont fatigués.',
  ],
  [
    'u04-the-boy-is-not-my-brother',
    'O menino não é meu irmão.',
    'Il ragazzo non è mio fratello.',
    'Le garçon n’est pas mon frère.',
  ],
  // U5
  [
    'u05-is-this-your-phone',
    'Este é o seu celular?',
    'Questo è il tuo telefono?',
    'C’est ton téléphone ?',
  ],
  [
    'u05-that-bag-is-big',
    'Aquela bolsa é grande.',
    'Quella borsa è grande.',
    'Ce sac-là est grand.',
  ],
  [
    'u05-i-have-a-blue-pen',
    'Eu tenho uma caneta azul.',
    'Ho una penna blu.',
    'J’ai un stylo bleu.',
  ],
  [
    'u05-these-are-not-my-keys',
    'Estas não são as minhas chaves.',
    'Queste non sono le mie chiavi.',
    'Ce ne sont pas mes clés.',
  ],
  [
    'u05-my-computer-is-small',
    'Meu computador é pequeno.',
    'Il mio computer è piccolo.',
    'Mon ordinateur est petit.',
  ],
  [
    'u05-where-is-my-phone',
    'Onde está o meu celular?',
    'Dov’è il mio telefono?',
    'Où est mon téléphone ?',
  ],
  ['u05-her-bag-is-green', 'A bolsa dela é verde.', 'La sua borsa è verde.', 'Son sac est vert.'],
  [
    'u05-those-books-are-red',
    'Aqueles livros são vermelhos.',
    'Quei libri sono rossi.',
    'Ces livres-là sont rouges.',
  ],
  [
    'u05-this-is-an-old-phone',
    'Este é um celular velho.',
    'Questo è un telefono vecchio.',
    'C’est un vieux téléphone.',
  ],
  [
    'u05-where-are-my-keys',
    'Onde estão as minhas chaves?',
    'Dove sono le mie chiavi?',
    'Où sont mes clés ?',
  ],
  [
    'u05-that-is-not-my-pen',
    'Aquela não é a minha caneta.',
    'Quella non è la mia penna.',
    'Ce n’est pas mon stylo.',
  ],
  [
    'u05-he-has-a-black-computer',
    'Ele tem um computador preto.',
    'Lui ha un computer nero.',
    'Il a un ordinateur noir.',
  ],
  // U6
  [
    'u06-my-bed-is-under-the-window',
    'Minha cama fica embaixo da janela.',
    'Il mio letto è sotto la finestra.',
    'Mon lit est sous la fenêtre.',
  ],
  ['u06-is-there-a-garden', 'Tem um jardim?', 'C’è un giardino?', 'Il y a un jardin ?'],
  [
    'u06-there-are-two-bathrooms',
    'Tem dois banheiros.',
    'Ci sono due bagni.',
    'Il y a deux salles de bains.',
  ],
  ['u06-the-sofa-is-green', 'O sofá é verde.', 'Il divano è verde.', 'Le canapé est vert.'],
  [
    'u06-their-apartment-is-big',
    'O apartamento deles é grande.',
    'Il loro appartamento è grande.',
    'Leur appartement est grand.',
  ],
  [
    'u06-the-book-is-on-the-table',
    'O livro está em cima da mesa.',
    'Il libro è sul tavolo.',
    'Le livre est sur la table.',
  ],
  ['u06-where-is-the-kitchen', 'Onde fica a cozinha?', 'Dov’è la cucina?', 'Où est la cuisine ?'],
  ['u06-there-is-no-door', 'Não tem porta.', 'Non c’è una porta.', 'Il n’y a pas de porte.'],
  [
    'u06-my-phone-is-on-the-sofa',
    'Meu celular está no sofá.',
    'Il mio telefono è sul divano.',
    'Mon téléphone est sur le canapé.',
  ],
  [
    'u06-the-living-room-has-two-windows',
    'A sala tem duas janelas.',
    'Il soggiorno ha due finestre.',
    'Le salon a deux fenêtres.',
  ],
  [
    'u06-is-the-bathroom-big',
    'O banheiro é grande?',
    'Il bagno è grande?',
    'La salle de bains est grande ?',
  ],
  [
    'u06-there-are-four-chairs',
    'Tem quatro cadeiras.',
    'Ci sono quattro sedie.',
    'Il y a quatre chaises.',
  ],
  // U7
  ['u07-i-am-hungry', 'Estou com fome.', 'Ho fame.', 'J’ai faim.'],
  ['u07-are-they-thirsty', 'Eles estão com sede?', 'Loro hanno sete?', 'Ils ont soif ?'],
  [
    'u07-i-want-a-coffee-please',
    'Eu quero um café, por favor.',
    'Voglio un caffè, per favore.',
    'Je veux un café, s’il te plaît.',
  ],
  [
    'u07-we-want-three-apples',
    'Nós queremos três maçãs.',
    'Vogliamo tre mele.',
    'Nous voulons trois pommes.',
  ],
  [
    'u07-dinner-is-on-the-table',
    'O jantar está na mesa.',
    'La cena è in tavola.',
    'Le dîner est sur la table.',
  ],
  [
    'u07-the-baby-drinks-milk',
    'O bebê toma leite.',
    'Il bambino beve latte.',
    'Le bébé boit du lait.',
  ],
  ['u07-she-wants-an-apple', 'Ela quer uma maçã.', 'Lei vuole una mela.', 'Elle veut une pomme.'],
  [
    'u07-the-milk-is-in-the-kitchen',
    'O leite está na cozinha.',
    'Il latte è in cucina.',
    'Le lait est dans la cuisine.',
  ],
  [
    'u07-this-cheese-is-good',
    'Este queijo é gostoso.',
    'Questo formaggio è buono.',
    'Ce fromage est bon.',
  ],
  [
    'u07-my-sister-drinks-juice',
    'Minha irmã toma suco.',
    'Mia sorella beve succo.',
    'Ma sœur boit du jus.',
  ],
  // U8
  [
    'u08-i-go-to-work-every-day',
    'Eu vou trabalhar todos os dias.',
    'Vado al lavoro ogni giorno.',
    'Je vais au travail tous les jours.',
  ],
  [
    'u08-she-lives-in-spain',
    'Ela mora na Espanha.',
    'Lei vive in Spagna.',
    'Elle habite en Espagne.',
  ],
  [
    'u08-do-you-work-at-home',
    'Você trabalha em casa?',
    'Lavori a casa?',
    'Tu travailles à la maison ?',
  ],
  [
    'u08-he-never-drinks-coffee',
    'Ele nunca toma café.',
    'Lui non beve mai caffè.',
    'Il ne boit jamais de café.',
  ],
  [
    'u08-they-play-in-the-garden',
    'Eles brincam no jardim.',
    'Loro giocano in giardino.',
    'Ils jouent dans le jardin.',
  ],
  [
    'u08-does-she-read-every-day',
    'Ela lê todos os dias?',
    'Lei legge ogni giorno?',
    'Elle lit tous les jours ?',
  ],
  [
    'u08-i-wake-up-at-seven',
    'Eu acordo às sete.',
    'Mi sveglio alle sette.',
    'Je me réveille à sept heures.',
  ],
  [
    'u08-he-doesnt-live-in-england',
    'Ele não mora na Inglaterra.',
    'Lui non vive in Inghilterra.',
    'Il n’habite pas en Angleterre.',
  ],
  ['u08-where-do-you-live', 'Onde você mora?', 'Dove vivi?', 'Où est-ce que tu habites ?'],
  [
    'u08-i-usually-read-at-home',
    'Eu normalmente leio em casa.',
    'Di solito leggo a casa.',
    'D’habitude, je lis à la maison.',
  ],
  [
    'u08-do-they-go-to-school',
    'Eles vão à escola?',
    'Loro vanno a scuola?',
    'Ils vont à l’école ?',
  ],
  // U9
  ['u09-what-time-is-it', 'Que horas são?', 'Che ore sono?', 'Quelle heure est-il ?'],
  [
    'u09-i-study-in-the-afternoon',
    'Eu estudo à tarde.',
    'Studio il pomeriggio.',
    'J’étudie l’après-midi.',
  ],
  ['u09-see-you-on-friday', 'Até sexta.', 'Ci vediamo venerdì.', 'À vendredi.'],
  ['u09-is-today-tuesday', 'Hoje é terça?', 'Oggi è martedì?', 'C’est mardi aujourd’hui ?'],
  [
    'u09-i-work-on-saturday-morning',
    'Eu trabalho no sábado de manhã.',
    'Lavoro sabato mattina.',
    'Je travaille samedi matin.',
  ],
  [
    'u09-they-dont-watch-tv',
    'Eles não assistem TV.',
    'Loro non guardano la TV.',
    'Ils ne regardent pas la télé.',
  ],
  [
    'u09-its-half-past-seven',
    'São sete e meia.',
    'Sono le sette e mezza.',
    'Il est sept heures et demie.',
  ],
  [
    'u09-what-time-do-you-eat-lunch',
    'Que horas você almoça?',
    'A che ora pranzi?',
    'À quelle heure tu déjeunes ?',
  ],
  [
    'u09-i-read-on-the-weekend',
    'Eu leio no fim de semana.',
    'Leggo nel fine settimana.',
    'Je lis le week-end.',
  ],
  [
    'u09-i-dont-work-tomorrow',
    'Amanhã eu não trabalho.',
    'Domani non lavoro.',
    'Demain, je ne travaille pas.',
  ],
  [
    'u09-she-gets-up-at-six',
    'Ela se levanta às seis.',
    'Lei si alza alle sei.',
    'Elle se lève à six heures.',
  ],
  // U10
  [
    'u10-the-bank-is-on-the-left',
    'O banco fica à esquerda.',
    'La banca è a sinistra.',
    'La banque est à gauche.',
  ],
  [
    'u10-is-the-hospital-far',
    'O hospital fica longe?',
    'L’ospedale è lontano?',
    'L’hôpital est loin ?',
  ],
  [
    'u10-where-is-the-supermarket',
    'Onde fica o supermercado?',
    'Dov’è il supermercato?',
    'Où est le supermarché ?',
  ],
  [
    'u10-turn-left-at-the-bank',
    'Vire à esquerda no banco.',
    'Gira a sinistra alla banca.',
    'Tourne à gauche à la banque.',
  ],
  [
    'u10-the-park-is-near-my-house',
    'O parque fica perto da minha casa.',
    'Il parco è vicino a casa mia.',
    'Le parc est près de chez moi.',
  ],
  [
    'u10-the-bus-station-is-far',
    'A rodoviária fica longe.',
    'La stazione degli autobus è lontana.',
    'La gare routière est loin.',
  ],
  ['u10-go-straight-on', 'Siga em frente.', 'Vai sempre dritto.', 'Va tout droit.'],
  [
    'u10-my-city-has-a-big-park',
    'Minha cidade tem um parque grande.',
    'La mia città ha un grande parco.',
    'Ma ville a un grand parc.',
  ],
  [
    'u10-the-restaurant-is-not-far',
    'O restaurante não fica longe.',
    'Il ristorante non è lontano.',
    'Le restaurant n’est pas loin.',
  ],
  [
    'u10-she-works-at-the-hospital',
    'Ela trabalha no hospital.',
    'Lei lavora all’ospedale.',
    'Elle travaille à l’hôpital.',
  ],
  [
    'u10-i-live-on-this-street',
    'Eu moro nesta rua.',
    'Vivo in questa strada.',
    'J’habite dans cette rue.',
  ],
  [
    'u10-the-shop-is-on-the-right',
    'A loja fica à direita.',
    'Il negozio è a destra.',
    'Le magasin est à droite.',
  ],
  // U11
  [
    'u11-she-likes-music',
    'Ela gosta de música.',
    'A lei piace la musica.',
    'Elle aime la musique.',
  ],
  ['u11-can-you-swim', 'Você sabe nadar?', 'Sai nuotare?', 'Tu sais nager ?'],
  [
    'u11-my-favorite-sport-is-football',
    'Meu esporte favorito é o futebol.',
    'Il mio sport preferito è il calcio.',
    'Mon sport préféré, c’est le foot.',
  ],
  [
    'u11-we-dont-like-this-movie',
    'Nós não gostamos deste filme.',
    'Questo film non ci piace.',
    'Nous n’aimons pas ce film.',
  ],
  [
    'u11-he-sings-very-well',
    'Ele canta muito bem.',
    'Lui canta molto bene.',
    'Il chante très bien.',
  ],
  ['u11-i-hate-mondays', 'Eu odeio segundas-feiras.', 'Odio il lunedì.', 'Je déteste le lundi.'],
  [
    'u11-do-you-like-cooking',
    'Você gosta de cozinhar?',
    'Ti piace cucinare?',
    'Tu aimes cuisiner ?',
  ],
  [
    'u11-my-brother-can-cook',
    'Meu irmão sabe cozinhar.',
    'Mio fratello sa cucinare.',
    'Mon frère sait cuisiner.',
  ],
  [
    'u11-this-game-is-fun',
    'Este jogo é divertido.',
    'Questo gioco è divertente.',
    'Ce jeu est amusant.',
  ],
  [
    'u11-i-like-football-too',
    'Eu também gosto de futebol.',
    'Anche a me piace il calcio.',
    'Moi aussi, j’aime le foot.',
  ],
  [
    'u11-what-is-your-favorite-movie',
    'Qual é o seu filme favorito?',
    'Qual è il tuo film preferito?',
    'Quel est ton film préféré ?',
  ],
  ['u11-she-cant-sing', 'Ela não sabe cantar.', 'Lei non sa cantare.', 'Elle ne sait pas chanter.'],
  // U12
  [
    'u12-can-you-repeat-that-please',
    'Você pode repetir, por favor?',
    'Puoi ripetere, per favore?',
    'Tu peux répéter, s’il te plaît ?',
  ],
  [
    'u12-what-does-this-word-mean',
    'O que significa esta palavra?',
    'Che cosa significa questa parola?',
    'Que veut dire ce mot ?',
  ],
  [
    'u12-why-are-you-tired',
    'Por que você está cansado?',
    'Perché sei stanco?',
    'Pourquoi tu es fatigué ?',
  ],
  ['u12-i-dont-know', 'Eu não sei.', 'Non lo so.', 'Je ne sais pas.'],
  ['u12-do-you-speak-spanish', 'Você fala espanhol?', 'Parli spagnolo?', 'Tu parles espagnol ?'],
  [
    'u12-how-many-brothers-do-you-have',
    'Quantos irmãos você tem?',
    'Quanti fratelli hai?',
    'Tu as combien de frères ?',
  ],
  [
    'u12-when-do-you-work',
    'Quando você trabalha?',
    'Quando lavori?',
    'Quand est-ce que tu travailles ?',
  ],
  [
    'u12-which-book-do-you-want',
    'Qual livro você quer?',
    'Quale libro vuoi?',
    'Quel livre tu veux ?',
  ],
  [
    'u12-how-much-is-the-coffee',
    'Quanto custa o café?',
    'Quanto costa il caffè?',
    'Combien coûte le café ?',
  ],
  ['u12-i-know-the-answer', 'Eu sei a resposta.', 'So la risposta.', 'Je connais la réponse.'],
  [
    'u12-please-speak-slowly',
    'Fale devagar, por favor.',
    'Parla piano, per favore.',
    'Parle lentement, s’il te plaît.',
  ],
  [
    'u12-she-speaks-english-very-well',
    'Ela fala inglês muito bem.',
    'Lei parla inglese molto bene.',
    'Elle parle très bien anglais.',
  ],
  [
    'u12-i-understand-the-question',
    'Eu entendo a pergunta.',
    'Capisco la domanda.',
    'Je comprends la question.',
  ],
];

/** Consigna de cada frase del banco de inglés por idioma de apoyo: id (`en.wr.…`) → idioma → texto. */
export const EN_WORD_RUSH_SUPPORT: ReadonlyMap<
  string,
  Readonly<Record<WordRushSupportLanguage, string>>
> = new Map(
  ROWS.map(([slug, pt, it, frText]) => [`en.wr.${slug}`, { pt, it, fr: fr(frText) }] as const),
);
