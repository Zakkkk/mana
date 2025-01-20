import { getBigrams } from "./corpusUtil";
import { mismatchingLetters } from "./getStats";

import { Corpus, Layout, TokenFreq } from "./types";

const getSfbs = (layout: Layout, corpus: Corpus): TokenFreq => {
  const sfbs: TokenFreq = {};

  const bigrams = getBigrams(corpus, layout);
  let bigramTotal = 0;

  const fingerKeyMap: Record<string, number> = {};

  for (let i = 0; i < layout.rows.length; i++)
    for (let j = 0; j < layout.rows[i].length; j++)
      fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);

  for (const bigram in bigrams) {
    if (!mismatchingLetters(bigram, [...layout.rows].join(""))) {
      bigramTotal += bigrams[bigram];
    } else delete bigrams[bigram];
  }

  for (const bigram in bigrams) {
    if (
      fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
      bigram[0] != bigram[1]
    )
      if (bigrams[bigram] != undefined)
        sfbs[bigram] = bigrams[bigram] / bigramTotal;
  }

  const sortedSfb = Object.fromEntries(
    Object.entries(sfbs).sort(([, a], [, b]) => b - a), // Sort by value in descending order
  );

  const topSortedSfb: TokenFreq = {};
  let i = 0;
  for (const sfb in sortedSfb) {
    topSortedSfb[sfb] = sortedSfb[sfb];

    i++;
    if (i >= 20) break;
  }

  return topSortedSfb;
};

export default getSfbs;
