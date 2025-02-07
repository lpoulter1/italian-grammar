import { Verb, VerbGroup } from "@/types/verbs";

export const verbPatterns: VerbGroup[] = [
  {
    type: "are",
    description: "-are verbs (First Conjugation)",
    pattern: {
      io: "o",
      tu: "i",
      lui: "a",
      noi: "iamo",
      voi: "ate",
      loro: "ano",
    },
  },
  {
    type: "ere",
    description: "-ere verbs (Second Conjugation)",
    pattern: {
      io: "o",
      tu: "i",
      lui: "e",
      noi: "iamo",
      voi: "ete",
      loro: "ono",
    },
  },
  {
    type: "ire",
    description: "-ire verbs (Third Conjugation)",
    pattern: {
      io: "o",
      tu: "i",
      lui: "e",
      noi: "iamo",
      voi: "ite",
      loro: "ono",
    },
  },
  {
    type: "ire-isc",
    description: "-ire verbs with -isc (Third Conjugation)",
    pattern: {
      io: "isco",
      tu: "isci",
      lui: "isce",
      noi: "iamo",
      voi: "ite",
      loro: "iscono",
    },
  },
];

export const verbs: Verb[] = [
  {
    infinitive: "parlare",
    meaning: "to speak",
    type: "are",
    conjugations: {
      io: "parlo",
      tu: "parli",
      lui: "parla",
      noi: "parliamo",
      voi: "parlate",
      loro: "parlano",
    },
  },
  {
    infinitive: "mangiare",
    meaning: "to eat",
    type: "are",
    conjugations: {
      io: "mangio",
      tu: "mangi",
      lui: "mangia",
      noi: "mangiamo",
      voi: "mangiate",
      loro: "mangiano",
    },
  },
  {
    infinitive: "prendere",
    meaning: "to take",
    type: "ere",
    conjugations: {
      io: "prendo",
      tu: "prendi",
      lui: "prende",
      noi: "prendiamo",
      voi: "prendete",
      loro: "prendono",
    },
  },
  {
    infinitive: "vedere",
    meaning: "to see",
    type: "ere",
    conjugations: {
      io: "vedo",
      tu: "vedi",
      lui: "vede",
      noi: "vediamo",
      voi: "vedete",
      loro: "vedono",
    },
  },
  {
    infinitive: "dormire",
    meaning: "to sleep",
    type: "ire",
    conjugations: {
      io: "dormo",
      tu: "dormi",
      lui: "dorme",
      noi: "dormiamo",
      voi: "dormite",
      loro: "dormono",
    },
  },
  {
    infinitive: "capire",
    meaning: "to understand",
    type: "ire-isc",
    conjugations: {
      io: "capisco",
      tu: "capisci",
      lui: "capisce",
      noi: "capiamo",
      voi: "capite",
      loro: "capiscono",
    },
  },
];
