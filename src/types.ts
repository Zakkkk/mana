type Command = {
  token: string;
  args: number;
  action: (args: string[]) => void;
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

type Layout = {
  name: string;
  rows: string[];
};

export { Command, TokenFreq, Corpus, Layout };
