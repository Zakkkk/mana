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

  for (let extendedMonogram in corpus.extendedMonograms) {
    const freq = corpus.extendedMonograms[extendedMonogram];

    let magicReplacements = 0;
    if (layout.hasMagic)
      for (let i = 0; i < layout.magicRules.length; i++) {
        const replacement = extendedMonogram.replaceAll(
          layout.magicRules[i],
          layout.magicRules[i][0] + layout.magicIdentifier,
        );

        if (replacement != extendedMonogram) {
          extendedMonogram = replacement;
          magicReplacements++;

          if (magicReplacements == 1) break;
        }
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

  for (let extendedBigram in corpus.extendedBigrams) {
    const freq = corpus.extendedBigrams[extendedBigram];

    let magicReplacements = 0;
    if (layout.hasMagic)
      for (let i = 0; i < layout.magicRules.length; i++) {
        const replacement = extendedBigram.replaceAll(
          layout.magicRules[i],
          layout.magicRules[i][0] + layout.magicIdentifier,
        );

        if (replacement != extendedBigram) {
          extendedBigram = replacement;
          magicReplacements++;

          if (magicReplacements == 1) break;
        }
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

  for (let extendedTrigram in corpus.extendedTrigrams) {
    const freq = corpus.extendedTrigrams[extendedTrigram];

    let magicReplacements = 0;
    if (layout.hasMagic)
      for (let i = 0; i < layout.magicRules.length; i++) {
        const replacement = extendedTrigram.replaceAll(
          layout.magicRules[i],
          layout.magicRules[i][0] + layout.magicIdentifier,
        );

        if (replacement != extendedTrigram) {
          extendedTrigram = replacement;
          magicReplacements++;

          if (magicReplacements == 2) break;
        }
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

  for (let extendedSkip2gram in corpus.extendedSkip2grams) {
    const freq = corpus.extendedSkip2grams[extendedSkip2gram];

    let magicReplacements = 0;
    if (layout.hasMagic)
      for (let i = 0; i < layout.magicRules.length; i++) {
        const parts = [...extendedSkip2gram];
        const part2 = parts.splice(parts.length - 2, 3).join("");
        const part1 = parts.join("");

        const replacement =
          part1.replaceAll(
            layout.magicRules[i],
            layout.magicRules[i][0] + layout.magicIdentifier,
          ) +
          part2.replaceAll(
            layout.magicRules[i],
            layout.magicRules[i][0] + layout.magicIdentifier,
          );

        if (replacement != extendedSkip2gram) {
          extendedSkip2gram = replacement;
          magicReplacements++;

          // if (magicReplacements == 2) break;
        }
      }

    if (extendedSkip2gram.length == 3)
      extendedSkip2gram = [extendedSkip2gram[0], extendedSkip2gram[2]].join("");
    else if (extendedSkip2gram.length == 4)
      extendedSkip2gram = [extendedSkip2gram[1], extendedSkip2gram[3]].join("");

    addGramAmount(extendedSkip2gram, freq, skip2grams);
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
