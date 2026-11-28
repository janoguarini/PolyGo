// GENERADO por scripts/build-en-src-writing.ts: no editar a mano (docs/EN_MULTI_SOURCE.md).
import type { WritingTaskDef } from '../../../shared/writing';

export const EN_FROM_FR_WRITING_TASKS: readonly WritingTaskDef[] = [
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.how-are-you",
    "kind": "guided",
    "codes": [
      "p08",
      "v01"
    ],
    "lesson": "efr-a1-u01-l05",
    "title": "Salue et dis comment tu vas",
    "instructions": "Réponds à Tom avec tes informations (tu peux les inventer) : salue, dis ton nom et comment tu vas.",
    "prompts": [
      "Hello! My name is Tom. How are you?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Tu salues (Hello, Hi, Good morning…)",
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
        "label": "Tu dis ton nom (My name is… / I am…)",
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
        "label": "Tu dis comment tu vas (I am fine, I am good…)",
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
        "label": "Tu écris au moins 2 phrases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hello, Tom! My name is Ana. I am fine, thank you.",
    "checklist": [
      "J’ai salué.",
      "J’ai dit mon nom.",
      "J’ai dit comment je vais."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.my-age",
    "kind": "guided",
    "codes": [
      "p08",
      "g16",
      "v03"
    ],
    "lesson": "efr-a1-u03-l04",
    "title": "Ton âge et ton pays",
    "instructions": "Réponds aux deux questions avec des phrases complètes (tu peux inventer les informations).",
    "prompts": [
      "How old are you?",
      "Where are you from?"
    ],
    "requirements": [
      {
        "id": "age",
        "label": "Tu dis ton âge avec I am + nombre (sans have)",
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
        "label": "Tu dis d’où tu viens avec I am from…",
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
        "label": "Tu écris au moins 2 phrases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I am twenty years old. I am from Argentina.",
    "checklist": [
      "J’ai utilisé I am pour l’âge (pas I have).",
      "J’ai dit le pays avec from."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.my-family",
    "kind": "guided",
    "codes": [
      "p03",
      "g09",
      "v04"
    ],
    "lesson": "efr-a1-u04-l05",
    "title": "Ta famille",
    "instructions": "Écris sur ta famille (réelle ou inventée) : combien de frères ou de sœurs tu as et comment s’appelle quelqu’un de ta famille.",
    "prompts": [
      "Do you have a brother?",
      "Do you have a sister?",
      "What is your mother's name?"
    ],
    "requirements": [
      {
        "id": "have",
        "label": "Tu utilises I have pour dire qui tu as dans ta famille",
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
        "label": "Tu nommes un membre de ta famille (mother, brother, sister…)",
        "kind": "pattern",
        "patterns": [
          [
            "mother|father|brother|brothers|sister|sisters|grandmother|grandfather|parents|baby"
          ]
        ]
      },
      {
        "id": "possessive",
        "label": "Tu donnes un prénom avec his, her ou my (Her name is…)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have two sisters. My mother is a teacher. Her name is Rosa.",
    "checklist": [
      "J’ai bien utilisé have ou has.",
      "J’ai choisi his ou her selon la personne."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.my-routine",
    "kind": "guided",
    "codes": [
      "p05",
      "g12",
      "g14"
    ],
    "lesson": "efr-a1-u08-l05",
    "title": "Ta routine",
    "instructions": "Raconte trois choses que tu fais tous les jours (elles peuvent être inventées). Utilise always, usually ou never au moins une fois.",
    "prompts": [
      "What do you do every day?"
    ],
    "requirements": [
      {
        "id": "routine-verb",
        "label": "Tu utilises un verbe de routine (get up, work, study, read…)",
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
        "label": "Tu utilises always, usually ou never avant le verbe",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I get up at seven. I always study in the morning. I never read in the evening.",
    "checklist": [
      "J’ai mis l’adverbe avant le verbe (I always study).",
      "J’ai écrit trois phrases."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.my-likes",
    "kind": "guided",
    "codes": [
      "p06",
      "g18",
      "g22"
    ],
    "lesson": "efr-a1-u11-l05",
    "title": "Ce que tu aimes",
    "instructions": "Écris ce que tu aimes et ce que tu n’aimes pas (tu peux inventer). Utilise like, love ou hate, et relie deux idées avec and ou but.",
    "prompts": [
      "What do you like?",
      "What is your favorite sport?"
    ],
    "requirements": [
      {
        "id": "like",
        "label": "Tu utilises like, love ou hate",
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
        "label": "Tu relies deux idées avec and ou but",
        "kind": "pattern",
        "patterns": [
          [
            "and|but"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 2 phrases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I love music and I like football. I can swim, but I can't dance.",
    "checklist": [
      "J’ai utilisé like, love ou hate.",
      "J’ai utilisé and ou but."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.ask-and-answer",
    "kind": "guided",
    "codes": [
      "p07",
      "p08",
      "g16"
    ],
    "lesson": "efr-a1-u12-l05",
    "title": "Poser des questions et répondre",
    "instructions": "Écris deux questions pour faire connaissance avec quelqu’un (nom, âge, pays…) et réponds à l’une d’elles avec tes informations (tu peux les inventer).",
    "prompts": [],
    "requirements": [
      {
        "id": "wh-question",
        "label": "Tu écris une question avec What, Where, How old…",
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
        "label": "Tu écris deux questions (avec un point d’interrogation)",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "answer",
        "label": "Tu réponds avec une phrase à toi (I am…, My name is…)",
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
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      }
    ],
    "model": "What is your name? Where are you from? I am from Spain.",
    "checklist": [
      "Mes questions se terminent par « ? ».",
      "J’ai mis le verbe avant le sujet (Where are you…?)."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.block1-introduce",
    "kind": "free",
    "codes": [
      "p02",
      "p03"
    ],
    "block": 1,
    "lesson": "efr-a1-u04-final",
    "title": "Bloc 1 : présente-toi et présente quelqu’un",
    "instructions": "Écris 4 ou 5 phrases : qui tu es (prénom, âge, pays) et une personne de ta famille ou un ami. Tu peux inventer les informations.",
    "prompts": [
      "What is your name?",
      "How old are you?",
      "Where are you from?",
      "Who is your friend?"
    ],
    "requirements": [
      {
        "id": "hint-name",
        "label": "Indice : tu as dit ton prénom ?",
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
        "label": "Indice : tu as parlé d’une autre personne avec he ou she ?",
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
        "label": "Tu as écrit au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hello! My name is Ana. I am twenty years old. I am from Argentina. Tom is my friend. He is from England and he is a student.",
    "checklist": [
      "J’ai dit mon prénom, mon âge et d’où je viens.",
      "J’ai présenté une autre personne avec he ou she.",
      "J’ai bien utilisé am, is et are.",
      "Mon texte se comprend quand je le lis à voix haute."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.block2-room-and-order",
    "kind": "free",
    "codes": [
      "p04",
      "p10"
    ],
    "block": 2,
    "lesson": "efr-a1-u07-final",
    "title": "Bloc 2 : ta chambre et une commande",
    "instructions": "Écris 3 phrases sur ta chambre (ce qu’il y a et où se trouvent les choses), puis une courte commande dans un café.",
    "prompts": [
      "What is in your bedroom?",
      "Where is your bed?"
    ],
    "requirements": [
      {
        "id": "hint-there",
        "label": "Astuce : tu as utilisé there is ou there are ?",
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
        "label": "Astuce : tu as dit où se trouve quelque chose (in, on, under, next to) ?",
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
        "label": "Astuce : tu as commandé avec I'd like… please ?",
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
      "J’ai dit ce qu’il y a dans la chambre.",
      "J’ai dit où se trouve une chose.",
      "Ma commande contient please."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.block3-week-and-note",
    "kind": "free",
    "codes": [
      "p05",
      "p09"
    ],
    "block": 3,
    "lesson": "efr-a1-u09-final",
    "title": "Bloc 3 : ta semaine et un petit mot",
    "instructions": "Raconte en 3 phrases ce que tu fais dans la semaine (jours et heures) et écris un petit mot du type « Back at five ».",
    "prompts": [
      "What do you do on Monday?",
      "What time do you get up?"
    ],
    "glossary": [
      {
        "term": "Back at five.",
        "meaning": "Je reviens à cinq heures."
      }
    ],
    "requirements": [
      {
        "id": "hint-day",
        "label": "Astuce : tu as utilisé on avec un jour (on Monday) ?",
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
        "label": "Astuce : tu as utilisé at avec une heure (at seven) ?",
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
        "label": "Astuce : ton mot dit quand tu reviens (back at…) ?",
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
      "J’ai utilisé on avec les jours et at avec l’heure.",
      "Mon mot dit où je suis et quand je reviens."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "efr.a1.wt.block4-post-and-postcard",
    "kind": "free",
    "codes": [
      "p06",
      "p07",
      "p09"
    ],
    "block": 4,
    "lesson": "efr-a1-u12-final",
    "title": "Bloc 4 : une publication et une carte postale",
    "instructions": "Écris une courte publication sur tes goûts avec une question pour tes amis, et une petite carte postale depuis une ville.",
    "prompts": [
      "What do you like?",
      "What can you do?"
    ],
    "requirements": [
      {
        "id": "hint-like",
        "label": "Indice : tu as dit ce que tu aimes (I like, I love) ?",
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
        "label": "Indice : tu as posé une question à tes amis ?",
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
        "label": "Indice : ta carte postale dit au revoir (See you…, Love,…) ?",
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
      "J’ai raconté ce que j’aime et ce que je sais faire.",
      "J’ai posé une question avec « ? ».",
      "Ma carte postale salue et dit au revoir."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.a-party",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u01-l05",
    "title": "Une fête",
    "instructions": "Raconte à un ami comment s’est passée une fête ou un anniversaire (vrai ou inventé) : où c’était, quand, et comment tu te sentais.",
    "prompts": [
      "Where was the party?",
      "When was it?",
      "How were you?"
    ],
    "requirements": [
      {
        "id": "was-were",
        "label": "Tu utilises was ou were",
        "kind": "pattern",
        "patterns": [
          [
            "was|were"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Tu dis quand c’était (yesterday, last week, last night, on Saturday…)",
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
        "label": "Tu dis comment tu te sentais (happy, tired, excited, bored…)",
        "kind": "pattern",
        "patterns": [
          [
            "happy|tired|excited|bored|sad|nervous|angry|busy"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "The party was at my friend’s house last Saturday. I was very happy and excited. The music was great!",
    "checklist": [
      "J’ai utilisé was et were.",
      "J’ai dit quand c’était.",
      "J’ai dit comment je me sentais."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.my-weekend",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u03-l05",
    "title": "Ton week-end",
    "instructions": "Raconte ce que tu as fait le week-end dernier (tu peux l’inventer). Utilise des verbes au passé et dis quand.",
    "prompts": [
      "What did you do last weekend?",
      "Where did you go?",
      "Who did you see?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Tu utilises au moins un verbe au passé (went, had, saw, bought…)",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Tu dis quand (last weekend, on Saturday, yesterday…)",
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
        "label": "Tu mets ce que tu as fait dans l’ordre avec then ou after (facultatif)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last weekend I went to the park with my family. We ate chicken and then we walked in the city. On Sunday I slept a lot!",
    "checklist": [
      "J’ai utilisé des verbes au passé.",
      "J’ai dit quand c’est arrivé.",
      "J’ai mis dans l’ordre ce que j’ai fait."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.holiday-message",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u04-l05",
    "title": "Un message de tes vacances",
    "instructions": "Écris à un ami pendant un voyage (vrai ou inventé) : où tu es, comment tu es arrivé et ce que tu as fait.",
    "prompts": [
      "Where are you?",
      "How did you travel?",
      "What did you see?"
    ],
    "requirements": [
      {
        "id": "place",
        "label": "Tu dis où tu es (I am in… / I’m at the beach…)",
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
        "label": "Tu dis comment tu as voyagé avec by (by plane, by train, by car…)",
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
        "label": "Tu racontes quelque chose que tu as fait, au passé",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I am in Mexico on vacation. I came by plane. Yesterday I went to the beach and I took a lot of photos. See you!",
    "checklist": [
      "J’ai dit où je suis.",
      "J’ai dit comment j’ai voyagé (by…).",
      "J’ai raconté quelque chose que j’ai fait."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.my-plans",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u08-l05",
    "title": "Tes projets",
    "instructions": "Raconte tes projets pour la semaine prochaine (tu peux les inventer) et quelque chose qui, selon toi, va arriver.",
    "prompts": [
      "What are you going to do next week?",
      "Do you think it will be a good week?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Tu racontes un projet avec going to",
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
        "label": "Tu fais une prédiction avec will ou won’t",
        "kind": "pattern",
        "patterns": [
          [
            "will|won't|i'll|it'll|we'll|you'll|he'll|she'll|they'll"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Tu dis quand (next week, tomorrow, tonight, soon…)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Next week I am going to visit my grandmother. We are going to cook dinner. I think it will be a great week.",
    "checklist": [
      "J’ai raconté un projet avec going to.",
      "J’ai fait une prédiction avec will.",
      "J’ai dit quand."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.advice",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u09-l05",
    "title": "Un conseil pour un ami",
    "instructions": "Ton ami t’écrit qu’il ne se sent pas bien. Réponds-lui : demande-lui où il a mal et donne-lui des conseils avec should et shouldn’t.",
    "prompts": [
      "I'm sick. I have a headache and a fever."
    ],
    "requirements": [
      {
        "id": "should",
        "label": "Tu donnes un conseil avec should",
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
        "label": "Tu dis quelque chose qu’il ne devrait pas faire avec shouldn’t",
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
        "label": "Tu parles du corps ou de la santé (head, headache, fever, doctor, medicine…)",
        "kind": "pattern",
        "patterns": [
          [
            "head|headache|fever|doctor|medicine|stomach|back|sick|rest"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry. You should go to the doctor. You should rest and drink a lot of water. You shouldn't go to work tomorrow.",
    "checklist": [
      "J’ai donné un conseil avec should.",
      "J’ai utilisé shouldn’t.",
      "J’ai parlé de la santé."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.experiences",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u12-l05",
    "title": "Tes expériences",
    "instructions": "Raconte deux choses que tu as déjà faites et une que tu n’as jamais faite (tu peux les inventer).",
    "prompts": [
      "Have you ever been abroad?",
      "Have you ever been to a famous city?"
    ],
    "requirements": [
      {
        "id": "have-done",
        "label": "Tu utilises have + participe (I have been, I’ve seen…)",
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
        "label": "Tu dis quelque chose que tu n’as jamais fait (I have never… / I haven’t…)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to Spain twice. I have eaten a lot of amazing food there. I have never seen snow!",
    "checklist": [
      "J’ai raconté des expériences avec have + participe.",
      "J’ai dit quelque chose que je n’ai jamais fait.",
      "J’ai utilisé ever, never ou twice."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.restaurant",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u13-l05",
    "title": "Un dîner au restaurant",
    "instructions": "Raconte un repas au restaurant (vrai ou inventé) : ce que tu as commandé, comment c’était et comment tu as payé.",
    "prompts": [
      "What did you order?",
      "Was it good?",
      "How did you pay?"
    ],
    "requirements": [
      {
        "id": "food",
        "label": "Tu nommes ce que tu as mangé (soup, salad, fish, meat, dessert…)",
        "kind": "pattern",
        "patterns": [
          [
            "soup|salad|fish|meat|vegetables|dessert|chicken|rice|bread|cheese|eggs"
          ]
        ]
      },
      {
        "id": "opinion",
        "label": "Tu dis comment c’était (delicious, spicy, good…)",
        "kind": "pattern",
        "patterns": [
          [
            "delicious|spicy|good|great|amazing|bad|cold|hot"
          ]
        ]
      },
      {
        "id": "pay",
        "label": "Tu racontes comment tu as payé ou que tu as demandé l’addition",
        "kind": "pattern",
        "patterns": [
          [
            "paid|pay|bill|card|cash"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last night I went to a restaurant with my sister. I ordered fish and a salad, and the dessert was delicious. We paid by card.",
    "checklist": [
      "J’ai dit ce que j’ai mangé.",
      "J’ai donné mon avis.",
      "J’ai raconté comment nous avons payé."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.reply-invitation",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u14-l05",
    "title": "Répondre à une invitation",
    "instructions": "Mia t’invite à son anniversaire. Réponds-lui : remercie et accepte, ou refuse en donnant une raison et propose une autre sortie.",
    "prompts": [
      "Hi! Would you like to come to my birthday party on Saturday? Mia"
    ],
    "requirements": [
      {
        "id": "thanks",
        "label": "Tu remercies (Thank you / Thanks)",
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
        "label": "Tu acceptes (I’d love to) ou tu refuses (Sorry, I can’t)",
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
        "label": "Tu proposes quelque chose avec Let's… ou How about…? (facultatif)",
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
        "label": "Tu écris au moins 2 phrases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Mia! Thank you for the invitation. Sorry, I can't go on Saturday because I have to work. How about dinner on Sunday?",
    "glossary": [
      {
        "term": "invitation",
        "meaning": "invitation"
      }
    ],
    "checklist": [
      "J’ai remercié.",
      "J’ai accepté ou refusé en donnant une raison.",
      "J’ai proposé une autre sortie."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.describe-someone",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u15-l05",
    "title": "Décris quelqu’un",
    "instructions": "Décris une personne que tu connais (ou invente-la) : à quoi elle ressemble et comment elle est de caractère.",
    "prompts": [
      "What does he or she look like?",
      "What is he or she like?"
    ],
    "requirements": [
      {
        "id": "looks",
        "label": "Tu décris l’apparence (tall, short, thin… / has … hair, a beard, glasses)",
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
        "label": "Tu décris le caractère (friendly, kind, funny, shy, quiet…)",
        "kind": "pattern",
        "patterns": [
          [
            "friendly|kind|funny|shy|quiet|nice|interesting"
          ]
        ]
      },
      {
        "id": "linker",
        "label": "Tu relies les idées avec and, but ou because (facultatif)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "My best friend is Ana. She is tall and she has long dark hair. She is very funny, but she is a little shy at first.",
    "glossary": [
      {
        "term": "a little",
        "meaning": "un peu"
      }
    ],
    "checklist": [
      "J’ai décrit l’apparence.",
      "J’ai décrit le caractère.",
      "J’ai utilisé and, but ou because."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.booking-email",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-a2-u16-l05",
    "title": "Un e-mail pour réserver",
    "instructions": "Écris au Green Hotel pour réserver une chambre : dis bonjour, dis ce que tu veux et pour quand, pose une question et dis au revoir.",
    "prompts": [],
    "requirements": [
      {
        "id": "opening",
        "label": "Tu commences par Dear… ou Hello",
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
        "label": "Tu demandes la chambre (I’d like to book…)",
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
        "label": "Tu fais une demande avec Could you…?",
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
        "label": "Tu termines par Best wishes ou Thank you",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      }
    ],
    "model": "Dear Green Hotel, I'd like to book a double room for two nights in July. Could you send me the price, please? Best wishes, Ana",
    "checklist": [
      "J’ai dit bonjour et au revoir.",
      "J’ai dit quelle chambre je veux et quand.",
      "J’ai demandé quelque chose avec Could you…?"
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.block1-trip",
    "kind": "free",
    "codes": [],
    "lesson": "efr-a2-u06-final",
    "block": 1,
    "title": "Un voyage et des achats",
    "instructions": "Écris un message à un ami sur un voyage (vrai ou inventé) : où tu es allé, comment tu as voyagé, ce que tu as fait et ce que tu as acheté.",
    "prompts": [
      "Where did you go?",
      "What did you do?",
      "What did you buy?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Tu as utilisé des verbes au passé ?",
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
        "label": "Tu as dit comment tu as voyagé (by…) ?",
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
        "label": "Tu as raconté ce que tu as acheté ?",
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
        "label": "Tu as écrit au moins 4 phrases ?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Tom! Last month I went to Spain by plane. I visited a lot of museums and beaches. I bought a new jacket and new shoes. It was a great trip!",
    "checklist": [
      "J’ai raconté où je suis allé et comment j’ai voyagé.",
      "J’ai utilisé des verbes au passé.",
      "J’ai raconté ce que j’ai acheté."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.block2-news",
    "kind": "free",
    "codes": [],
    "lesson": "efr-a2-u12-final",
    "block": 2,
    "title": "Un e-mail avec des nouvelles",
    "instructions": "Écris un e-mail à un ami avec tes nouvelles : ce que tu fais en ce moment, ce que tu vas faire bientôt et quelque chose que tu as déjà fait.",
    "prompts": [
      "What are you doing these days?",
      "What are you going to do?",
      "Have you done anything new?"
    ],
    "requirements": [
      {
        "id": "now",
        "label": "Tu as raconté ce que tu fais en ce moment (am/is/are + -ing) ?",
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
        "label": "Tu as raconté un projet (going to / will) ?",
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
        "label": "Tu as utilisé have + participe ?",
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
        "label": "Tu as écrit au moins 4 phrases ?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Ana! I am working in a new office now and I have a lot of meetings. Next month I am going to move to a new apartment. I have just started a new job! See you soon.",
    "checklist": [
      "J’ai raconté ce que je fais en ce moment.",
      "J’ai raconté un projet.",
      "J’ai raconté quelque chose que j’ai déjà fait."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "efr.a2.wt.block3-story",
    "kind": "free",
    "codes": [],
    "lesson": "efr-a2-u17-final",
    "block": 3,
    "title": "Raconte une histoire",
    "instructions": "Raconte une courte histoire (vraie ou inventée) : où tu étais et ce que tu faisais, ce qui est arrivé tout à coup et comment ça s’est terminé.",
    "prompts": [
      "Where were you?",
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "continuous",
        "label": "Tu as utilisé was/were + -ing ?",
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
        "label": "Tu as utilisé suddenly, when ou while ?",
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
        "label": "Tu as donné une fin à ton histoire (in the end, the next day…) ?",
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
        "label": "Tu as écrit au moins 5 phrases ?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Last winter I was walking in the park with my friend. It was very cold. Suddenly, it began to snow. At first we were scared, but then we laughed and played in the snow. In the end, it was a great day!",
    "checklist": [
      "J’ai raconté où j’étais et ce que je faisais.",
      "J’ai raconté ce qui est arrivé tout à coup.",
      "L’histoire a une fin."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.unforgettable",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u01-l05",
    "title": "Une expérience inoubliable",
    "instructions": "Raconte une expérience importante de ta vie (vraie ou inventée) : présente-la avec le present perfect et raconte les détails au past simple, en disant quand c’est arrivé et ce que tu as ressenti.",
    "prompts": [
      "What is your best memory?",
      "When was it?",
      "How did you feel?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "Tu utilises le present perfect (I have been, I have climbed…)",
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
        "label": "Tu dis quand c’est arrivé (two years ago, last summer, in 2019…)",
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
        "label": "Tu dis ce que tu as ressenti (proud, happy, excited, nervous…)",
        "kind": "pattern",
        "patterns": [
          [
            "proud|happy|excited|nervous|scared|amazing|unforgettable"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to many countries, but my best memory is my first trip to Spain. I went there two years ago with my sister. It was the first time I climbed a mountain. When we got to the top, I felt very proud. It was an unforgettable adventure!",
    "checklist": [
      "J’ai présenté l’expérience avec le present perfect.",
      "J’ai raconté les détails au past simple et j’ai dit quand c’est arrivé.",
      "J’ai dit ce que j’ai ressenti."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.new-hobby",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u02-l05",
    "title": "Ton loisir",
    "instructions": "Écris à un ami à propos d’un loisir que tu as commencé : depuis quand tu le pratiques, ce que tu fais ces derniers temps et ce que tu aimes dans ce loisir.",
    "prompts": [
      "What is your hobby?",
      "How long have you been doing it?",
      "What do you enjoy about it?"
    ],
    "requirements": [
      {
        "id": "since-for",
        "label": "Tu dis depuis quand avec for ou since",
        "kind": "pattern",
        "patterns": [
          [
            "for|since"
          ]
        ]
      },
      {
        "id": "continuous",
        "label": "Tu utilises have been + -ing (I have been learning…)",
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
        "label": "Tu dis ce que tu aimes (I enjoy / I love + -ing)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I have been learning to play the guitar since January. I practice for one hour every day. I really enjoy playing with my friends, and my skills have improved a lot.",
    "checklist": [
      "J’ai dit depuis quand je pratique ce loisir (for / since).",
      "J’ai utilisé have been + -ing.",
      "J’ai raconté ce que j’aime."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.anecdote",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u03-l05",
    "title": "Une anecdote",
    "instructions": "Raconte une anecdote (vraie ou inventée) : ce que tu étais en train de faire, ce qui s’est passé, ce qui s’était déjà passé avant et comment ça s’est terminé.",
    "prompts": [
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "scene",
        "label": "Tu plantes le décor avec was/were + -ing",
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
        "label": "Tu utilises had + participe passé (had left, had forgotten…)",
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
        "label": "Tu ordonnes les faits (when, by the time, as soon as, afterwards, eventually…)",
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
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last week I was waiting for the bus when I realized that I had forgotten my phone at home. I went back to get it. By the time I arrived at the bus stop again, the bus had left. Eventually, I walked to work. I was late, but my boss laughed!",
    "checklist": [
      "J’ai planté le décor avec was/were + -ing.",
      "J’ai utilisé had + participe passé pour quelque chose qui s’était déjà passé.",
      "J’ai mis les faits dans l’ordre et raconté la fin."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.my-goals",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u04-l05",
    "title": "Tes objectifs",
    "instructions": "Écris tes objectifs pour l’année prochaine : ce que tu vas faire, ce qui pourrait arriver et ce que tu feras quand tu auras terminé quelque chose.",
    "prompts": [
      "What is your goal?",
      "What are you going to do?",
      "What might change?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Tu racontes une intention avec going to",
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
        "label": "Tu racontes quelque chose de possible avec might",
        "kind": "pattern",
        "patterns": [
          [
            "might"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Tu utilises when / as soon as + présent et will",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "My goal for next year is to speak better English. I am going to take an English course, and I might apply for a job abroad. When I finish the course, I will look for a new job.",
    "checklist": [
      "J’ai raconté une intention avec going to.",
      "J’ai utilisé might pour quelque chose de possible.",
      "J’ai utilisé when + présent."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.job-application",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u05-l05",
    "title": "Postuler à un emploi",
    "instructions": "Écris un e-mail formel pour postuler à un emploi (réel ou inventé) : salue, dis à quel poste tu postules, raconte ton expérience et prends congé.",
    "prompts": [
      "Which job do you want?",
      "What experience do you have?",
      "What were you responsible for?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Tu commences par une formule de salutation formelle (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "apply",
        "label": "Tu dis à quoi tu postules (I would like to apply for…)",
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
        "label": "Tu racontes ton expérience (I worked… / I was responsible for…)",
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
        "label": "Tu termines de façon formelle (I look forward to hearing from you / Best wishes)",
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
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I would like to apply for the part-time job at your hotel. I worked in a shop for three years, and I was responsible for the money. I speak English and Spanish. I look forward to hearing from you. Best wishes, Ana.",
    "checklist": [
      "J’ai salué et pris congé de façon formelle.",
      "J’ai dit à quel poste je postule.",
      "J’ai raconté mon expérience et mes tâches."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.visitor-tips",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u06-l05",
    "title": "Conseils pour un visiteur",
    "instructions": "Écris à quelqu’un qui va visiter ta ville ou ton pays : donne-lui des conseils avec if et explique-lui une coutume (ce qui est poli ou impoli).",
    "prompts": [
      "What should a tourist do?",
      "What is polite in your country?",
      "What is rude?"
    ],
    "requirements": [
      {
        "id": "if-will",
        "label": "Tu utilises le premier conditionnel (If you…, you will…)",
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
        "label": "Tu utilises will pour le résultat",
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
        "label": "Tu expliques une coutume (polite, rude, tradition)",
        "kind": "pattern",
        "patterns": [
          [
            "polite|rude|tradition"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "If you visit my city, you will love the food. Exchange some money before you come, because many small shops only take cash. It is polite to say hello when you go into a shop. If you go to a restaurant, leave a tip.",
    "checklist": [
      "J’ai donné des conseils avec if.",
      "J’ai expliqué une coutume.",
      "J’ai utilisé will pour le résultat."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.health-advice",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u07-l05",
    "title": "Conseils à un ami stressé",
    "instructions": "Un ami te raconte qu’il est très stressé. Réponds-lui avec au moins deux conseils (should, ought to, had better) et une comparaison.",
    "prompts": [
      "What should your friend do?",
      "What is better for him?"
    ],
    "requirements": [
      {
        "id": "advice",
        "label": "Tu donnes un conseil avec should ou ought to",
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
        "label": "Tu mets en garde avec had better (You'd better…)",
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
        "label": "Tu compares (as … as, much better, the more…, the better…)",
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
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry you are so stressed. You ought to take a few days off. You should sleep more: the more you sleep, the better you feel. You'd better not work at night.",
    "checklist": [
      "J’ai donné des conseils avec should ou ought to.",
      "J’ai mis en garde avec had better.",
      "J’ai comparé quelque chose."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.recommend-app",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u08-l05",
    "title": "Recommander une appli",
    "instructions": "Recommande une appli ou un appareil que tu utilises : ce qu’il fait (which / that), comment tu l’utilises et pour qui c’est (people who…).",
    "prompts": [
      "What does the app do?",
      "How do you use it?",
      "Who is it good for?"
    ],
    "requirements": [
      {
        "id": "which",
        "label": "Tu expliques ce qu’il fait avec which ou that (an app which helps you…)",
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
        "label": "Tu dis pour qui c’est avec who (people who…)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "I recommend an app which helps you learn new words. You can download it for free, and it works online. I use it every day on the bus. It is great for people who don't have much time.",
    "checklist": [
      "J’ai expliqué ce qu’il fait avec which ou that.",
      "J’ai dit pour qui c’est avec who.",
      "J’ai raconté comment je l’utilise."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.my-community",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u09-l05",
    "title": "Ton quartier et l’environnement",
    "instructions": "Raconte ce qui est fait dans ton quartier ou ta ville pour l’environnement (avec la voix passive) et propose une idée pour améliorer les choses.",
    "prompts": [
      "What is recycled in your city?",
      "What was done last year?",
      "What should we do?"
    ],
    "requirements": [
      {
        "id": "passive",
        "label": "Tu utilises la voix passive (is recycled, was built…)",
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
        "label": "Tu proposes quelque chose (we should…, we have to…, if we…)",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my neighborhood, paper and plastic are recycled every week. Last year a small park was built near my house, and a lot of trees were planted by volunteers. I think we should use public transport more, because cars produce a lot of pollution.",
    "checklist": [
      "J’ai utilisé la voix passive.",
      "J’ai raconté quelque chose qui a été fait.",
      "J’ai proposé une idée."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.what-they-said",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u10-l05",
    "title": "Ce qu’on t’a raconté",
    "instructions": "Raconte une conversation récente au discours indirect : ce que quelqu’un t’a dit (said / told me) et ce qu’il t’a demandé (asked if…).",
    "prompts": [
      "Who called you?",
      "What did they say?",
      "What did they ask?"
    ],
    "requirements": [
      {
        "id": "said",
        "label": "Tu utilises said (that) ou told me (that)",
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
        "label": "Tu rapportes une question avec asked if / asked where…",
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
        "label": "Tu écris au moins 3 phrases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Yesterday my friend Tom called me. He told me that he had a new job. He said that the company was very big. He asked if I wanted to have dinner with him on Friday.",
    "checklist": [
      "J’ai rapporté ce qu’on m’a dit avec said ou told.",
      "J’ai mis les verbes au passé.",
      "J’ai rapporté une question avec asked if."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.my-opinion",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u11-l05",
    "title": "Ton avis",
    "instructions": "Choisis un sujet (vivre dans une grande ou une petite ville, le télétravail, les réseaux sociaux…) et écris ton avis avec un avantage, un inconvénient et ce que tu ferais, toi.",
    "prompts": [
      "What do you think?",
      "What is one advantage?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "opinion",
        "label": "Tu donnes ton avis (In my opinion… / I think…)",
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
        "label": "Tu montres les deux côtés (advantage, disadvantage, on the other hand)",
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
        "label": "Tu utilises le second conditional (If I…, I would…)",
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
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my opinion, it is better to live in a small city. One advantage is that it is quiet. On the other hand, there are fewer jobs. If it were my decision, I would live in a small city near the sea.",
    "checklist": [
      "J’ai donné mon avis.",
      "J’ai donné un avantage et un inconvénient.",
      "J’ai utilisé would."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.complaint",
    "kind": "guided",
    "codes": [],
    "lesson": "efr-b1-u12-l03",
    "title": "Une réclamation formelle",
    "instructions": "Écris un e-mail pour te plaindre d’un achat qui ne fonctionne pas : ce que tu as acheté, quel est le problème et ce que tu demandes (un remboursement ou un échange).",
    "prompts": [
      "What did you buy?",
      "What is the problem?",
      "What would you like?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Tu commences par une formule de salutation formelle (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "problem",
        "label": "Tu expliques le problème (stopped working, broke, broken…)",
        "kind": "pattern",
        "patterns": [
          [
            "stopped|broke|broken|problem|doesn't|didn't"
          ]
        ]
      },
      {
        "id": "request",
        "label": "Tu demandes quelque chose poliment (I would like a refund / Could you replace it?)",
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
        "label": "Tu écris au moins 4 phrases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Chaque phrase commence par une majuscule",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Tu termines par un point, un point d’exclamation ou un point d’interrogation",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I bought a phone charger from your shop last week. It was expensive, but it stopped working after two days. I would like a refund, or could you replace it, please? I have the receipt. Best wishes, Kate Brown.",
    "checklist": [
      "J’ai salué de façon formelle.",
      "J’ai expliqué le problème.",
      "J’ai demandé poliment un remboursement ou un échange."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.block1-life",
    "kind": "free",
    "codes": [],
    "lesson": "efr-b1-u04-final",
    "block": 1,
    "title": "Ta vie jusqu’ici et tes projets",
    "instructions": "Écris un texte sur toi : quelque chose que tu as fait dans ta vie, quelque chose que tu fais ces derniers temps, une petite anecdote et tes projets pour l’avenir.",
    "prompts": [
      "What have you done in your life?",
      "What have you been doing lately?",
      "What are your plans?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "As-tu utilisé le present perfect ?",
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
        "label": "As-tu raconté quelque chose que tu fais ces derniers temps (have been + -ing) ?",
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
        "label": "As-tu raconté tes projets (going to, will, might) ?",
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
        "label": "Tu as écrit au moins 5 phrases ?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "I have lived in the same city all my life, but I have traveled to five countries. Lately I have been studying English every day. Last summer I missed my flight because I had forgotten my passport! Next year I am going to take an English course. I might move abroad someday.",
    "checklist": [
      "J’ai raconté des expériences avec le present perfect.",
      "J’ai raconté quelque chose que je fais ces derniers temps.",
      "J’ai inclus une anecdote et mes projets."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.block2-visit",
    "kind": "free",
    "codes": [],
    "lesson": "efr-b1-u08-final",
    "block": 2,
    "title": "Un e-mail à quelqu’un qui vient te voir",
    "instructions": "Un ami d’un autre pays vient te rendre visite. Écris-lui un e-mail : ce qu’il doit faire ou n’a pas besoin de faire, des conseils de voyage et de santé, et comment vous allez garder le contact.",
    "prompts": [
      "What does your friend have to do?",
      "What should he bring?",
      "How will you keep in touch?"
    ],
    "requirements": [
      {
        "id": "obligation",
        "label": "Tu as utilisé have to, don't have to ou must ?",
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
        "label": "Tu as donné un conseil avec if ?",
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
        "label": "Tu as utilisé who, which ou where pour expliquer quelque chose ?",
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
        "label": "Tu as écrit au moins 5 phrases ?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Hi Tom! I'm so happy you are coming next month. You don't have to bring a lot of clothes, because it is warm here. If you are tired after the flight, we will rest at home. I will take you to the cafe where I work. My phone battery is always low, so send me a message before you arrive!",
    "checklist": [
      "J’ai expliqué ce qu’il doit faire et ce qui n’est pas nécessaire.",
      "J’ai donné des conseils avec if.",
      "J’ai utilisé who, which ou where."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "efr.b1.wt.block3-problem",
    "kind": "free",
    "codes": [],
    "lesson": "efr-b1-u12-final",
    "block": 3,
    "title": "Un problème dans ta ville",
    "instructions": "Choisis un problème de ta ville (les transports, les déchets, le bruit…). Explique la cause, raconte ce qui a été fait, donne ton avis et propose une solution.",
    "prompts": [
      "What is the problem?",
      "Why is it a problem?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "cause",
        "label": "As-tu expliqué la cause (because, because of) ?",
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
        "label": "As-tu montré un contraste (although, however, on the other hand) ?",
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
        "label": "As-tu donné ton avis ?",
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
        "label": "As-tu proposé une solution (if…, would / will) ?",
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
        "label": "Tu as écrit au moins 5 phrases ?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "In my city, there is a lot of pollution because of the cars. Although there are buses, many people drive to work. Last year some new bus stops were built. However, they are not enough. In my opinion, public transport should be cheaper. If it were cheaper, more people would use it.",
    "checklist": [
      "J’ai expliqué le problème et sa cause.",
      "J’ai montré un contraste.",
      "J’ai donné mon avis et une solution."
    ]
  }
];
