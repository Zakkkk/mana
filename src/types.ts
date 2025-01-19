export type Command = {
  token: string;
  explain: string;
  args: number;
  action: (settings: GlobalSettings, args: string[]) => void;
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

type MagicRule = {
  activator: string;
  transformTo: string;
};

export type Layout = {
  name: string;
  rows: string[];
  fingermap: string[];
  hasMagic: boolean;
  magicIdentifier: string;
  magicRules: MagicRule[];
};

export type LayoutStats = {
  heatmapScore?: number;
  handbalanceScore?: number;
  scissorScore?: number;
  inroll?: number;
  outroll?: number;
  in3roll?: number;
  out3roll?: number;
  alternate?: number;
  redirect?: number;
  redirectWeak?: number;
  sfs?: number;
  sfs2?: number;
  sfb?: number;
  sfr?: number;
  lsb?: number;
  lss?: number;
};

export type LayoutStatOptions = {
  [K in keyof LayoutStats]?: boolean;
};
