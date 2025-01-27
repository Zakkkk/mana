export type Command = {
  token: string;
  explain: string;
  minArgs?: number;
  maxArgs?: number;
  action: (settings: GlobalSettings, args: string[]) => any | void;
};

export type GlobalSettings = {
  loadedCorpora: Corpus[];
  currentCorpora: number;
  loadedLayouts: Layout[];
};

export type TokenFreq = Record<string, number>;

export type Corpus = {
  name: string;
  extendedMonograms: TokenFreq;
  extendedBigrams: TokenFreq;
  extendedTrigrams: TokenFreq;
  extendedSkip2grams: TokenFreq;
};

export type MagicRule = string;

export type Layout = {
  name: string;
  rows: string[];
  fingermap: string[];
  hasMagic: boolean;
  magicIdentifier: string;
  magicRules: MagicRule[];
};

export type LayoutStats = {
  // Monogram Data
  heatmapScore?: number;
  handbalanceScore?: number;
  fingerFreq?: number[];
  // Bigram Data
  sfb?: number;
  sfr?: number;
  lsb?: number;
  fullScissors?: number;
  halfScissors?: number;
  // Trigram Data
  inroll?: number;
  outroll?: number;
  in3roll?: number;
  out3roll?: number;
  alternate?: number;
  redirect?: number;
  redirectWeak?: number;
  lss?: number;
  sfs?: number;
  sfsr?: number;
  skipFullScissors?: number;
  skipHalfScissors?: number;
  // 2Skip Data
  sfs2?: number;
  lss2?: number;
  skip2FullScissors?: number;
  skip2HalfScissors?: number;
};

export type LayoutStatOptions = {
  [K in keyof LayoutStats]?: boolean;
};
