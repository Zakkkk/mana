"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corpusUtil_1 = require("./corpusUtil");
const getStats = (layout, corpus, chosenStats) => {
    const stats = {};
    const fingerKeyMap = {};
    for (let i = 0; i < layout.rows.length; i++)
        for (let j = 0; j < layout.rows[i].length; j++)
            fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);
    let monograms = {};
    let bigrams = {};
    let trigrams = {};
    let skip2grams = {};
    if (chosenStats.heatmapScore || chosenStats.handbalanceScore) {
        monograms = (0, corpusUtil_1.getMonograms)(corpus, layout);
        let total = 0;
        for (const monogram in monograms)
            total += monograms[monogram];
        for (const monogram in monograms)
            monograms[monogram] /= total;
    }
    if (chosenStats.lsb || chosenStats.scissorScore || chosenStats.sfb)
        bigrams = (0, corpusUtil_1.getBigrams)(corpus, layout);
    if (chosenStats.alternate ||
        chosenStats.in3roll ||
        chosenStats.inroll ||
        chosenStats.lss ||
        chosenStats.out3roll ||
        chosenStats.outroll ||
        chosenStats.redirect ||
        chosenStats.redirectWeak)
        trigrams = (0, corpusUtil_1.getTrigrams)(corpus, layout);
    if (chosenStats.sfs2)
        skip2grams = (0, corpusUtil_1.getSkip2grams)(corpus, layout);
    if (chosenStats.heatmapScore) {
        stats.heatmapScore = 0;
        const heatmap = [
            [0.65, 0.85, 0.85, 0.65, 0.6, 0.7, 0.75, 0.95, 0.95, 0.75],
            [0.85, 0.9, 0.9, 0.9, 0.7, 0.8, 1.0, 1.0, 1.0, 0.95],
            [0.65, 0.5, 0.65, 0.75, 0.65, 0.75, 0.85, 0.75, 0.6, 0.75],
            [1],
        ];
        for (let i = 0; i < layout.rows.length; i++)
            for (let j = 0; j < layout.rows[i].length; j++) {
                const freq = monograms[layout.rows[i][j]] == undefined
                    ? 0
                    : monograms[layout.rows[i][j]];
                stats.heatmapScore += freq * heatmap[i][j];
            }
    }
    return stats;
};
exports.default = getStats;
