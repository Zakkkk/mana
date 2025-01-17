import { Corpus, TokenFreq, Layout } from "./types";

// const addGram = (gram: string, grams: TokenFreq[]) => {
//   for (let i = 0; i < grams.length; i++) {
//     if (grams[i].value == gram) {
//       grams[i].freq++;
//       return;
//     }
//   }

//   grams.push({ value: gram, freq: 1 });
// };

const getBigrams = (corpus: Corpus): TokenFreq[] => {
  const bigrams: TokenFreq[] = [];

  // bigrams.push(...corpus.bigramWords);

  return bigrams;
};

const getTrigrams = (corpus: Corpus, layout: Layout): TokenFreq[] => {
  const trigrams: TokenFreq[] = [];

  // trigrams.push(...corpus.trigramWords);

  // for (let i = 0; i < corpus.fourgrams.length; i++) {
  //   const fourgram: TokenFreq = corpus.fourgrams[i];
  // }

  return trigrams;
};

export { getBigrams, getTrigrams };
