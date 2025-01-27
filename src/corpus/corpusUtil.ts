import { Corpus, TokenFreq, Layout } from "../types";

const addGramAmount = (
  gram: string,
  amount: number,
  ngram: Record<string, number>,
) => {
  if (gram in ngram) ngram[gram] += amount;
  else ngram[gram] = amount;
};

export const mismatchingLetters = (
  stringToCheck: string,
  allowedLetters: string,
): boolean =>
  [...stringToCheck].some((letter) => !allowedLetters.includes(letter));

const getMonograms = (corpus: Corpus, layout: Layout): TokenFreq => {
  const monograms: TokenFreq = {};

  if (!layout.hasMagic) {
    // figure this out later
    // return monograms;
  }

  for (let extendedMonogram in corpus.extendedMonograms) {
    const freq = corpus.extendedMonograms[extendedMonogram];

    if (extendedMonogram.length == 2) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedMonogram[0] &&
          magicRule[1] == extendedMonogram[1]
        )
          extendedMonogram = layout.magicIdentifier;
      });
    }

    if (extendedMonogram.length == 2) extendedMonogram = extendedMonogram[1];
    addGramAmount(extendedMonogram, freq, monograms);
  }

  let total = 0;

  for (const monogram in monograms) total += monograms[monogram];
  for (const monogram in monograms) monograms[monogram] /= total;

  return monograms;
};

const getBigrams = (corpus: Corpus, layout: Layout): TokenFreq => {
  const bigrams: TokenFreq = {};

  if (!layout.hasMagic) {
    // figure this out later
    // return bigrams;
  }

  for (let extendedBigram in corpus.extendedBigrams) {
    const freq = corpus.extendedBigrams[extendedBigram];

    if (extendedBigram.length == 2) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedBigram[0] &&
          magicRule[1] == extendedBigram[1]
        )
          extendedBigram = extendedBigram[0] + layout.magicIdentifier;
      });
    } else if (extendedBigram.length == 3) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedBigram[0] &&
          magicRule[1] == extendedBigram[1]
        )
          extendedBigram = layout.magicIdentifier + extendedBigram[2];
        else if (
          magicRule[0] == extendedBigram[1] &&
          magicRule[1] == extendedBigram[2]
        )
          extendedBigram = extendedBigram[1] + layout.magicIdentifier;
      });
    }

    if (extendedBigram.length == 3) extendedBigram = extendedBigram.slice(1, 3);
    addGramAmount(extendedBigram, freq, bigrams);
  }

  let bigramTotal = 0;

  for (const bigram in bigrams) {
    if (!mismatchingLetters(bigram, [...layout.rows].join(""))) {
      bigramTotal += bigrams[bigram];
    } else delete bigrams[bigram];
  }

  for (const bigram in bigrams) {
    bigrams[bigram] /= bigramTotal;
  }

  return bigrams;
};

const getTrigrams = (corpus: Corpus, layout: Layout): TokenFreq => {
  const trigrams: TokenFreq = {};

  if (!layout.hasMagic) {
    // figure this out later
    // return trigrams;
  }

  for (let extendedTrigram in corpus.extendedTrigrams) {
    const freq = corpus.extendedTrigrams[extendedTrigram];

    if (extendedTrigram.length == 3) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedTrigram[0] &&
          magicRule[1] == extendedTrigram[1]
        )
          extendedTrigram =
            extendedTrigram[0] + layout.magicIdentifier + extendedTrigram[2];
        else if (
          magicRule[0] == extendedTrigram[1] &&
          magicRule[1] == extendedTrigram[2]
        )
          extendedTrigram =
            extendedTrigram[0] + extendedTrigram[1] + layout.magicIdentifier;
      });
    } else if (extendedTrigram.length == 4) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedTrigram[0] &&
          magicRule[1] == extendedTrigram[1]
        )
          extendedTrigram =
            extendedTrigram[0] +
            layout.magicIdentifier +
            extendedTrigram[2] +
            extendedTrigram[3];
        if (
          magicRule[0] == extendedTrigram[1] &&
          magicRule[1] == extendedTrigram[2]
        )
          extendedTrigram =
            extendedTrigram[0] +
            extendedTrigram[1] +
            layout.magicIdentifier +
            extendedTrigram[3];
        if (
          magicRule[0] == extendedTrigram[2] &&
          magicRule[1] == extendedTrigram[3]
        )
          extendedTrigram =
            extendedTrigram[0] +
            extendedTrigram[1] +
            extendedTrigram[2] +
            layout.magicIdentifier;
      });
    }

    if (extendedTrigram.length == 4)
      extendedTrigram = extendedTrigram.slice(1, 4);
    addGramAmount(extendedTrigram, freq, trigrams);
  }

  let trigramTotal = 0;

  for (const trigram in trigrams) {
    if (!mismatchingLetters(trigram, [...layout.rows].join(""))) {
      trigramTotal += trigrams[trigram];
    } else delete trigrams[trigram];
  }

  for (const trigram in trigrams) {
    trigrams[trigram] /= trigramTotal;
  }

  return trigrams;
};

const getSkip2grams = (corpus: Corpus, layout: Layout): TokenFreq => {
  const skip2grams: TokenFreq = {};

  if (!layout.hasMagic) {
    // figure this out later
    // return skip2grams;
  }

  for (let extendedSkip2gram in corpus.extendedSkip2grams) {
    const freq = corpus.extendedSkip2grams[extendedSkip2gram];
    let parts = [extendedSkip2gram[0], extendedSkip2gram[1]];

    if (extendedSkip2gram.length == 3) {
      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedSkip2gram[1] &&
          magicRule[1] == extendedSkip2gram[2]
        )
          parts = [extendedSkip2gram[0], layout.magicIdentifier];
        else parts = [extendedSkip2gram[0], extendedSkip2gram[2]];
      });
    } else if (extendedSkip2gram.length == 4) {
      parts = [extendedSkip2gram[1], extendedSkip2gram[3]];

      layout.magicRules.forEach((magicRule) => {
        if (
          magicRule[0] == extendedSkip2gram[0] &&
          magicRule[1] == extendedSkip2gram[1]
        )
          parts[0] = layout.magicIdentifier;

        if (
          magicRule[0] == extendedSkip2gram[2] &&
          magicRule[1] == extendedSkip2gram[3]
        )
          parts[1] = layout.magicIdentifier;
      });
    }

    addGramAmount(parts.join(""), freq, skip2grams);
  }

  let skip2gramtotal = 0;

  for (const skip2gram in skip2grams) {
    if (!mismatchingLetters(skip2gram, [...layout.rows].join(""))) {
      skip2gramtotal += skip2grams[skip2gram];
    } else delete skip2grams[skip2gram];
  }

  for (const skip2gram in skip2grams) {
    skip2grams[skip2gram] /= skip2gramtotal;
  }

  return skip2grams;
};

export { getMonograms, getBigrams, getTrigrams, getSkip2grams };
