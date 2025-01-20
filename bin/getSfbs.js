"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corpusUtil_1 = require("./corpusUtil");
const getStats_1 = require("./getStats");
const getSfbs = (layout, corpus) => {
    const sfbs = {};
    const bigrams = (0, corpusUtil_1.getBigrams)(corpus, layout);
    let bigramTotal = 0;
    const fingerKeyMap = {};
    for (let i = 0; i < layout.rows.length; i++)
        for (let j = 0; j < layout.rows[i].length; j++)
            fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);
    for (const bigram in bigrams) {
        if (!(0, getStats_1.mismatchingLetters)(bigram, [...layout.rows].join(""))) {
            bigramTotal += bigrams[bigram];
        }
        else
            delete bigrams[bigram];
    }
    for (const bigram in bigrams) {
        if (fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
            bigram[0] != bigram[1])
            if (bigrams[bigram] != undefined)
                sfbs[bigram] = bigrams[bigram] / bigramTotal;
    }
    const sortedSfb = Object.fromEntries(Object.entries(sfbs).sort(([, a], [, b]) => b - a));
    const topSortedSfb = {};
    let i = 0;
    for (const sfb in sortedSfb) {
        topSortedSfb[sfb] = sortedSfb[sfb];
        i++;
        if (i >= 20)
            break;
    }
    return topSortedSfb;
};
exports.default = getSfbs;
