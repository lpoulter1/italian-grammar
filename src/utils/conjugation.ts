import { Verb, VerbType } from "@/types/verbs";
import { verbPatterns, verbs } from "@/data/verbs";

export const getVerbStem = (infinitive: string): string => {
  return infinitive.slice(0, -3);
};

export const getVerbType = (infinitive: string): VerbType => {
  if (infinitive.endsWith("are")) return "are";
  if (infinitive.endsWith("ere")) return "ere";
  // Check known -isc verbs
  if (verbs.some((v) => v.infinitive === infinitive && v.type === "ire-isc")) {
    return "ire-isc";
  }
  return "ire";
};

export const getHintVerb = (currentVerb: Verb): Verb | null => {
  const sameTypeVerbs = verbs.filter(
    (v) =>
      v.type === currentVerb.type && v.infinitive !== currentVerb.infinitive
  );
  if (sameTypeVerbs.length === 0) return null;
  return sameTypeVerbs[Math.floor(Math.random() * sameTypeVerbs.length)];
};

export const conjugateVerb = (infinitive: string): Verb => {
  // Check if it's a known verb
  const knownVerb = verbs.find((v) => v.infinitive === infinitive);
  if (knownVerb) return knownVerb;

  const type = getVerbType(infinitive);
  const stem = getVerbStem(infinitive);
  const pattern = verbPatterns.find((p) => p.type === type)!.pattern;

  return {
    infinitive,
    meaning: "(Add meaning)",
    type,
    conjugations: {
      io: stem + pattern.io,
      tu: stem + pattern.tu,
      lui: stem + pattern.lui,
      noi: stem + pattern.noi,
      voi: stem + pattern.voi,
      loro: stem + pattern.loro,
    },
  };
};

export const getRandomVerb = (): Verb => {
  const randomIndex = Math.floor(Math.random() * verbs.length);
  return verbs[randomIndex];
};
