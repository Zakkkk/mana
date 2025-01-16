import * as fs from "fs";

import { Corpus, GlobalSettings } from "./types";

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

const setCorpusPositionByName = async (
  corpusName: string,
  gs: GlobalSettings,
): Promise<boolean> => {
  for (let i = 0; i < gs.loadedCorpora.length; i++) {
    if (gs.loadedCorpora[i].name == corpusName) {
      gs.currentCorpora = i;
      console.log(`Corpus has been set to ${corpusName}!`);
      return true;
    }
  }

  const newCorpus = loadCorpus(corpusName);
  if (typeof newCorpus === "number") return false;
  else if (newCorpus.name == corpusName) {
    gs.loadedCorpora.push(newCorpus);
    gs.currentCorpora = gs.loadedCorpora.length - 1;
    console.log(`Corpus has been set to ${corpusName}!`);

    return true;
  }

  return false;
};

export { loadCorpus, setCorpusPositionByName };
