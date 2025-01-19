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

const getHand = (finger: number): number => (finger < 5 ? 0 : 1);

const mismatchingLetters = (
  stringToCheck: string,
  allowedLetters: string,
): boolean =>
  [...stringToCheck].some((letter) => !allowedLetters.includes(letter));

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

  const getHandFromKey = (key: string) => getHand(fingerKeyMap[key]);
  const isThumb = (key: string): boolean =>
    fingerKeyMap[key] == 4 || fingerKeyMap[key] == 5;

  let monograms: TokenFreq = {};
  let bigrams: TokenFreq = {};
  let bigramTotal = 0;
  let trigrams: TokenFreq = {};
  let trigramTotal = 0;
  let skip2grams: TokenFreq = {};
  let skip2gramtotal = 0;

  if (chosenStats.heatmapScore || chosenStats.handbalanceScore) {
    monograms = getMonograms(corpus, layout);

    let total = 0;

    for (const monogram in monograms) total += monograms[monogram];
    for (const monogram in monograms) monograms[monogram] /= total;
  }

  if (
    chosenStats.lsb ||
    chosenStats.scissorScore ||
    chosenStats.sfb ||
    chosenStats.sfr
  ) {
    bigrams = getBigrams(corpus, layout);

    for (const bigram in bigrams) {
      if (!mismatchingLetters(bigram, [...layout.rows].join(""))) {
        bigramTotal += bigrams[bigram];
      } else delete bigrams[bigram];
    }
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

    for (const trigram in trigrams) {
      if (!mismatchingLetters(trigram, [...layout.rows].join(""))) {
        trigramTotal += trigrams[trigram];
      } else delete trigrams[trigram];
    }
  }

  if (chosenStats.sfs2) {
    skip2grams = getSkip2grams(corpus, layout);

    for (const skip2gram in skip2grams) {
      if (!mismatchingLetters(skip2gram, [...layout.rows].join(""))) {
        skip2gramtotal += skip2grams[skip2gram];
      } else delete skip2grams[skip2gram];
    }
  }

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

  // need to do scissors, lsb, sss

  if (chosenStats.sfb) {
    let sfb = 0;

    for (const bigram in bigrams) {
      if (
        fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
        bigram[0] != bigram[1]
      )
        if (bigrams[bigram] != undefined) sfb += bigrams[bigram];
    }

    sfb /= bigramTotal;
    stats.sfb = sfb;
  }

  if (chosenStats.sfr) {
    let sfr = 0;

    for (const bigram in bigrams) {
      if (
        fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
        bigram[0] == bigram[1]
      )
        if (bigrams[bigram] != undefined) sfr += bigrams[bigram];
    }

    sfr /= bigramTotal;
    stats.sfr = sfr;
  }

  if (chosenStats.sfs) {
    let sfs = 0;

    for (const trigram in trigrams) {
      if (
        fingerKeyMap[trigram[0]] == fingerKeyMap[trigram[2]] &&
        trigram[0] != trigram[2]
      ) {
        sfs += trigrams[trigram];
      }
    }

    sfs /= trigramTotal;
    stats.sfs = sfs;
  }

  if (chosenStats.sfs2) {
    let sfs2 = 0;

    for (const skip2gram in skip2grams) {
      if (
        fingerKeyMap[skip2gram[0]] == fingerKeyMap[skip2gram[1]] &&
        skip2gram[0] != skip2gram[1]
      ) {
        sfs2 += skip2grams[skip2gram];
      }
    }

    sfs2 /= trigramTotal;
    stats.sfs2 = sfs2;
  }

  if (chosenStats.sfsr) {
    let sfsr = 0;

    for (const trigram in trigrams) {
      if (
        fingerKeyMap[trigram[0]] == fingerKeyMap[trigram[2]] &&
        trigram[0] == trigram[2]
      ) {
        sfsr += trigrams[trigram];
      }
    }

    sfsr /= trigramTotal;
    stats.sfsr = sfsr;
  }

  if (chosenStats.alternate) {
    let alt = 0;

    for (const trigram in trigrams) {
      if (
        getHandFromKey(trigram[0]) != getHandFromKey(trigram[1]) &&
        getHandFromKey(trigram[1]) != getHandFromKey(trigram[2])
      ) {
        alt += trigrams[trigram];
      }
    }

    alt /= trigramTotal;
    stats.alternate = alt;
  }

  if (chosenStats.redirect) {
    let redirect = 0;

    for (const trigram in trigrams) {
      const a = trigram[0];
      const b = trigram[1];
      const c = trigram[2];

      if (
        getHandFromKey(a) == getHandFromKey(b) &&
        getHandFromKey(b) == getHandFromKey(c) &&
        fingerKeyMap[a] != fingerKeyMap[b] &&
        fingerKeyMap[b] != fingerKeyMap[c] &&
        fingerKeyMap[a] < fingerKeyMap[b] !=
          fingerKeyMap[b] < fingerKeyMap[c] &&
        !isThumb(a) &&
        !isThumb(b) &&
        !isThumb(c)
      ) {
        redirect += trigrams[trigram];
      }
    }

    redirect /= trigramTotal;
    stats.redirect = redirect;
  }

  if (chosenStats.redirectWeak) {
    let redirectWeak = 0;

    const isIndex = (letter: string) =>
      fingerKeyMap[letter] == 3 || fingerKeyMap[letter] == 6;

    for (const trigram in trigrams) {
      const a = trigram[0];
      const b = trigram[1];
      const c = trigram[2];

      if (
        getHandFromKey(a) == getHandFromKey(b) &&
        getHandFromKey(b) == getHandFromKey(c) &&
        fingerKeyMap[a] != fingerKeyMap[b] &&
        fingerKeyMap[b] != fingerKeyMap[c] &&
        fingerKeyMap[a] < fingerKeyMap[b] !=
          fingerKeyMap[b] < fingerKeyMap[c] &&
        !isIndex(a) &&
        !isIndex(b) &&
        !isIndex(c) &&
        !isThumb(a) &&
        !isThumb(b) &&
        !isThumb(c)
      ) {
        redirectWeak += trigrams[trigram];
      }
    }

    redirectWeak /= trigramTotal;
    stats.redirectWeak = redirectWeak;
  }

  const roll = (trigram: string) =>
    getHandFromKey(trigram[0]) != getHandFromKey(trigram[2]) &&
    fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
    fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]];

  if (chosenStats.inroll) {
    let inroll = 0;

    for (const trigram in trigrams) {
      if (
        roll(trigram) &&
        Number(
          getHandFromKey(trigram[0]) == getHandFromKey(trigram[1])
            ? fingerKeyMap[trigram[0]] > fingerKeyMap[trigram[1]]
            : fingerKeyMap[trigram[2]] < fingerKeyMap[trigram[1]],
        ) == getHandFromKey(trigram[1])
      ) {
        inroll += trigrams[trigram];
      }
    }

    inroll /= trigramTotal;
    stats.inroll = inroll;
  }

  if (chosenStats.outroll) {
    let outroll = 0;

    for (const trigram in trigrams) {
      if (
        roll(trigram) &&
        Number(
          getHandFromKey(trigram[0]) == getHandFromKey(trigram[1])
            ? fingerKeyMap[trigram[0]] > fingerKeyMap[trigram[1]]
            : fingerKeyMap[trigram[2]] < fingerKeyMap[trigram[1]],
        ) != getHandFromKey(trigram[1])
      ) {
        outroll += trigrams[trigram];
      }
    }

    outroll /= trigramTotal;
    stats.outroll = outroll;
  }

  const onehand = (trigram: string) =>
    getHandFromKey(trigram[0]) == getHandFromKey(trigram[1]) &&
    getHandFromKey(trigram[1]) == getHandFromKey(trigram[2]) &&
    fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
    fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]] &&
    fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[2]] &&
    fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]] ==
      fingerKeyMap[trigram[1]] < fingerKeyMap[trigram[2]];

  if (chosenStats.in3roll) {
    let in3roll = 0;

    for (const trigram in trigrams) {
      if (
        onehand(trigram) &&
        Number(fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]]) !=
          getHandFromKey(trigram[0])
      ) {
        in3roll += trigrams[trigram];
      }
    }

    in3roll /= trigramTotal;
    stats.in3roll = in3roll;
  }

  if (chosenStats.out3roll) {
    let out3roll = 0;

    for (const trigram in trigrams) {
      if (
        onehand(trigram) &&
        Number(fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]]) ==
          getHandFromKey(trigram[0])
      ) {
        out3roll += trigrams[trigram];
      }
    }

    out3roll /= trigramTotal;
    stats.out3roll = out3roll;
  }

  return stats;
};

export default getStats;
