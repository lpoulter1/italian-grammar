export type PersonType = "io" | "tu" | "lui" | "noi" | "voi" | "loro";

export type ConjugationPattern = {
  [key in PersonType]: string;
};

export type BaseVerbType = "are" | "ere" | "ire" | "ire-isc";
export type VerbType = BaseVerbType | "all";

export type Verb = {
  infinitive: string;
  meaning: string;
  type: BaseVerbType;
  conjugations: ConjugationPattern;
};

export type VerbGroup = {
  type: BaseVerbType;
  pattern: ConjugationPattern;
  description: string;
};
