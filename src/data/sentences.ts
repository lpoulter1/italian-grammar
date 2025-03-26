import { Verb } from "@/types/verbs";

export type SentenceTemplate = {
  sentence: string; // Sentence with ______ for the blank
  verb: string; // Infinitive of the verb
  person: string; // io, tu, lui/lei, noi, voi, loro
  answer: string; // Correct conjugated form
  translation?: string; // Optional English translation
};

// Function to create sentence templates from verbs and contexts
export function generateSentenceTemplates(verbs: Verb[]): SentenceTemplate[] {
  const templates: SentenceTemplate[] = [];

  // Context phrases for different verb types
  const contextMap: Record<string, Record<string, string[]>> = {
    io: {
      are: ["sempre", "spesso", "ogni giorno", "raramente"],
      ere: ["a volte", "con piacere", "quando posso", "con interesse"],
      ire: ["con attenzione", "subito", "immediatamente", "con calma"],
      "ire-isc": ["di solito", "volentieri", "sempre", "con entusiasmo"],
    },
    tu: {
      are: ["ogni giorno", "spesso", "sempre", "mai"],
      ere: ["bene", "male", "quando puoi", "subito"],
      ire: ["troppo", "poco", "abbastanza", "velocemente"],
      "ire-isc": ["sempre", "mai", "qualche volta", "raramente"],
    },
    lui: {
      are: ["regolarmente", "spesso", "con attenzione", "bene"],
      ere: ["sempre", "solo", "raramente", "attentamente"],
      ire: ["molto", "poco", "abbastanza", "quando necessario"],
      "ire-isc": ["con cura", "spesso", "sempre", "rapidamente"],
    },
    noi: {
      are: ["insieme", "spesso", "ogni weekend", "raramente"],
      ere: ["quando possiamo", "sempre", "ogni sera", "con piacere"],
      ire: ["velocemente", "lentamente", "con calma", "con attenzione"],
      "ire-isc": ["regolarmente", "ogni settimana", "con impegno", "insieme"],
    },
    voi: {
      are: ["spesso", "sempre", "mai", "troppo"],
      ere: ["bene", "male", "quando potete", "insieme"],
      ire: ["con calma", "velocemente", "con passione", "abbastanza"],
      "ire-isc": ["spesso", "regolarmente", "in gruppo", "ogni giorno"],
    },
    loro: {
      are: ["ogni giorno", "sempre", "mai", "spesso"],
      ere: ["insieme", "separatamente", "quando possono", "bene"],
      ire: ["con entusiasmo", "lentamente", "molto", "poco"],
      "ire-isc": ["con interesse", "sempre", "regolarmente", "ogni settimana"],
    },
  };

  // Objects to complete the sentence (direct objects)
  const objectMap: Record<string, string[]> = {
    mangiare: ["la pizza", "la pasta", "il gelato", "la frutta"],
    parlare: ["italiano", "con gli amici", "al telefono", "di politica"],
    studiare: ["matematica", "storia", "italiano", "scienze"],
    lavorare: ["in ufficio", "da casa", "molto", "poco"],
    leggere: ["un libro", "il giornale", "una rivista", "delle email"],
    scrivere: ["una lettera", "un messaggio", "un'email", "un articolo"],
    vedere: ["un film", "la TV", "gli amici", "il paesaggio"],
    bere: ["acqua", "vino", "caffè", "una bibita"],
    sentire: ["la musica", "un rumore", "una voce", "il canto degli uccelli"],
    dormire: ["bene", "male", "poco", "troppo"],
    capire: ["la lezione", "il concetto", "il problema", "la domanda"],
    finire: ["il lavoro", "i compiti", "il libro", "la cena"],
    preferire: ["il caffè", "la pizza", "restare a casa", "viaggiare"],
  };

  // Generate sentence templates for each verb and person
  verbs.forEach((verb) => {
    Object.entries(verb.conjugations).forEach(([person, conjugation]) => {
      // Skip if no specific objects for this verb, use a generic one
      const objects = objectMap[verb.infinitive] || [
        "molto",
        "sempre",
        "bene",
        "",
      ];

      // Get context phrases for this verb type and person
      const contexts = contextMap[person]?.[verb.type] || [""];

      // Create 1-2 templates per conjugation
      const numTemplates = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numTemplates; i++) {
        const object = objects[Math.floor(Math.random() * objects.length)];
        const context = contexts[Math.floor(Math.random() * contexts.length)];

        // Format the sentence with the blank
        let sentence = "";
        if (context && object) {
          sentence = `${person} ______ ${context} ${object}.`;
        } else if (context) {
          sentence = `${person} ______ ${context}.`;
        } else if (object) {
          sentence = `${person} ______ ${object}.`;
        } else {
          sentence = `${person} ______.`;
        }

        // Create translation
        const translationPerson =
          person === "io"
            ? "I"
            : person === "tu"
            ? "you"
            : person === "lui"
            ? "he"
            : person === "noi"
            ? "we"
            : person === "voi"
            ? "you all"
            : "they";

        const translatedVerb = verb.meaning.replace("to ", "");

        let translation = `${translationPerson} ${translatedVerb}`;
        if (context || object) {
          translation += "...";
        }

        templates.push({
          sentence,
          verb: verb.infinitive,
          person,
          answer: conjugation,
          translation,
        });
      }
    });
  });

  return templates;
}

// A smaller set of hardcoded sentence templates as specified in requirements
export const hardcodedSentenceTemplates: SentenceTemplate[] = [
  {
    sentence: "Noi ______ la pizza.",
    verb: "mangiare",
    person: "noi",
    answer: "mangiamo",
    translation: "We eat the pizza.",
  },
  {
    sentence: "Io ______ il libro.",
    verb: "leggere",
    person: "io",
    answer: "leggo",
    translation: "I read the book.",
  },
  {
    sentence: "Loro ______ a scuola.",
    verb: "andare",
    person: "loro",
    answer: "vanno",
    translation: "They go to school.",
  },
  {
    sentence: "Tu ______ italiano molto bene.",
    verb: "parlare",
    person: "tu",
    answer: "parli",
    translation: "You speak Italian very well.",
  },
  {
    sentence: "Lei ______ la musica classica.",
    verb: "preferire",
    person: "lui",
    answer: "preferisce",
    translation: "She prefers classical music.",
  },
  {
    sentence: "Voi ______ il caffè al mattino.",
    verb: "bere",
    person: "voi",
    answer: "bevete",
    translation: "You all drink coffee in the morning.",
  },
  {
    sentence: "Io ______ la TV ogni sera.",
    verb: "guardare",
    person: "io",
    answer: "guardo",
    translation: "I watch TV every evening.",
  },
  {
    sentence: "Lui ______ molto durante la settimana.",
    verb: "lavorare",
    person: "lui",
    answer: "lavora",
    translation: "He works a lot during the week.",
  },
  {
    sentence: "Noi ______ in Italia l'estate prossima.",
    verb: "viaggiare",
    person: "noi",
    answer: "viaggiamo",
    translation: "We travel to Italy next summer.",
  },
  {
    sentence: "Loro ______ la lezione di italiano.",
    verb: "capire",
    person: "loro",
    answer: "capiscono",
    translation: "They understand the Italian lesson.",
  },
];
