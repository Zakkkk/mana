"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrigrams = exports.getBigrams = void 0;
const addGram = (gram, ngram) => {
    if (gram in ngram)
        ngram[gram] += 1;
    else
        ngram[gram] = 1;
};
const getBigrams = (corpus) => {
    const bigrams = [];
    // bigrams.push(...corpus.bigramWords);
    return bigrams;
};
exports.getBigrams = getBigrams;
const getTrigrams = (corpus, layout) => {
    const trigrams = [];
    // trigrams.push(...corpus.trigramWords);
    // for (let i = 0; i < corpus.fourgrams.length; i++) {
    //   const fourgram: TokenFreq = corpus.fourgrams[i];
    // }
    return trigrams;
};
exports.getTrigrams = getTrigrams;
