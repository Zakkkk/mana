import * as fs from "fs";

import { Corpus, GlobalSettings } from "../types";

export const loadCorpus = (
  corpusName: string,
  overWriteDefaut?: boolean,
): Corpus | number => {
  let data;

  try {
    data = JSON.parse(fs.readFileSync(`parsed/${corpusName}.json`, "utf8"));

    if (overWriteDefaut != false)
      try {
        fs.writeFileSync(`defaultLoadCorpus`, corpusName, {
          flag: "w",
        });
      } catch {}
  } catch (err) {
    // console.error(err);
    return -1;
  }

  let corpus: Corpus = {
    name: data.name,
    extendedMonograms: data.extendedMonograms,
    extendedBigrams: data.extendedBigrams,
    extendedTrigrams: data.extendedTrigrams,
    extendedSkip2grams: data.extendedSkip2grams,
  };

  return corpus;
};

const setCorpusPositionByName = async (
  corpusName: string,
  gs: GlobalSettings,
  overWriteDefault?: boolean,
): Promise<boolean> => {
  for (let i = 0; i < gs.loadedCorpora.length; i++) {
    if (gs.loadedCorpora[i].name == corpusName) {
      gs.currentCorpora = i;
      console.log(`Corpus has been set to ${corpusName}!`);
      return true;
    }
  }

  const newCorpus = loadCorpus(corpusName, overWriteDefault);
  if (typeof newCorpus === "number") return false;
  else if (newCorpus.name == corpusName) {
    gs.loadedCorpora.push(newCorpus);
    gs.currentCorpora = gs.loadedCorpora.length - 1;
    console.log(`Corpus has been set to ${corpusName}!`);

    return true;
  }

  return false;
};

export default setCorpusPositionByName;
