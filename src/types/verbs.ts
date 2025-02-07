export type PersonType = "io" | "tu" | "lui" | "noi" | "voi" | "loro";

export type ConjugationPattern = {
  [key in PersonType]: string;
};

export type VerbType = "all" | "are" | "ere" | "ire" | "ire-isc";

export type Verb = {
  infinitive: string;
  meaning: string;
  type: Exclude<VerbType, "all">;
  conjugations: ConjugationPattern;
};

export type VerbGroup = {
  type: Exclude<VerbType, "all">;
  pattern: ConjugationPattern;
  description: string;
};
