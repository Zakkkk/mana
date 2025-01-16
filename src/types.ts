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

type TokenFreq = {
  value: string;
  freq: number;
};

type Corpus = {
  name: string;
  monograms: TokenFreq[];
  bigramWords: TokenFreq[];
  trigramWords: TokenFreq[];
  fourgrams: TokenFreq[];
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

export { Command, TokenFreq, Corpus, Layout, GlobalSettings };
