import {
  LayoutStats,
  LayoutStatOptions,
  Layout,
  Corpus,
  TokenFreq,
} from "./types";

import {
  getMonograms,
  getBigrams,
  getTrigrams,
  getSkip2grams,
} from "./corpusUtil";

const getStats = (
  layout: Layout,
  corpus: Corpus,
  chosenStats: LayoutStatOptions,
): LayoutStats => {
  const stats: LayoutStats = {};

  const fingerKeyMap: Record<string, number> = {};

  for (let i = 0; i < layout.rows.length; i++)
    for (let j = 0; j < layout.rows[i].length; j++)
      fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);

  let monograms: TokenFreq = {};
  let bigrams: TokenFreq = {};
  let trigrams: TokenFreq = {};
  let skip2grams: TokenFreq = {};

  if (chosenStats.heatmapScore || chosenStats.handbalanceScore) {
    monograms = getMonograms(corpus, layout);

    let total = 0;

    for (const monogram in monograms) total += monograms[monogram];
    for (const monogram in monograms) monograms[monogram] /= total;
  }

  if (chosenStats.lsb || chosenStats.scissorScore || chosenStats.sfb)
    bigrams = getBigrams(corpus, layout);

  if (
    chosenStats.alternate ||
    chosenStats.in3roll ||
    chosenStats.inroll ||
    chosenStats.lss ||
    chosenStats.out3roll ||
    chosenStats.outroll ||
    chosenStats.redirect ||
    chosenStats.redirectWeak
  )
    trigrams = getTrigrams(corpus, layout);

  if (chosenStats.sfs2) skip2grams = getSkip2grams(corpus, layout);

  if (chosenStats.heatmapScore) {
    stats.heatmapScore = 0;

    const heatmap: number[][] = [
      [0.65, 0.85, 0.85, 0.65, 0.6, 0.7, 0.75, 0.95, 0.95, 0.75],
      [0.85, 0.9, 0.9, 0.9, 0.7, 0.8, 1.0, 1.0, 1.0, 0.95],
      [0.65, 0.5, 0.65, 0.75, 0.65, 0.75, 0.85, 0.75, 0.6, 0.75],
      [1],
    ];

    for (let i = 0; i < layout.rows.length; i++)
      for (let j = 0; j < layout.rows[i].length; j++) {
        const freq =
          monograms[layout.rows[i][j]] == undefined
            ? 0
            : monograms[layout.rows[i][j]];

        stats.heatmapScore += freq * heatmap[i][j];
      }
  }

  return stats;
};

export default getStats;
