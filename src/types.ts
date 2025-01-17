type Command = {
  token: string;
  explain: string;
  args: number;
  action: (settings: GlobalSettings, args: string[]) => void;
};

type GlobalSettings = {
  loadedCorpora: Corpus[];
  currentCorpora: number;
  loadedLayouts: Layout[];
};

type TokenFreq = Record<string, number>;

type Corpus = {
  name: string;
  monograms: TokenFreq;
  bigramWords: TokenFreq;
  trigramWords: TokenFreq;
  fourgrams: TokenFreq;
};

type MagicRule = {
  activator: string;
  transformTo: string;
};

type Layout = {
  name: string;
  rows: string[];
  fingermap: string[];
  hasMagic: boolean;
  magicIdentifier: string;
  magicRules: MagicRule[];
};

type LayoutStats = {
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
  sfb?: number;
  lsb?: number;
  lss?: number;
};

export { Command, TokenFreq, Corpus, Layout, GlobalSettings, LayoutStats };
