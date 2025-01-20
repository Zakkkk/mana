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

import {
  getAlternates,
  getIn3roll,
  getInrolls,
  getOut3roll,
  getOutrolls,
  getRedirects,
  getRedirectWeaks,
  getSfbs,
  getSfr,
  getSfs,
  getSfs2,
  getSfsr,
} from "./rules";

export const getFingerKeyMap = (layout: Layout): Record<string, number> => {
  const fingerKeyMap: Record<string, number> = {};
  for (let i = 0; i < layout.rows.length; i++)
    for (let j = 0; j < layout.rows[i].length; j++)
      fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);
  return fingerKeyMap;
};

const getStats = (
  layout: Layout,
  corpus: Corpus,
  chosenStats: LayoutStatOptions,
): LayoutStats => {
  const stats: LayoutStats = {};

  const fingerKeyMap: Record<string, number> = getFingerKeyMap(layout);

  let monograms: TokenFreq = {};
  let bigrams: TokenFreq = {};
  let trigrams: TokenFreq = {};
  let skip2grams: TokenFreq = {};

  if (chosenStats.heatmapScore || chosenStats.handbalanceScore) {
    monograms = getMonograms(corpus, layout);
  }

  if (
    chosenStats.lsb ||
    chosenStats.fullScissors ||
    chosenStats.halfScissors ||
    chosenStats.sfb ||
    chosenStats.sfr
  ) {
    bigrams = getBigrams(corpus, layout);
  }

  if (
    chosenStats.alternate ||
    chosenStats.in3roll ||
    chosenStats.inroll ||
    chosenStats.lss ||
    chosenStats.out3roll ||
    chosenStats.outroll ||
    chosenStats.redirect ||
    chosenStats.redirectWeak
  ) {
    trigrams = getTrigrams(corpus, layout);
  }

  if (chosenStats.sfs2) {
    skip2grams = getSkip2grams(corpus, layout);
  }

  if (chosenStats.heatmapScore) {
    stats.heatmapScore = 0;

    const heatmap: number[][] = [
      [0.65, 0.85, 0.85, 0.65, 0.6, 0.7, 0.75, 0.95, 0.95, 0.75],
      [0.85, 0.9, 0.9, 0.9, 0.7, 0.8, 1.0, 1.0, 1.0, 0.95, 0.65],
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

    // based on the lowest score being a 0.5 (lowest heatmap score)
    // and the highest score being a 1
    // so this remaps it to 0-1
    stats.heatmapScore -= 0.5;
    stats.heatmapScore *= 2;
  }

  if (chosenStats.handbalanceScore) {
    let lefthand = 0;
    let total = 0;

    for (let i = 0; i < layout.rows.length; i++)
      for (let j = 0; j < layout.rows[i].length; j++) {
        if (fingerKeyMap[layout.rows[i][j]] < 4)
          if (monograms[layout.rows[i][j]] != undefined)
            lefthand += monograms[layout.rows[i][j]];

        if (
          monograms[layout.rows[i][j]] != undefined &&
          (fingerKeyMap[layout.rows[i][j]] < 4 ||
            fingerKeyMap[layout.rows[i][j]] > 5)
        )
          total += monograms[layout.rows[i][j]];
      }

    lefthand /= total;

    stats.handbalanceScore = lefthand;
  }

  // need to do scissors, lsb, ss

  if (chosenStats.sfb) {
    let sfbTotal = 0;
    for (const sfb in getSfbs(bigrams, fingerKeyMap)) sfbTotal += bigrams[sfb];
    stats.sfb = sfbTotal;
  }

  if (chosenStats.sfr) {
    let sfrTotal = 0;
    for (const sfr in getSfr(bigrams, fingerKeyMap)) sfrTotal += bigrams[sfr];
    stats.sfr = sfrTotal;
  }

  if (chosenStats.sfs) {
    let sfsTotal = 0;
    const sfsAmounts = getSfs(trigrams, fingerKeyMap);
    for (const sfs in sfsAmounts) sfsTotal += sfsAmounts[sfs];
    stats.sfs = sfsTotal;
  }

  if (chosenStats.sfs2) {
    let sfs2Total = 0;
    for (const sfs2 in getSfs2(skip2grams, fingerKeyMap))
      sfs2Total += skip2grams[sfs2];
    stats.sfs2 = sfs2Total;
  }

  if (chosenStats.sfsr) {
    let sfsrTotal = 0;
    for (const sfsr in getSfsr(trigrams, fingerKeyMap))
      sfsrTotal += trigrams[sfsr];
    stats.sfsr = sfsrTotal;
  }

  if (chosenStats.alternate) {
    let altTotal = 0;
    for (const alt in getAlternates(trigrams, fingerKeyMap))
      altTotal += trigrams[alt];
    stats.alternate = altTotal;
  }

  if (chosenStats.redirect) {
    let redirectTotal = 0;
    for (const redirect in getRedirects(trigrams, fingerKeyMap))
      redirectTotal += trigrams[redirect];
    stats.redirect = redirectTotal;
  }

  if (chosenStats.redirectWeak) {
    let redirectWeakTotal = 0;
    for (const redirectWeak in getRedirectWeaks(trigrams, fingerKeyMap))
      redirectWeakTotal += trigrams[redirectWeak];
    stats.redirectWeak = redirectWeakTotal;
  }

  if (chosenStats.inroll) {
    let inrollTotal = 0;
    for (const inroll in getInrolls(trigrams, fingerKeyMap))
      inrollTotal += trigrams[inroll];
    stats.inroll = inrollTotal;
  }

  if (chosenStats.outroll) {
    let outrollTotal = 0;
    for (const outroll in getOutrolls(trigrams, fingerKeyMap))
      outrollTotal += trigrams[outroll];
    stats.outroll = outrollTotal;
  }

  if (chosenStats.in3roll) {
    let in3rollTotal = 0;
    for (const in3roll in getIn3roll(trigrams, fingerKeyMap))
      in3rollTotal += trigrams[in3roll];
    stats.in3roll = in3rollTotal;
  }

  if (chosenStats.out3roll) {
    let out3rollTotal = 0;
    for (const out3roll in getOut3roll(trigrams, fingerKeyMap))
      out3rollTotal += trigrams[out3roll];
    stats.out3roll = out3rollTotal;
  }

  return stats;
};

export default getStats;
