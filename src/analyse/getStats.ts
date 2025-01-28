import {
  LayoutStats,
  LayoutStatOptions,
  Layout,
  Corpus,
  TokenFreq,
} from "../types";

import {
  getMonograms,
  getBigrams,
  getTrigrams,
  getSkip2grams,
} from "../corpus/corpusUtil";

import {
  getAlternates,
  getFullScissors,
  getHalfScissors,
  getSkipFullScissors,
  getSkipHalfScissors,
  getIn3roll,
  getInrolls,
  getLsb,
  getLss,
  getOut3roll,
  getOutrolls,
  getRedirects,
  getRedirectWeaks,
  getSfbs,
  getSfr,
  getSfs,
  getSfsr,
  getHeatmap,
  getHandBalance,
  getFingerFreq,
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

  if (
    chosenStats.heatmapScore ||
    chosenStats.handbalanceScore ||
    chosenStats.fingerFreq
  )
    monograms = getMonograms(corpus, layout);

  if (
    chosenStats.lsb ||
    chosenStats.fullScissors ||
    chosenStats.halfScissors ||
    chosenStats.sfb ||
    chosenStats.sfr
  )
    bigrams = getBigrams(corpus, layout);

  if (
    chosenStats.alternate ||
    chosenStats.in3roll ||
    chosenStats.inroll ||
    chosenStats.lss ||
    chosenStats.out3roll ||
    chosenStats.outroll ||
    chosenStats.redirect ||
    chosenStats.redirectWeak ||
    chosenStats.skipFullScissors ||
    chosenStats.skipHalfScissors
  )
    trigrams = getTrigrams(corpus, layout);

  if (
    chosenStats.sfs2 ||
    chosenStats.skip2FullScissors ||
    chosenStats.skip2HalfScissors ||
    chosenStats.lss2
  )
    skip2grams = getSkip2grams(corpus, layout);

  if (chosenStats.fingerFreq)
    stats.fingerFreq = getFingerFreq(monograms, fingerKeyMap);

  if (chosenStats.heatmapScore) {
    stats.heatmapScore = getHeatmap(monograms, layout);
  }

  if (chosenStats.handbalanceScore) {
    stats.handbalanceScore = getHandBalance(monograms, fingerKeyMap, layout);
  }

  if (chosenStats.sfb) {
    let sfbTotal = 0;
    for (const sfb in getSfbs(bigrams, fingerKeyMap)) sfbTotal += bigrams[sfb];
    stats.sfb = sfbTotal;
  }

  if (chosenStats.lsb) {
    let lsbTotal = 0;
    for (const lsb in getLsb(bigrams, fingerKeyMap, layout))
      lsbTotal += bigrams[lsb];
    stats.lsb = lsbTotal;
  }

  if (chosenStats.lss) {
    let lssTotal = 0;
    const lssAmounts = getLss(trigrams, fingerKeyMap, layout);
    for (const lss in lssAmounts) lssTotal += lssAmounts[lss];
    stats.lss = lssTotal;
  }

  if (chosenStats.lss2) {
    let lss2Total = 0;
    for (const lss2 in getLsb(skip2grams, fingerKeyMap, layout))
      lss2Total += skip2grams[lss2];
    stats.lss2 = lss2Total;
  }

  if (chosenStats.halfScissors) {
    let hsTotal = 0;
    for (const hs in getHalfScissors(bigrams, fingerKeyMap, layout))
      hsTotal += bigrams[hs];
    stats.halfScissors = hsTotal;
  }

  if (chosenStats.fullScissors) {
    let fsTotal = 0;
    for (const fs in getFullScissors(bigrams, fingerKeyMap, layout))
      fsTotal += bigrams[fs];
    stats.fullScissors = fsTotal;
  }

  if (chosenStats.skipHalfScissors) {
    let hssTotal = 0;
    const hssAmounts = getSkipHalfScissors(trigrams, fingerKeyMap, layout);
    for (const hss in hssAmounts) hssTotal += hssAmounts[hss];
    stats.skipHalfScissors = hssTotal;
  }

  if (chosenStats.skipFullScissors) {
    let fssTotal = 0;
    const fssAmounts = getSkipFullScissors(trigrams, fingerKeyMap, layout);
    for (const fss in fssAmounts) fssTotal += fssAmounts[fss];
    stats.skipFullScissors = fssTotal;
  }

  if (chosenStats.skip2HalfScissors) {
    let hss2Total = 0;
    for (const hss2 in getHalfScissors(skip2grams, fingerKeyMap, layout))
      hss2Total += skip2grams[hss2];
    stats.skip2HalfScissors = hss2Total;
  }

  if (chosenStats.skip2FullScissors) {
    let fss2Total = 0;
    for (const fss2 in getFullScissors(skip2grams, fingerKeyMap, layout))
      fss2Total += skip2grams[fss2];
    stats.skip2FullScissors = fss2Total;
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
    for (const sfs2 in getSfbs(skip2grams, fingerKeyMap))
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
