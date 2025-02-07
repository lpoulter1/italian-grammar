export type PersonType = "io" | "tu" | "lui" | "noi" | "voi" | "loro";

export type ConjugationPattern = {
  [key in PersonType]: string;
};

export type VerbType = "are" | "ere" | "ire" | "ire-isc";

export type Verb = {
  infinitive: string;
  meaning: string;
  type: VerbType;
  conjugations: ConjugationPattern;
};

export type VerbGroup = {
  type: VerbType;
  pattern: ConjugationPattern;
  description: string;
};
