// GENERADO por scripts/build-en-src-writing.ts: no editar a mano (docs/EN_MULTI_SOURCE.md).
import type { WritingTaskDef } from '../../../shared/writing';

export const EN_FROM_IT_WRITING_TASKS: readonly WritingTaskDef[] = [
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.how-are-you",
    "kind": "guided",
    "codes": [
      "p08",
      "v01"
    ],
    "lesson": "eit-a1-u01-l05",
    "title": "Saluta e di’ come stai",
    "instructions": "Rispondi a Tom con i tuoi dati (puoi inventarli): saluta, di’ il tuo nome e come stai.",
    "prompts": [
      "Hello! My name is Tom. How are you?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Saluti (Hello, Hi, Good morning…)",
        "kind": "pattern",
        "patterns": [
          [
            "hello|hi"
          ],
          [
            "good",
            "morning|afternoon|evening"
          ]
        ]
      },
      {
        "id": "name",
        "label": "Dici il tuo nome (My name is… / I am…)",
        "kind": "pattern",
        "patterns": [
          [
            "my",
            "name",
            "is",
            "<WORD>"
          ],
          [
            "i",
            "am",
            "<WORD>"
          ],
          [
            "i'm",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "state",
        "label": "Dici come stai (I am fine, I am good…)",
        "kind": "pattern",
        "patterns": [
          [
            "fine|good"
          ],
          [
            "i",
            "am",
            "fine|good|happy|tired"
          ],
          [
            "i'm",
            "fine|good|happy|tired"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 2 frasi",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hello, Tom! My name is Ana. I am fine, thank you.",
    "checklist": [
      "Ho salutato.",
      "Ho detto il mio nome.",
      "Ho detto come sto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.my-age",
    "kind": "guided",
    "codes": [
      "p08",
      "g16",
      "v03"
    ],
    "lesson": "eit-a1-u03-l04",
    "title": "La tua età e il tuo paese",
    "instructions": "Rispondi alle due domande con frasi complete (puoi inventare i dati).",
    "prompts": [
      "How old are you?",
      "Where are you from?"
    ],
    "requirements": [
      {
        "id": "age",
        "label": "Dici la tua età con I am + numero (senza have)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "<NUMBER>"
          ],
          [
            "i'm",
            "<NUMBER>"
          ]
        ]
      },
      {
        "id": "from",
        "label": "Dici di dove sei con I am from…",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "from",
            "<WORD>"
          ],
          [
            "i'm",
            "from",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 2 frasi",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I am twenty years old. I am from Argentina.",
    "checklist": [
      "Ho usato I am per l’età (non I have).",
      "Ho detto il paese con from."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.my-family",
    "kind": "guided",
    "codes": [
      "p03",
      "g09",
      "v04"
    ],
    "lesson": "eit-a1-u04-l05",
    "title": "La tua famiglia",
    "instructions": "Scrivi della tua famiglia (vera o inventata): quanti fratelli o sorelle hai e come si chiama qualcuno della tua famiglia.",
    "prompts": [
      "Do you have a brother?",
      "Do you have a sister?",
      "What is your mother's name?"
    ],
    "requirements": [
      {
        "id": "have",
        "label": "Usi I have per dire quali familiari hai",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "have",
            "<WORD>"
          ],
          [
            "i",
            "don't",
            "have"
          ]
        ]
      },
      {
        "id": "family-word",
        "label": "Nomini un familiare (mother, brother, sister…)",
        "kind": "pattern",
        "patterns": [
          [
            "mother|father|brother|brothers|sister|sisters|grandmother|grandfather|parents|baby"
          ]
        ]
      },
      {
        "id": "possessive",
        "label": "Dici un nome con his, her o my (Her name is…)",
        "kind": "pattern",
        "patterns": [
          [
            "his|her|my|our|their",
            "name",
            "is"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have two sisters. My mother is a teacher. Her name is Rosa.",
    "checklist": [
      "Ho usato bene have o has.",
      "Ho usato his o her secondo la persona."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.my-routine",
    "kind": "guided",
    "codes": [
      "p05",
      "g12",
      "g14"
    ],
    "lesson": "eit-a1-u08-l05",
    "title": "La tua routine",
    "instructions": "Racconta tre cose che fai ogni giorno (anche inventate). Usa always, usually o never almeno una volta.",
    "prompts": [
      "What do you do every day?"
    ],
    "requirements": [
      {
        "id": "routine-verb",
        "label": "Usi un verbo di routine (get up, work, study, read…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "<WORD>"
          ],
          [
            "i",
            "always|usually|never",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "frequency",
        "label": "Usi always, usually o never prima del verbo",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "always|usually|never",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I get up at seven. I always study in the morning. I never read in the evening.",
    "checklist": [
      "Ho messo l’avverbio prima del verbo (I always study).",
      "Ho scritto tre frasi."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.my-likes",
    "kind": "guided",
    "codes": [
      "p06",
      "g18",
      "g22"
    ],
    "lesson": "eit-a1-u11-l05",
    "title": "Quello che ti piace",
    "instructions": "Scrivi che cosa ti piace e che cosa no (puoi inventare). Usa like, love o hate, e unisci due idee con and o but.",
    "prompts": [
      "What do you like?",
      "What is your favorite sport?"
    ],
    "requirements": [
      {
        "id": "like",
        "label": "Usi like, love o hate",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "like|love|hate"
          ],
          [
            "i",
            "don't",
            "like"
          ]
        ]
      },
      {
        "id": "connector",
        "label": "Unisci due idee con and o but",
        "kind": "pattern",
        "patterns": [
          [
            "and|but"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 2 frasi",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I love music and I like football. I can swim, but I can't dance.",
    "checklist": [
      "Ho usato like, love o hate.",
      "Ho usato and o but."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.ask-and-answer",
    "kind": "guided",
    "codes": [
      "p07",
      "p08",
      "g16"
    ],
    "lesson": "eit-a1-u12-l05",
    "title": "Fare domande e rispondere",
    "instructions": "Scrivi due domande per conoscere qualcuno (nome, età, paese…) e rispondi a una con i tuoi dati (puoi inventarli).",
    "prompts": [],
    "requirements": [
      {
        "id": "wh-question",
        "label": "Scrivi una domanda con What, Where, How old…",
        "kind": "pattern",
        "patterns": [
          [
            "what|where|when|who|which|how",
            "<WORD>"
          ],
          [
            "how",
            "old"
          ]
        ]
      },
      {
        "id": "two-questions",
        "label": "Scrivi due domande (con il punto interrogativo)",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "answer",
        "label": "Rispondi con una frase tua (I am…, My name is…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am|have|live|like"
          ],
          [
            "i'm",
            "<WORD>"
          ],
          [
            "my",
            "<WORD>",
            "is"
          ]
        ]
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      }
    ],
    "model": "What is your name? Where are you from? I am from Spain.",
    "checklist": [
      "Le mie domande finiscono con “?”.",
      "Ho messo il verbo prima del soggetto (Where are you…?)."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.block1-introduce",
    "kind": "free",
    "codes": [
      "p02",
      "p03"
    ],
    "block": 1,
    "lesson": "eit-a1-u04-final",
    "title": "Blocco 1: presentati e presenta qualcuno",
    "instructions": "Scrivi 4 o 5 frasi: chi sei (nome, età, paese) e una persona della tua famiglia o un amico. Puoi inventare i dati.",
    "prompts": [
      "What is your name?",
      "How old are you?",
      "Where are you from?",
      "Who is your friend?"
    ],
    "requirements": [
      {
        "id": "hint-name",
        "label": "Suggerimento: hai detto il tuo nome?",
        "kind": "pattern",
        "patterns": [
          [
            "my",
            "name",
            "is"
          ],
          [
            "i",
            "am",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-third",
        "label": "Suggerimento: hai parlato di un’altra persona con he o she?",
        "kind": "pattern",
        "patterns": [
          [
            "he|she",
            "is|has"
          ],
          [
            "his|her",
            "name"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Hai scritto almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hello! My name is Ana. I am twenty years old. I am from Argentina. Tom is my friend. He is from England and he is a student.",
    "checklist": [
      "Ho detto il mio nome, la mia età e di dove sono.",
      "Ho presentato un’altra persona con he o she.",
      "Ho usato bene am, is e are.",
      "Il mio testo si capisce se lo leggo ad alta voce."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.block2-room-and-order",
    "kind": "free",
    "codes": [
      "p04",
      "p10"
    ],
    "block": 2,
    "lesson": "eit-a1-u07-final",
    "title": "Blocco 2: la tua camera e un’ordinazione",
    "instructions": "Scrivi 3 frasi sulla tua camera (che cosa c’è e dove si trova) e poi una breve ordinazione al bar.",
    "prompts": [
      "What is in your bedroom?",
      "Where is your bed?"
    ],
    "requirements": [
      {
        "id": "hint-there",
        "label": "Suggerimento: hai usato there is o there are?",
        "kind": "pattern",
        "patterns": [
          [
            "there",
            "is|are"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-place",
        "label": "Suggerimento: hai detto dove si trova qualcosa (in, on, under, next to)?",
        "kind": "pattern",
        "patterns": [
          [
            "in|on|under",
            "the|my"
          ],
          [
            "next",
            "to"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-order",
        "label": "Suggerimento: hai ordinato con I'd like… please?",
        "kind": "pattern",
        "patterns": [
          [
            "i'd",
            "like"
          ],
          [
            "i",
            "would",
            "like"
          ]
        ],
        "optional": true
      }
    ],
    "model": "There is a big bed in my bedroom. There are two chairs. My computer is on the table. I'd like a coffee and an apple, please.",
    "checklist": [
      "Ho detto che cosa c’è nella camera.",
      "Ho detto dove si trova una cosa.",
      "La mia ordinazione ha please."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.block3-week-and-note",
    "kind": "free",
    "codes": [
      "p05",
      "p09"
    ],
    "block": 3,
    "lesson": "eit-a1-u09-final",
    "title": "Blocco 3: la tua settimana e un biglietto",
    "instructions": "Racconta in 3 frasi che cosa fai durante la settimana (giorni e ore) e scrivi un breve biglietto tipo “Back at five”.",
    "prompts": [
      "What do you do on Monday?",
      "What time do you get up?"
    ],
    "glossary": [
      {
        "term": "Back at five.",
        "meaning": "Torno alle cinque."
      }
    ],
    "requirements": [
      {
        "id": "hint-day",
        "label": "Suggerimento: hai usato on con un giorno (on Monday)?",
        "kind": "pattern",
        "patterns": [
          [
            "on",
            "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-time",
        "label": "Suggerimento: hai usato at con un’ora (at seven)?",
        "kind": "pattern",
        "patterns": [
          [
            "at",
            "<NUMBER>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-note",
        "label": "Suggerimento: il tuo biglietto dice quando torni (back at…)?",
        "kind": "pattern",
        "patterns": [
          [
            "back",
            "at"
          ]
        ],
        "optional": true
      }
    ],
    "model": "I work from Monday to Friday. I get up at seven. On Saturday I play football. I am at school. Back at five.",
    "checklist": [
      "Ho usato on con i giorni e at con l’ora.",
      "Il mio biglietto dice dove sono e quando torno."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "eit.a1.wt.block4-post-and-postcard",
    "kind": "free",
    "codes": [
      "p06",
      "p07",
      "p09"
    ],
    "block": 4,
    "lesson": "eit-a1-u12-final",
    "title": "Blocco 4: un post e una cartolina",
    "instructions": "Scrivi un post breve sui tuoi gusti con una domanda per i tuoi amici, e una cartolina corta da una città.",
    "prompts": [
      "What do you like?",
      "What can you do?"
    ],
    "requirements": [
      {
        "id": "hint-like",
        "label": "Suggerimento: hai detto che cosa ti piace (I like, I love)?",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "like|love"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-question",
        "label": "Suggerimento: hai fatto una domanda ai tuoi amici?",
        "kind": "pattern",
        "patterns": [
          [
            "do",
            "you"
          ],
          [
            "what|which|who",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-postcard",
        "label": "Suggerimento: la tua cartolina si congeda (See you…, Love,…)?",
        "kind": "pattern",
        "patterns": [
          [
            "see",
            "you"
          ],
          [
            "love"
          ]
        ],
        "optional": true
      }
    ],
    "model": "I love music and I can sing. I like football, but I can't swim. What do you like? Hi Ana! I am in London. The city is very big. See you on Sunday!",
    "checklist": [
      "Ho raccontato che cosa mi piace e che cosa so fare.",
      "Ho fatto una domanda con “?”.",
      "La mia cartolina saluta e si congeda."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.a-party",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u01-l05",
    "title": "Una festa",
    "instructions": "Racconta a un amico com’è andata una festa o un compleanno (vero o inventato): dove, quando e come ti sentivi.",
    "prompts": [
      "Where was the party?",
      "When was it?",
      "How were you?"
    ],
    "requirements": [
      {
        "id": "was-were",
        "label": "Usi was o were",
        "kind": "pattern",
        "patterns": [
          [
            "was|were"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Dici quando è stato (yesterday, last week, last night, on Saturday…)",
        "kind": "pattern",
        "patterns": [
          [
            "yesterday"
          ],
          [
            "last",
            "night|week|year|weekend|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ],
          [
            "on",
            "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ],
          [
            "<WORD>",
            "ago"
          ]
        ]
      },
      {
        "id": "feeling",
        "label": "Dici come ti sentivi (happy, tired, excited, bored…)",
        "kind": "pattern",
        "patterns": [
          [
            "happy|tired|excited|bored|sad|nervous|angry|busy"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "The party was at my friend’s house last Saturday. I was very happy and excited. The music was great!",
    "checklist": [
      "Ho usato was e were.",
      "Ho detto quando è stato.",
      "Ho detto come mi sentivo."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.my-weekend",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u03-l05",
    "title": "Il tuo fine settimana",
    "instructions": "Racconta cosa hai fatto lo scorso fine settimana (puoi inventarlo). Usa verbi al passato e di’ quando.",
    "prompts": [
      "What did you do last weekend?",
      "Where did you go?",
      "Who did you see?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Usi almeno un verbo al passato (went, had, saw, bought…)",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Dici quando (last weekend, on Saturday, yesterday…)",
        "kind": "pattern",
        "patterns": [
          [
            "last",
            "weekend|week|night"
          ],
          [
            "on",
            "saturday|sunday|friday"
          ],
          [
            "yesterday"
          ]
        ]
      },
      {
        "id": "then",
        "label": "Metti in ordine quello che hai fatto con then o after (facoltativo)",
        "kind": "pattern",
        "patterns": [
          [
            "then"
          ],
          [
            "after"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last weekend I went to the park with my family. We ate chicken and then we walked in the city. On Sunday I slept a lot!",
    "checklist": [
      "Ho usato verbi al passato.",
      "Ho detto quando è successo.",
      "Ho messo in ordine quello che ho fatto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.holiday-message",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u04-l05",
    "title": "Un messaggio dalle vacanze",
    "instructions": "Scrivi a un amico da un viaggio (vero o inventato): dove sei, come ci sei arrivato e cosa hai fatto.",
    "prompts": [
      "Where are you?",
      "How did you travel?",
      "What did you see?"
    ],
    "requirements": [
      {
        "id": "place",
        "label": "Dici dove sei (I am in… / I’m at the beach…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "in|at"
          ],
          [
            "i'm",
            "in|at"
          ]
        ]
      },
      {
        "id": "transport",
        "label": "Dici come hai viaggiato con by (by plane, by train, by car…)",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "plane|train|car|bus|bike"
          ]
        ]
      },
      {
        "id": "past",
        "label": "Racconti qualcosa che hai fatto, al passato",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I am in Mexico on vacation. I came by plane. Yesterday I went to the beach and I took a lot of photos. See you!",
    "checklist": [
      "Ho detto dove sono.",
      "Ho detto come ho viaggiato (by…).",
      "Ho raccontato qualcosa che ho fatto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.my-plans",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u08-l05",
    "title": "I tuoi progetti",
    "instructions": "Racconta i tuoi progetti per la settimana prossima (puoi inventarli) e una cosa che secondo te succederà.",
    "prompts": [
      "What are you going to do next week?",
      "Do you think it will be a good week?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Racconti un progetto con going to",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "will",
        "label": "Fai una previsione con will o won’t",
        "kind": "pattern",
        "patterns": [
          [
            "will|won't|i'll|it'll|we'll|you'll|he'll|she'll|they'll"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Dici quando (next week, tomorrow, tonight, soon…)",
        "kind": "pattern",
        "patterns": [
          [
            "next",
            "week|month|year|weekend"
          ],
          [
            "tomorrow"
          ],
          [
            "tonight"
          ],
          [
            "soon"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Next week I am going to visit my grandmother. We are going to cook dinner. I think it will be a great week.",
    "checklist": [
      "Ho raccontato un progetto con going to.",
      "Ho fatto una previsione con will.",
      "Ho detto quando."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.advice",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u09-l05",
    "title": "Un consiglio per un amico",
    "instructions": "Un amico ti scrive che non si sente bene. Rispondigli: chiedigli che cosa gli fa male e dagli consigli con should e shouldn’t.",
    "prompts": [
      "I'm sick. I have a headache and a fever."
    ],
    "requirements": [
      {
        "id": "should",
        "label": "Dai un consiglio con should",
        "kind": "pattern",
        "patterns": [
          [
            "should",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "shouldnt",
        "label": "Dici una cosa che non dovrebbe fare con shouldn’t",
        "kind": "pattern",
        "patterns": [
          [
            "shouldn't",
            "<WORD>"
          ],
          [
            "should",
            "not",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "body",
        "label": "Nomini il corpo o la salute (head, headache, fever, doctor, medicine…)",
        "kind": "pattern",
        "patterns": [
          [
            "head|headache|fever|doctor|medicine|stomach|back|sick|rest"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry. You should go to the doctor. You should rest and drink a lot of water. You shouldn't go to work tomorrow.",
    "checklist": [
      "Ho dato un consiglio con should.",
      "Ho usato shouldn’t.",
      "Ho parlato della salute."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.experiences",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u12-l05",
    "title": "Le tue esperienze",
    "instructions": "Racconta due cose che hai fatto almeno una volta e una che non hai mai fatto (puoi inventarle).",
    "prompts": [
      "Have you ever been abroad?",
      "Have you ever been to a famous city?"
    ],
    "requirements": [
      {
        "id": "have-done",
        "label": "Usi have + participio (I have been, I’ve seen…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "have",
            "been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made"
          ],
          [
            "i've",
            "been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made"
          ]
        ]
      },
      {
        "id": "never",
        "label": "Dici una cosa che non hai mai fatto (I have never… / I haven’t…)",
        "kind": "pattern",
        "patterns": [
          [
            "never"
          ],
          [
            "haven't"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to Spain twice. I have eaten a lot of amazing food there. I have never seen snow!",
    "checklist": [
      "Ho raccontato esperienze con have + participio.",
      "Ho detto una cosa che non ho mai fatto.",
      "Ho usato ever, never o twice."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.restaurant",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u13-l05",
    "title": "Una cena fuori",
    "instructions": "Racconta un pasto al ristorante (vero o inventato): che cosa hai ordinato, com’era e come hai pagato.",
    "prompts": [
      "What did you order?",
      "Was it good?",
      "How did you pay?"
    ],
    "requirements": [
      {
        "id": "food",
        "label": "Dici che cosa hai mangiato (soup, salad, fish, meat, dessert…)",
        "kind": "pattern",
        "patterns": [
          [
            "soup|salad|fish|meat|vegetables|dessert|chicken|rice|bread|cheese|eggs"
          ]
        ]
      },
      {
        "id": "opinion",
        "label": "Dici com’era (delicious, spicy, good…)",
        "kind": "pattern",
        "patterns": [
          [
            "delicious|spicy|good|great|amazing|bad|cold|hot"
          ]
        ]
      },
      {
        "id": "pay",
        "label": "Racconti come hai pagato o che hai chiesto il conto",
        "kind": "pattern",
        "patterns": [
          [
            "paid|pay|bill|card|cash"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last night I went to a restaurant with my sister. I ordered fish and a salad, and the dessert was delicious. We paid by card.",
    "checklist": [
      "Ho detto che cosa ho mangiato.",
      "Ho dato la mia opinione.",
      "Ho raccontato come abbiamo pagato."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.reply-invitation",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u14-l05",
    "title": "Rispondere a un invito",
    "instructions": "Mia ti invita al suo compleanno. Rispondile: ringrazia e accetta, oppure rifiuta con un motivo e proponi un altro programma.",
    "prompts": [
      "Hi! Would you like to come to my birthday party on Saturday? Mia"
    ],
    "requirements": [
      {
        "id": "thanks",
        "label": "Ringrazi (Thank you / Thanks)",
        "kind": "pattern",
        "patterns": [
          [
            "thank",
            "you"
          ],
          [
            "thanks"
          ]
        ]
      },
      {
        "id": "answer",
        "label": "Accetti (I’d love to) o rifiuti (Sorry, I can’t)",
        "kind": "pattern",
        "patterns": [
          [
            "i'd",
            "love",
            "to"
          ],
          [
            "i",
            "would",
            "love",
            "to"
          ],
          [
            "can't"
          ],
          [
            "cannot"
          ]
        ]
      },
      {
        "id": "plan",
        "label": "Proponi qualcosa con Let's… o How about…? (facoltativo)",
        "kind": "pattern",
        "patterns": [
          [
            "let's"
          ],
          [
            "how",
            "about"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 2 frasi",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Mia! Thank you for the invitation. Sorry, I can't go on Saturday because I have to work. How about dinner on Sunday?",
    "glossary": [
      {
        "term": "invitation",
        "meaning": "invito"
      }
    ],
    "checklist": [
      "Ho ringraziato.",
      "Ho accettato o rifiutato con un motivo.",
      "Ho proposto un altro programma."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.describe-someone",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u15-l05",
    "title": "Descrivi qualcuno",
    "instructions": "Descrivi una persona che conosci (o inventala): che aspetto ha e com’è di carattere.",
    "prompts": [
      "What does he or she look like?",
      "What is he or she like?"
    ],
    "requirements": [
      {
        "id": "looks",
        "label": "Descrivi l’aspetto (tall, short, thin… / has … hair, a beard, glasses)",
        "kind": "pattern",
        "patterns": [
          [
            "tall|short|thin|young|old"
          ],
          [
            "has|have",
            "<WORD>",
            "hair"
          ],
          [
            "has|have",
            "<WORD>",
            "<WORD>",
            "hair"
          ],
          [
            "beard|glasses"
          ]
        ]
      },
      {
        "id": "personality",
        "label": "Descrivi il carattere (friendly, kind, funny, shy, quiet…)",
        "kind": "pattern",
        "patterns": [
          [
            "friendly|kind|funny|shy|quiet|nice|interesting"
          ]
        ]
      },
      {
        "id": "linker",
        "label": "Colleghi le idee con and, but o because (facoltativo)",
        "kind": "pattern",
        "patterns": [
          [
            "but"
          ],
          [
            "because"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "My best friend is Ana. She is tall and she has long dark hair. She is very funny, but she is a little shy at first.",
    "glossary": [
      {
        "term": "a little",
        "meaning": "un po’"
      }
    ],
    "checklist": [
      "Ho descritto l’aspetto.",
      "Ho descritto il carattere.",
      "Ho usato and, but o because."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.booking-email",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-a2-u16-l05",
    "title": "Un’email per prenotare",
    "instructions": "Scrivi al Green Hotel per prenotare una camera: saluta, di’ che cosa vuoi e per quando, fai una domanda e congedati.",
    "prompts": [],
    "requirements": [
      {
        "id": "opening",
        "label": "Cominci con Dear… o Hello",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ],
          [
            "hello"
          ],
          [
            "hi"
          ]
        ]
      },
      {
        "id": "book",
        "label": "Chiedi la camera (I’d like to book…)",
        "kind": "pattern",
        "patterns": [
          [
            "book",
            "a|the",
            "<WORD>"
          ],
          [
            "book",
            "a|the",
            "room"
          ],
          [
            "room"
          ]
        ]
      },
      {
        "id": "could-you",
        "label": "Fai una richiesta con Could you…?",
        "kind": "pattern",
        "patterns": [
          [
            "could",
            "you"
          ]
        ]
      },
      {
        "id": "closing",
        "label": "Finisci con Best wishes o Thank you",
        "kind": "pattern",
        "patterns": [
          [
            "best",
            "wishes"
          ],
          [
            "thank",
            "you"
          ],
          [
            "thanks"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      }
    ],
    "model": "Dear Green Hotel, I'd like to book a double room for two nights in July. Could you send me the price, please? Best wishes, Ana",
    "checklist": [
      "Ho salutato all’inizio e alla fine.",
      "Ho detto quale camera voglio e quando.",
      "Ho chiesto qualcosa con Could you…?"
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.block1-trip",
    "kind": "free",
    "codes": [],
    "lesson": "eit-a2-u06-final",
    "block": 1,
    "title": "Un viaggio e un po’ di shopping",
    "instructions": "Scrivi un messaggio a un amico su un viaggio (vero o inventato): dove sei andato, come hai viaggiato, cosa hai fatto e cosa hai comprato.",
    "prompts": [
      "Where did you go?",
      "What did you do?",
      "What did you buy?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Hai usato verbi al passato?",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ],
        "optional": true
      },
      {
        "id": "by",
        "label": "Hai detto come hai viaggiato (by…)?",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "bought",
        "label": "Hai raccontato cosa hai comprato?",
        "kind": "pattern",
        "patterns": [
          [
            "bought|buy"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 4 frasi?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Tom! Last month I went to Spain by plane. I visited a lot of museums and beaches. I bought a new jacket and new shoes. It was a great trip!",
    "checklist": [
      "Ho raccontato dove sono andato e come ho viaggiato.",
      "Ho usato verbi al passato.",
      "Ho raccontato cosa ho comprato."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.block2-news",
    "kind": "free",
    "codes": [],
    "lesson": "eit-a2-u12-final",
    "block": 2,
    "title": "Un’email con le novità",
    "instructions": "Scrivi un’email a un amico con le tue novità: che cosa stai facendo adesso, che cosa farai presto e una cosa che hai già fatto.",
    "prompts": [
      "What are you doing these days?",
      "What are you going to do?",
      "Have you done anything new?"
    ],
    "requirements": [
      {
        "id": "now",
        "label": "Hai raccontato che cosa stai facendo adesso (am/is/are + -ing)?",
        "kind": "pattern",
        "patterns": [
          [
            "am|is|are",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "future",
        "label": "Hai raccontato un progetto (going to / will)?",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ],
          [
            "will"
          ],
          [
            "i'll"
          ]
        ],
        "optional": true
      },
      {
        "id": "perfect",
        "label": "Hai usato have + participio?",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|seen|done|eaten|visited|already|just|never"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 4 frasi?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Ana! I am working in a new office now and I have a lot of meetings. Next month I am going to move to a new apartment. I have just started a new job! See you soon.",
    "checklist": [
      "Ho raccontato che cosa sto facendo adesso.",
      "Ho raccontato un progetto.",
      "Ho raccontato una cosa che ho già fatto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "eit.a2.wt.block3-story",
    "kind": "free",
    "codes": [],
    "lesson": "eit-a2-u17-final",
    "block": 3,
    "title": "Racconta una storia",
    "instructions": "Racconta una breve storia (vera o inventata): dove eri e che cosa stavi facendo, che cosa è successo all’improvviso e come è finita.",
    "prompts": [
      "Where were you?",
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "continuous",
        "label": "Hai usato was/were + -ing?",
        "kind": "pattern",
        "patterns": [
          [
            "was|were",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "suddenly",
        "label": "Hai usato suddenly, when o while?",
        "kind": "pattern",
        "patterns": [
          [
            "suddenly"
          ],
          [
            "when"
          ],
          [
            "while"
          ]
        ],
        "optional": true
      },
      {
        "id": "end",
        "label": "Le hai dato una fine (in the end, the next day…)?",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "the",
            "end"
          ],
          [
            "the",
            "next",
            "day"
          ],
          [
            "luckily"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 5 frasi?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Last winter I was walking in the park with my friend. It was very cold. Suddenly, it began to snow. At first we were scared, but then we laughed and played in the snow. In the end, it was a great day!",
    "checklist": [
      "Ho raccontato dov’ero e che cosa stavo facendo.",
      "Ho raccontato che cosa è successo all’improvviso.",
      "La storia ha una fine."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.unforgettable",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u01-l05",
    "title": "Un’esperienza indimenticabile",
    "instructions": "Racconta un’esperienza importante della tua vita (vera o inventata): presentala con il present perfect e racconta i dettagli al past simple, dicendo quando è successo e come ti sei sentito.",
    "prompts": [
      "What is your best memory?",
      "When was it?",
      "How did you feel?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "Usi il present perfect (I have been, I have climbed…)",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "have|has",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Dici quando è successo (two years ago, last summer, in 2019…)",
        "kind": "pattern",
        "patterns": [
          [
            "<WORD>",
            "ago"
          ],
          [
            "last",
            "<WORD>"
          ],
          [
            "in",
            "<NUMBER>"
          ],
          [
            "yesterday"
          ]
        ]
      },
      {
        "id": "feeling",
        "label": "Dici come ti sei sentito (proud, happy, excited, nervous…)",
        "kind": "pattern",
        "patterns": [
          [
            "proud|happy|excited|nervous|scared|amazing|unforgettable"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to many countries, but my best memory is my first trip to Spain. I went there two years ago with my sister. It was the first time I climbed a mountain. When we got to the top, I felt very proud. It was an unforgettable adventure!",
    "checklist": [
      "Ho presentato l’esperienza con il present perfect.",
      "Ho raccontato i dettagli al past simple e ho detto quando è successo.",
      "Ho detto come mi sono sentito."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.new-hobby",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u02-l05",
    "title": "Il tuo passatempo",
    "instructions": "Scrivi a un amico di un passatempo che hai iniziato: da quanto tempo lo fai, che cosa stai facendo ultimamente e che cosa ti piace di più.",
    "prompts": [
      "What is your hobby?",
      "How long have you been doing it?",
      "What do you enjoy about it?"
    ],
    "requirements": [
      {
        "id": "since-for",
        "label": "Dici da quanto tempo con for o since",
        "kind": "pattern",
        "patterns": [
          [
            "for|since"
          ]
        ]
      },
      {
        "id": "continuous",
        "label": "Usi have been + -ing (I have been learning…)",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been",
            "<WORD>"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "enjoy",
        "label": "Dici che cosa ti piace fare (I enjoy / I love + -ing)",
        "kind": "pattern",
        "patterns": [
          [
            "enjoy|love|like",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I have been learning to play the guitar since January. I practice for one hour every day. I really enjoy playing with my friends, and my skills have improved a lot.",
    "checklist": [
      "Ho detto da quanto tempo faccio il passatempo (for / since).",
      "Ho usato have been + -ing.",
      "Ho raccontato che cosa mi piace."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.anecdote",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u03-l05",
    "title": "Un aneddoto",
    "instructions": "Racconta un aneddoto (vero o inventato): che cosa stavi facendo, che cosa è successo, che cosa era già successo prima e come è finita.",
    "prompts": [
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "scene",
        "label": "Costruisci la scena con was/were + -ing",
        "kind": "pattern",
        "patterns": [
          [
            "was|were",
            "walking|waiting|having|reading|working|driving|sleeping|eating|cooking|watching|talking|going|sitting|studying|traveling|travelling|running|playing"
          ]
        ]
      },
      {
        "id": "past-perfect",
        "label": "Usi had + participio (had left, had forgotten…)",
        "kind": "pattern",
        "patterns": [
          [
            "had",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "had",
            "already",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ]
      },
      {
        "id": "sequence",
        "label": "Metti in ordine i fatti (when, by the time, as soon as, afterwards, eventually…)",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "the",
            "time"
          ],
          [
            "as",
            "soon",
            "as"
          ],
          [
            "afterwards|eventually|then"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last week I was waiting for the bus when I realized that I had forgotten my phone at home. I went back to get it. By the time I arrived at the bus stop again, the bus had left. Eventually, I walked to work. I was late, but my boss laughed!",
    "checklist": [
      "Ho costruito la scena con was/were + -ing.",
      "Ho usato had + participio per qualcosa che era già successo.",
      "Ho messo in ordine i fatti e ho raccontato il finale."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.my-goals",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u04-l05",
    "title": "I tuoi obiettivi",
    "instructions": "Scrivi i tuoi obiettivi per l’anno prossimo: che cosa farai, che cosa potrebbe succedere e che cosa farai quando avrai finito qualcosa.",
    "prompts": [
      "What is your goal?",
      "What are you going to do?",
      "What might change?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Racconti un’intenzione con going to",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ]
        ]
      },
      {
        "id": "might",
        "label": "Racconti qualcosa di possibile con might",
        "kind": "pattern",
        "patterns": [
          [
            "might"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Usi when / as soon as + presente e will",
        "kind": "pattern",
        "patterns": [
          [
            "when|until",
            "<WORD>",
            "<WORD>"
          ],
          [
            "as",
            "soon",
            "as"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "My goal for next year is to speak better English. I am going to take an English course, and I might apply for a job abroad. When I finish the course, I will look for a new job.",
    "checklist": [
      "Ho raccontato un’intenzione con going to.",
      "Ho usato might per qualcosa di possibile.",
      "Ho usato when + presente."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.job-application",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u05-l05",
    "title": "Candidarsi per un lavoro",
    "instructions": "Scrivi un’email formale per candidarti per un lavoro (vero o inventato): saluta, di’ per quale lavoro ti candidi, racconta la tua esperienza e congedati.",
    "prompts": [
      "Which job do you want?",
      "What experience do you have?",
      "What were you responsible for?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Cominci con un saluto formale (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "apply",
        "label": "Dici per che cosa ti candidi (I would like to apply for…)",
        "kind": "pattern",
        "patterns": [
          [
            "apply",
            "for"
          ]
        ]
      },
      {
        "id": "experience",
        "label": "Racconti la tua esperienza (I worked… / I was responsible for…)",
        "kind": "pattern",
        "patterns": [
          [
            "responsible",
            "for"
          ],
          [
            "worked"
          ],
          [
            "experience"
          ]
        ]
      },
      {
        "id": "closing",
        "label": "Ti congedi in modo formale (I look forward to hearing from you / Best wishes)",
        "kind": "pattern",
        "patterns": [
          [
            "look",
            "forward"
          ],
          [
            "best",
            "wishes"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I would like to apply for the part-time job at your hotel. I worked in a shop for three years, and I was responsible for the money. I speak English and Spanish. I look forward to hearing from you. Best wishes, Ana.",
    "checklist": [
      "Ho salutato e mi sono congedato in modo formale.",
      "Ho detto per quale lavoro mi candido.",
      "Ho raccontato la mia esperienza e le mie mansioni."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.visitor-tips",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u06-l05",
    "title": "Consigli per un visitatore",
    "instructions": "Scrivi a qualcuno che verrà a visitare la tua città o il tuo paese: dagli consigli con if e raccontagli un’usanza (che cosa è educato o maleducato).",
    "prompts": [
      "What should a tourist do?",
      "What is polite in your country?",
      "What is rude?"
    ],
    "requirements": [
      {
        "id": "if-will",
        "label": "Usi il periodo ipotetico di primo tipo (If you…, you will…)",
        "kind": "pattern",
        "patterns": [
          [
            "if",
            "<WORD>"
          ],
          [
            "unless"
          ]
        ]
      },
      {
        "id": "will",
        "label": "Usi will per il risultato",
        "kind": "pattern",
        "patterns": [
          [
            "will"
          ],
          [
            "you'll"
          ],
          [
            "it'll"
          ]
        ]
      },
      {
        "id": "custom",
        "label": "Spieghi un’usanza (polite, rude, tradition)",
        "kind": "pattern",
        "patterns": [
          [
            "polite|rude|tradition"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "If you visit my city, you will love the food. Exchange some money before you come, because many small shops only take cash. It is polite to say hello when you go into a shop. If you go to a restaurant, leave a tip.",
    "checklist": [
      "Ho dato consigli con if.",
      "Ho spiegato un’usanza.",
      "Ho usato will per il risultato."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.health-advice",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u07-l05",
    "title": "Consigli a un amico stressato",
    "instructions": "Un amico ti racconta che è molto stressato. Rispondigli con almeno due consigli (should, ought to, had better) e un paragone.",
    "prompts": [
      "What should your friend do?",
      "What is better for him?"
    ],
    "requirements": [
      {
        "id": "advice",
        "label": "Dai un consiglio con should o ought to",
        "kind": "pattern",
        "patterns": [
          [
            "should"
          ],
          [
            "ought",
            "to"
          ]
        ]
      },
      {
        "id": "better",
        "label": "Avverti con had better (You'd better…)",
        "kind": "pattern",
        "patterns": [
          [
            "you'd",
            "better"
          ],
          [
            "had",
            "better"
          ]
        ]
      },
      {
        "id": "compare",
        "label": "Fai un paragone (as … as, much better, the more…, the better…)",
        "kind": "pattern",
        "patterns": [
          [
            "as",
            "<WORD>",
            "as"
          ],
          [
            "much|a",
            "better|healthier|easier|worse"
          ],
          [
            "the",
            "more"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry you are so stressed. You ought to take a few days off. You should sleep more: the more you sleep, the better you feel. You'd better not work at night.",
    "checklist": [
      "Ho dato consigli con should o ought to.",
      "Ho avvertito con had better.",
      "Ho fatto un paragone."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.recommend-app",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u08-l05",
    "title": "Consigliare un’app",
    "instructions": "Consiglia un’app o un dispositivo che usi: che cosa fa (which / that), come lo usi e per chi è (people who…).",
    "prompts": [
      "What does the app do?",
      "How do you use it?",
      "Who is it good for?"
    ],
    "requirements": [
      {
        "id": "which",
        "label": "Spieghi che cosa fa con which o that (an app which helps you…)",
        "kind": "pattern",
        "patterns": [
          [
            "app|device|phone|computer|thing",
            "which|that"
          ]
        ]
      },
      {
        "id": "who",
        "label": "Dici per chi è con who (people who…)",
        "kind": "pattern",
        "patterns": [
          [
            "people|person|students|friends",
            "who"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "I recommend an app which helps you learn new words. You can download it for free, and it works online. I use it every day on the bus. It is great for people who don't have much time.",
    "checklist": [
      "Ho spiegato che cosa fa con which o that.",
      "Ho detto per chi è con who.",
      "Ho raccontato come la uso."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.my-community",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u09-l05",
    "title": "Il tuo quartiere e l’ambiente",
    "instructions": "Racconta che cosa si fa nel tuo quartiere o nella tua città per l’ambiente (con la forma passiva) e proponi un’idea per migliorare.",
    "prompts": [
      "What is recycled in your city?",
      "What was done last year?",
      "What should we do?"
    ],
    "requirements": [
      {
        "id": "passive",
        "label": "Usi la forma passiva (is recycled, was built…)",
        "kind": "pattern",
        "patterns": [
          [
            "is|are|was|were",
            "recycled|collected|built|made|produced|cleaned|planted|used|protected|reduced|done|rescued"
          ]
        ]
      },
      {
        "id": "proposal",
        "label": "Proponi qualcosa (we should…, we have to…, if we…)",
        "kind": "pattern",
        "patterns": [
          [
            "should"
          ],
          [
            "have",
            "to"
          ],
          [
            "if",
            "we"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my neighborhood, paper and plastic are recycled every week. Last year a small park was built near my house, and a lot of trees were planted by volunteers. I think we should use public transport more, because cars produce a lot of pollution.",
    "checklist": [
      "Ho usato la forma passiva.",
      "Ho raccontato qualcosa che è stato fatto.",
      "Ho proposto un’idea."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.what-they-said",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u10-l05",
    "title": "Quello che ti hanno detto",
    "instructions": "Racconta una conversazione recente in discorso indiretto: che cosa ti ha detto qualcuno (said / told me) e che cosa ti ha chiesto (asked if…).",
    "prompts": [
      "Who called you?",
      "What did they say?",
      "What did they ask?"
    ],
    "requirements": [
      {
        "id": "said",
        "label": "Usi said (that) o told me (that)",
        "kind": "pattern",
        "patterns": [
          [
            "said"
          ],
          [
            "told",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "asked",
        "label": "Riferisci una domanda con asked if / asked where…",
        "kind": "pattern",
        "patterns": [
          [
            "asked",
            "if|where|what|when|why|how"
          ],
          [
            "asked",
            "me|us|him|her",
            "if|where|what|when|why|how"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 3 frasi",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Yesterday my friend Tom called me. He told me that he had a new job. He said that the company was very big. He asked if I wanted to have dinner with him on Friday.",
    "checklist": [
      "Ho riferito ciò che ha detto con said o told.",
      "Ho portato i verbi al passato.",
      "Ho riferito una domanda con asked if."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.my-opinion",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u11-l05",
    "title": "La tua opinione",
    "instructions": "Scegli un tema (vivere in una città grande o piccola, lavorare da casa, i social…) e scrivi la tua opinione con un vantaggio, uno svantaggio e che cosa faresti tu.",
    "prompts": [
      "What do you think?",
      "What is one advantage?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "opinion",
        "label": "Dai la tua opinione (In my opinion… / I think…)",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "my",
            "opinion"
          ],
          [
            "i",
            "think"
          ]
        ]
      },
      {
        "id": "contrast",
        "label": "Mostri i due lati (advantage, disadvantage, on the other hand)",
        "kind": "pattern",
        "patterns": [
          [
            "advantage|disadvantage"
          ],
          [
            "on",
            "the",
            "other",
            "hand"
          ]
        ]
      },
      {
        "id": "would",
        "label": "Usi il secondo condizionale (If I…, I would…)",
        "kind": "pattern",
        "patterns": [
          [
            "would"
          ],
          [
            "i'd"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my opinion, it is better to live in a small city. One advantage is that it is quiet. On the other hand, there are fewer jobs. If it were my decision, I would live in a small city near the sea.",
    "checklist": [
      "Ho dato la mia opinione.",
      "Ho mostrato un vantaggio e uno svantaggio.",
      "Ho usato would."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.complaint",
    "kind": "guided",
    "codes": [],
    "lesson": "eit-b1-u12-l03",
    "title": "Un reclamo formale",
    "instructions": "Scrivi un’email per fare un reclamo su qualcosa che hai comprato e che non funziona: che cosa hai comprato, che problema ha e che cosa chiedi (un rimborso o un cambio).",
    "prompts": [
      "What did you buy?",
      "What is the problem?",
      "What would you like?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Cominci con un saluto formale (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "problem",
        "label": "Spieghi il problema (stopped working, broke, broken…)",
        "kind": "pattern",
        "patterns": [
          [
            "stopped|broke|broken|problem|doesn't|didn't"
          ]
        ]
      },
      {
        "id": "request",
        "label": "Chiedi qualcosa con gentilezza (I would like a refund / Could you replace it?)",
        "kind": "pattern",
        "patterns": [
          [
            "would",
            "like"
          ],
          [
            "i'd",
            "like"
          ],
          [
            "could",
            "you"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Scrivi almeno 4 frasi",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Ogni frase inizia con la maiuscola",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Finisci con un punto, un punto esclamativo o un punto interrogativo",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I bought a phone charger from your shop last week. It was expensive, but it stopped working after two days. I would like a refund, or could you replace it, please? I have the receipt. Best wishes, Kate Brown.",
    "checklist": [
      "Ho salutato in modo formale.",
      "Ho spiegato il problema.",
      "Ho chiesto un rimborso o un cambio con gentilezza."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.block1-life",
    "kind": "free",
    "codes": [],
    "lesson": "eit-b1-u04-final",
    "block": 1,
    "title": "La tua vita finora e i tuoi piani",
    "instructions": "Scrivi un testo su di te: qualcosa che hai fatto nella vita, qualcosa che stai facendo ultimamente, un breve aneddoto e i tuoi piani per il futuro.",
    "prompts": [
      "What have you done in your life?",
      "What have you been doing lately?",
      "What are your plans?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "Hai usato il present perfect?",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "have|has",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ],
        "optional": true
      },
      {
        "id": "continuous",
        "label": "Hai raccontato qualcosa che stai facendo ultimamente (have been + -ing)?",
        "kind": "pattern",
        "patterns": [
          [
            "been",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "future",
        "label": "Hai raccontato i tuoi piani (going to, will, might)?",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ],
          [
            "will"
          ],
          [
            "might"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 5 frasi?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "I have lived in the same city all my life, but I have traveled to five countries. Lately I have been studying English every day. Last summer I missed my flight because I had forgotten my passport! Next year I am going to take an English course. I might move abroad someday.",
    "checklist": [
      "Ho raccontato esperienze con il present perfect.",
      "Ho raccontato qualcosa che sto facendo ultimamente.",
      "Ho inserito un aneddoto e i miei piani."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.block2-visit",
    "kind": "free",
    "codes": [],
    "lesson": "eit-b1-u08-final",
    "block": 2,
    "title": "Un’email a qualcuno che viene a trovarti",
    "instructions": "Un amico di un altro paese viene a trovarti. Scrivigli un’email: che cosa deve fare o non è necessario che faccia, consigli di viaggio e di salute, e come resterete in contatto.",
    "prompts": [
      "What does your friend have to do?",
      "What should he bring?",
      "How will you keep in touch?"
    ],
    "requirements": [
      {
        "id": "obligation",
        "label": "Hai usato have to, don't have to o must?",
        "kind": "pattern",
        "patterns": [
          [
            "have",
            "to"
          ],
          [
            "must"
          ]
        ],
        "optional": true
      },
      {
        "id": "if",
        "label": "Hai dato un consiglio con if?",
        "kind": "pattern",
        "patterns": [
          [
            "if"
          ]
        ],
        "optional": true
      },
      {
        "id": "relative",
        "label": "Hai usato who, which o where per spiegare qualcosa?",
        "kind": "pattern",
        "patterns": [
          [
            "who|which|where"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 5 frasi?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Hi Tom! I'm so happy you are coming next month. You don't have to bring a lot of clothes, because it is warm here. If you are tired after the flight, we will rest at home. I will take you to the cafe where I work. My phone battery is always low, so send me a message before you arrive!",
    "checklist": [
      "Ho spiegato che cosa deve fare e che cosa non è necessario.",
      "Ho dato consigli con if.",
      "Ho usato who, which o where."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "eit.b1.wt.block3-problem",
    "kind": "free",
    "codes": [],
    "lesson": "eit-b1-u12-final",
    "block": 3,
    "title": "Un problema della tua città",
    "instructions": "Scegli un problema della tua città (i trasporti, i rifiuti, il rumore…). Spiega la causa, racconta che cosa è stato fatto, dai la tua opinione e proponi una soluzione.",
    "prompts": [
      "What is the problem?",
      "Why is it a problem?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "cause",
        "label": "Hai spiegato la causa (because, because of)?",
        "kind": "pattern",
        "patterns": [
          [
            "because"
          ]
        ],
        "optional": true
      },
      {
        "id": "contrast",
        "label": "Hai mostrato un contrasto (although, however, on the other hand)?",
        "kind": "pattern",
        "patterns": [
          [
            "although|however"
          ],
          [
            "on",
            "the",
            "other",
            "hand"
          ]
        ],
        "optional": true
      },
      {
        "id": "opinion",
        "label": "Hai dato la tua opinione?",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "my",
            "opinion"
          ],
          [
            "i",
            "think"
          ]
        ],
        "optional": true
      },
      {
        "id": "would",
        "label": "Hai proposto una soluzione (if…, would / will)?",
        "kind": "pattern",
        "patterns": [
          [
            "would"
          ],
          [
            "will"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Hai scritto almeno 5 frasi?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "In my city, there is a lot of pollution because of the cars. Although there are buses, many people drive to work. Last year some new bus stops were built. However, they are not enough. In my opinion, public transport should be cheaper. If it were cheaper, more people would use it.",
    "checklist": [
      "Ho spiegato il problema e la sua causa.",
      "Ho mostrato un contrasto.",
      "Ho dato la mia opinione e una soluzione."
    ]
  }
];
