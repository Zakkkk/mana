import { Corpus } from "../types";
import * as fs from "fs";

import readFileByStream from "../util/readFile";

const parse = async (filename: string, corpusName: string) => {
  const keySwaps: string[][] = [
    ["´", "'"],
    ["‘", "'"],
    ["’", "'"],
    ["÷", "/"],
    ["‐", "-"],
    ["–", "-"],
    ["—", "-"],
    ["«", "'"],
    ["»", "'"],
    ["“", "'"],
    ["”", "'"],
    ["…", ". . ."],
  ];

  const extendedMonograms: Record<string, number> = {};
  const extendedBigrams: Record<string, number> = {};
  const extendedTrigrams: Record<string, number> = {};
  const extendedSkip2gram: Record<string, number> = {};

  const addGram = (gram: string, ngram: Record<string, number>) => {
    if (gram in ngram) ngram[gram] += 1;
    else ngram[gram] = 1;
  };

  await readFileByStream(`corpus/${filename}`, (line) => {
    keySwaps.forEach((swap) => (line = line.replace(swap[0], swap[1])));
    line = line.toLowerCase();

    const words = line.split(" ");

    for (let k = 0; k < words.length; k++) {
      const word = words[k];

      for (let i = 0; i < word.length; i++) {
        const currentChar = word[i];
        const getChar = (d: number) =>
          word[i + d] != undefined ? word[i + d] : "";

        const prev1Char = getChar(-1);
        const prev2Char = getChar(-2);
        const prev3Char = getChar(-3);
        const prev4Char = getChar(-4);

        // Extended Monograms
        if (i == 0) addGram(currentChar, extendedMonograms);
        if (i > 0) addGram(prev1Char + currentChar, extendedMonograms);

        // Extended Bigrams
        if (i == 1) addGram(prev1Char + currentChar, extendedBigrams);
        if (i > 1)
          addGram(prev2Char + prev1Char + currentChar, extendedBigrams);

        // Extended Trigrams
        if (i == 2)
          addGram(prev2Char + prev1Char + currentChar, extendedTrigrams);
        if (i > 2)
          addGram(
            prev3Char + prev2Char + prev1Char + currentChar,
            extendedTrigrams,
          );

        // Extended Skip2grams
        if (i == 3)
          addGram(prev3Char + prev1Char + currentChar, extendedSkip2gram);
        if (i > 3)
          addGram(
            prev4Char + prev3Char + prev1Char + currentChar,
            extendedSkip2gram,
          );
      }
    }
  });

  const corpus: Corpus = {
    name: corpusName,
    extendedMonograms: extendedMonograms,
    extendedBigrams: extendedBigrams,
    extendedTrigrams: extendedTrigrams,
    extendedSkip2grams: extendedSkip2gram,
  };

  console.log("Corpus parsed!");

  try {
    fs.writeFileSync(`parsed/${corpusName}.json`, JSON.stringify(corpus), {
      flag: "w",
    });

    console.log("Corpus file written!");
  } catch (err) {
    console.log("There was an error writing the corpus file.");

    console.error(err);
  }
};

export default parse;
