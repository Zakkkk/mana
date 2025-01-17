import { Corpus, TokenFreq } from "./types";
import * as fs from "fs";

import readFileByStream from "./readFile";

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

  /*
  bigram words
  trigram starts
  fougrams
  */

  const monograms: Record<string, number> = {};
  const bigramWords: Record<string, number> = {};
  const trigramWords: Record<string, number> = {};
  const fourgrams: Record<string, number> = {};

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

      for (let j = 0; j < word.length; j++) addGram(word[j], monograms);

      if (word.length == 2) {
        addGram(word, bigramWords);
      } else if (word.length == 3) {
        addGram(word, trigramWords);
      } else if (word.length > 3) {
        for (let i = 0; i < word.length; i++) {
          const currentChar = word[i];
          const getChar = (d: number) =>
            word[i + d] != undefined ? word[i + d] : "";

          const prev1Char = getChar(-1);
          const prev2Char = getChar(-2);
          const prev3Char = getChar(-3);

          const trigramWord = prev2Char + prev1Char + currentChar;
          const fourgram = prev3Char + trigramWord;

          if (fourgram.length == 3) addGram(trigramWord, trigramWords);
          if (fourgram.length == 4) addGram(fourgram, fourgrams);
        }
      }
    }
  });

  const corpus: Corpus = {
    name: corpusName,
    monograms: monograms,
    bigramWords: bigramWords,
    trigramWords: trigramWords,
    fourgrams: fourgrams,
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
