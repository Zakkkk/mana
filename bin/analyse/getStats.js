"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFingerKeyMap = void 0;
const corpusUtil_1 = require("../corpus/corpusUtil");
const rules_1 = require("./rules");
const getFingerKeyMap = (layout) => {
    const fingerKeyMap = {};
    for (let i = 0; i < layout.rows.length; i++)
        for (let j = 0; j < layout.rows[i].length; j++)
            fingerKeyMap[layout.rows[i][j]] = parseInt(layout.fingermap[i][j]);
    return fingerKeyMap;
};
exports.getFingerKeyMap = getFingerKeyMap;
const getStats = (layout, corpus, chosenStats) => {
    const stats = {};
    const fingerKeyMap = (0, exports.getFingerKeyMap)(layout);
    let monograms = {};
    let bigrams = {};
    let trigrams = {};
    let skip2grams = {};
    if (chosenStats.heatmapScore || chosenStats.handbalanceScore) {
        monograms = (0, corpusUtil_1.getMonograms)(corpus, layout);
    }
    if (chosenStats.lsb ||
        chosenStats.fullScissors ||
        chosenStats.halfScissors ||
        chosenStats.sfb ||
        chosenStats.sfr) {
        bigrams = (0, corpusUtil_1.getBigrams)(corpus, layout);
    }
    if (chosenStats.alternate ||
        chosenStats.in3roll ||
        chosenStats.inroll ||
        chosenStats.lss ||
        chosenStats.out3roll ||
        chosenStats.outroll ||
        chosenStats.redirect ||
        chosenStats.redirectWeak) {
        trigrams = (0, corpusUtil_1.getTrigrams)(corpus, layout);
    }
    if (chosenStats.sfs2) {
        skip2grams = (0, corpusUtil_1.getSkip2grams)(corpus, layout);
    }
    if (chosenStats.heatmapScore) {
        stats.heatmapScore = 0;
        const heatmap = [
            [0.65, 0.85, 0.85, 0.65, 0.6, 0.7, 0.75, 0.95, 0.95, 0.75],
            [0.85, 0.9, 0.9, 0.9, 0.7, 0.8, 1.0, 1.0, 1.0, 0.95, 0.65],
            [0.65, 0.5, 0.65, 0.75, 0.65, 0.75, 0.85, 0.75, 0.6, 0.75],
            [1, 1],
        ];
        for (let i = 0; i < layout.rows.length; i++)
            for (let j = 0; j < layout.rows[i].length; j++) {
                const freq = monograms[layout.rows[i][j]] == undefined
                    ? 0
                    : monograms[layout.rows[i][j]];
                stats.heatmapScore +=
                    freq * (heatmap[i][j] == undefined ? 0 : heatmap[i][j]);
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
                if (monograms[layout.rows[i][j]] != undefined &&
                    (fingerKeyMap[layout.rows[i][j]] < 4 ||
                        fingerKeyMap[layout.rows[i][j]] > 5))
                    total += monograms[layout.rows[i][j]];
            }
        lefthand /= total;
        stats.handbalanceScore = lefthand;
    }
    if (chosenStats.sfb) {
        let sfbTotal = 0;
        for (const sfb in (0, rules_1.getSfbs)(bigrams, fingerKeyMap))
            sfbTotal += bigrams[sfb];
        stats.sfb = sfbTotal;
    }
    if (chosenStats.lsb) {
        let lsbTotal = 0;
        for (const lsb in (0, rules_1.getLsb)(bigrams, fingerKeyMap, layout))
            lsbTotal += bigrams[lsb];
        stats.lsb = lsbTotal;
    }
    if (chosenStats.lss) {
        let lssTotal = 0;
        const lssAmounts = (0, rules_1.getLss)(trigrams, fingerKeyMap, layout);
        for (const lss in lssAmounts)
            lssTotal += lssAmounts[lss];
        stats.lss = lssTotal;
    }
    if (chosenStats.halfScissors) {
        let hsTotal = 0;
        for (const hs in (0, rules_1.getHalfScissors)(bigrams, fingerKeyMap, layout))
            hsTotal += bigrams[hs];
        stats.halfScissors = hsTotal;
    }
    if (chosenStats.fullScissors) {
        let fsTotal = 0;
        for (const fs in (0, rules_1.getFullScissors)(bigrams, fingerKeyMap, layout))
            fsTotal += bigrams[fs];
        stats.fullScissors = fsTotal;
    }
    if (chosenStats.sfr) {
        let sfrTotal = 0;
        for (const sfr in (0, rules_1.getSfr)(bigrams, fingerKeyMap))
            sfrTotal += bigrams[sfr];
        stats.sfr = sfrTotal;
    }
    if (chosenStats.sfs) {
        let sfsTotal = 0;
        const sfsAmounts = (0, rules_1.getSfs)(trigrams, fingerKeyMap);
        for (const sfs in sfsAmounts)
            sfsTotal += sfsAmounts[sfs];
        stats.sfs = sfsTotal;
    }
    if (chosenStats.sfs2) {
        let sfs2Total = 0;
        for (const sfs2 in (0, rules_1.getSfs2)(skip2grams, fingerKeyMap))
            sfs2Total += skip2grams[sfs2];
        stats.sfs2 = sfs2Total;
    }
    if (chosenStats.sfsr) {
        let sfsrTotal = 0;
        for (const sfsr in (0, rules_1.getSfsr)(trigrams, fingerKeyMap))
            sfsrTotal += trigrams[sfsr];
        stats.sfsr = sfsrTotal;
    }
    if (chosenStats.alternate) {
        let altTotal = 0;
        for (const alt in (0, rules_1.getAlternates)(trigrams, fingerKeyMap))
            altTotal += trigrams[alt];
        stats.alternate = altTotal;
    }
    if (chosenStats.redirect) {
        let redirectTotal = 0;
        for (const redirect in (0, rules_1.getRedirects)(trigrams, fingerKeyMap))
            redirectTotal += trigrams[redirect];
        stats.redirect = redirectTotal;
    }
    if (chosenStats.redirectWeak) {
        let redirectWeakTotal = 0;
        for (const redirectWeak in (0, rules_1.getRedirectWeaks)(trigrams, fingerKeyMap))
            redirectWeakTotal += trigrams[redirectWeak];
        stats.redirectWeak = redirectWeakTotal;
    }
    if (chosenStats.inroll) {
        let inrollTotal = 0;
        for (const inroll in (0, rules_1.getInrolls)(trigrams, fingerKeyMap))
            inrollTotal += trigrams[inroll];
        stats.inroll = inrollTotal;
    }
    if (chosenStats.outroll) {
        let outrollTotal = 0;
        for (const outroll in (0, rules_1.getOutrolls)(trigrams, fingerKeyMap))
            outrollTotal += trigrams[outroll];
        stats.outroll = outrollTotal;
    }
    if (chosenStats.in3roll) {
        let in3rollTotal = 0;
        for (const in3roll in (0, rules_1.getIn3roll)(trigrams, fingerKeyMap))
            in3rollTotal += trigrams[in3roll];
        stats.in3roll = in3rollTotal;
    }
    if (chosenStats.out3roll) {
        let out3rollTotal = 0;
        for (const out3roll in (0, rules_1.getOut3roll)(trigrams, fingerKeyMap))
            out3rollTotal += trigrams[out3roll];
        stats.out3roll = out3rollTotal;
    }
    return stats;
};
exports.default = getStats;
