import * as fs from "fs";

import { Corpus } from "./types";

const loadCorpus = (corpusName: string): Corpus | number => {
  let data;

  try {
    data = JSON.parse(fs.readFileSync(`parsed/${corpusName}.json`, "utf8"));
  } catch (err) {
    console.error(err);
    return -1;
  }

  let corpus: Corpus = {
    name: data.name,
    monograms: data.monograms,
    bigramWords: data.bigramWords,
    trigramWords: data.trigramWords,
    fourgrams: data.fourgrams,
  };

  return corpus;
};

const getCorpusPositionByName = (
  corpusName: string,
  loadedCorpora: Corpus[],
): number => {
  for (let i = 0; i < loadedCorpora.length; i++) {
    if (loadedCorpora[i].name == corpusName) return i;
  }

  const newCorpus = loadCorpus(corpusName);
  if (typeof newCorpus === "number") return -1;
  else if (newCorpus.name == corpusName) {
    loadedCorpora.push(newCorpus);
    return loadedCorpora.length - 1;
  }

  return -1;
};

export { loadCorpus, getCorpusPositionByName };
