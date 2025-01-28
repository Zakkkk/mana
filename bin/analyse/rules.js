"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOut3roll = exports.getIn3roll = exports.getOutrolls = exports.getInrolls = exports.getRedirectWeaks = exports.getRedirects = exports.getAlternates = exports.getSfsr = exports.getLss = exports.getSfs = exports.getSfr = exports.getSkipFullScissors = exports.getFullScissors = exports.getSkipHalfScissors = exports.getHalfScissors = exports.getLsb = exports.getSfbs = exports.getHandBalance = exports.getHeatmap = exports.getFingerFreq = void 0;
const getHand = (finger) => (finger < 5 ? 0 : 1);
const addGramAmount = (gram, amount, ngram) => {
    if (gram in ngram)
        ngram[gram] += amount;
    else
        ngram[gram] = amount;
};
const getFingerFreq = (monograms, fingerKeyMap) => {
    const fingers = [];
    for (let i = 0; i < 10; i++)
        fingers.push(0);
    for (const monogram in monograms) {
        const finger = fingerKeyMap[monogram];
        if (finger != undefined) {
            fingers[finger] += monograms[monogram];
        }
    }
    return fingers;
};
exports.getFingerFreq = getFingerFreq;
const getHeatmap = (monograms, layout) => {
    let heatmapScore = 0;
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
            heatmapScore += freq * (heatmap[i][j] == undefined ? 0 : heatmap[i][j]);
        }
    // based on the lowest score being a 0.5 (lowest heatmap score)
    // and the highest score being a 1
    // so this remaps it to 0-1
    heatmapScore -= 0.5;
    heatmapScore *= 2;
    return heatmapScore;
};
exports.getHeatmap = getHeatmap;
const getHandBalance = (monograms, fingerKeyMap, layout) => {
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
    return lefthand;
};
exports.getHandBalance = getHandBalance;
const getSfbs = (bigrams, fingerKeyMap) => {
    const sfbs = {};
    for (const bigram in bigrams) {
        if (fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
            bigram[0] != bigram[1])
            sfbs[bigram] = bigrams[bigram];
    }
    return sfbs;
};
exports.getSfbs = getSfbs;
const getLsb = (bigrams, fingerKeyMap, layout) => {
    const lsb = {};
    const getX = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return layout.rows[i].indexOf(key);
        }
        return -1;
    };
    for (const bigram in bigrams) {
        if (getHand(fingerKeyMap[bigram[0]]) == getHand(fingerKeyMap[bigram[1]]) &&
            ![bigram[0], bigram[1]].some((x) => [4, 5].includes(fingerKeyMap[x])) &&
            Math.abs(fingerKeyMap[bigram[0]] - fingerKeyMap[bigram[1]]) == 1 &&
            Math.abs(getX(bigram[0]) - getX(bigram[1])) >= 2)
            lsb[bigram] = bigrams[bigram];
    }
    return lsb;
};
exports.getLsb = getLsb;
const getHalfScissors = (bigrams, fingerKeyMap, layout) => {
    const halfScissor = {};
    const getY = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return i;
        }
        return -1;
    };
    for (const bigram in bigrams) {
        if (getHand(fingerKeyMap[bigram[0]]) == getHand(fingerKeyMap[bigram[1]]) &&
            fingerKeyMap[bigram[0]] != fingerKeyMap[bigram[1]] &&
            Math.abs(getY(bigram[0]) - getY(bigram[1])) == 1 &&
            [1, 2, 7, 8].includes(fingerKeyMap[getY(bigram[0]) > getY(bigram[1]) ? bigram[0] : bigram[1]]))
            halfScissor[bigram] = bigrams[bigram];
    }
    return halfScissor;
};
exports.getHalfScissors = getHalfScissors;
const getSkipHalfScissors = (trigrams, fingerKeyMap, layout) => {
    const skipHalfScissor = {};
    const getY = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return i;
        }
        return -1;
    };
    for (const trigram in trigrams) {
        if (getHand(fingerKeyMap[trigram[0]]) == getHand(fingerKeyMap[trigram[2]]) &&
            fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[2]] &&
            Math.abs(getY(trigram[0]) - getY(trigram[2])) == 1 &&
            [1, 2, 7, 8].includes(fingerKeyMap[getY(trigram[0]) > getY(trigram[2]) ? trigram[0] : trigram[2]]))
            addGramAmount(trigram[0] + trigram[2], trigrams[trigram], skipHalfScissor);
    }
    return skipHalfScissor;
};
exports.getSkipHalfScissors = getSkipHalfScissors;
const getFullScissors = (bigrams, fingerKeyMap, layout) => {
    const fullScissor = {};
    const getY = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return i;
        }
        return -1;
    };
    for (const bigram in bigrams) {
        if (getHand(fingerKeyMap[bigram[0]]) == getHand(fingerKeyMap[bigram[1]]) &&
            fingerKeyMap[bigram[0]] != fingerKeyMap[bigram[1]] &&
            Math.abs(getY(bigram[0]) - getY(bigram[1])) >= 2 &&
            ![3, 4, 5, 6].includes(fingerKeyMap[getY(bigram[0]) > getY(bigram[1]) ? bigram[0] : bigram[1]]))
            fullScissor[bigram] = bigrams[bigram];
    }
    return fullScissor;
};
exports.getFullScissors = getFullScissors;
const getSkipFullScissors = (trigrams, fingerKeyMap, layout) => {
    const skipFullScissors = {};
    const getY = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return i;
        }
        return -1;
    };
    for (const trigram in trigrams) {
        if (getHand(fingerKeyMap[trigram[0]]) == getHand(fingerKeyMap[trigram[2]]) &&
            fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[2]] &&
            Math.abs(getY(trigram[0]) - getY(trigram[2])) >= 2 &&
            ![3, 4, 5, 6].includes(fingerKeyMap[getY(trigram[0]) > getY(trigram[2]) ? trigram[0] : trigram[2]]))
            addGramAmount(trigram[0] + trigram[2], trigrams[trigram], skipFullScissors);
    }
    return skipFullScissors;
};
exports.getSkipFullScissors = getSkipFullScissors;
const getSfr = (bigrams, fingerKeyMap) => {
    const sfr = {};
    for (const bigram in bigrams) {
        if (fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
            bigram[0] == bigram[1])
            sfr[bigram] = bigrams[bigram];
    }
    return sfr;
};
exports.getSfr = getSfr;
const getSfs = (trigrams, fingerKeyMap) => {
    const sfs = {};
    for (const trigram in trigrams) {
        if (fingerKeyMap[trigram[0]] == fingerKeyMap[trigram[2]] &&
            trigram[0] != trigram[2])
            addGramAmount(trigram[0] + trigram[2], trigrams[trigram], sfs);
    }
    return sfs;
};
exports.getSfs = getSfs;
const getLss = (trigrams, fingerKeyMap, layout) => {
    const lss = {};
    const getX = (key) => {
        for (let i = 0; i < layout.rows.length; i++) {
            if (layout.rows[i].includes(key))
                return layout.rows[i].indexOf(key);
        }
        return -1;
    };
    for (const trigram in trigrams) {
        if (getHand(fingerKeyMap[trigram[0]]) == getHand(fingerKeyMap[trigram[2]]) &&
            ![trigram[0], trigram[2]].some((x) => [4, 5].includes(fingerKeyMap[x])) &&
            Math.abs(fingerKeyMap[trigram[0]] - fingerKeyMap[trigram[2]]) == 1 &&
            Math.abs(getX(trigram[0]) - getX(trigram[2])) >= 2)
            addGramAmount(trigram[0] + trigram[2], trigrams[trigram], lss);
    }
    return lss;
};
exports.getLss = getLss;
const getSfsr = (trigrams, fingerKeyMap) => {
    const sfsr = {};
    for (const trigram in trigrams) {
        if (fingerKeyMap[trigram[0]] == fingerKeyMap[trigram[2]] &&
            trigram[0] == trigram[2]) {
            sfsr[trigram] = trigrams[trigram];
        }
    }
    return sfsr;
};
exports.getSfsr = getSfsr;
const getAlternates = (trigrams, fingerKeyMap) => {
    const alt = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    for (const trigram in trigrams) {
        if (getHandFromKey(trigram[0]) != getHandFromKey(trigram[1]) &&
            getHandFromKey(trigram[1]) != getHandFromKey(trigram[2])) {
            alt[trigram] = trigrams[trigram];
        }
    }
    return alt;
};
exports.getAlternates = getAlternates;
const getRedirects = (trigrams, fingerKeyMap) => {
    const redirect = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const isThumb = (key) => fingerKeyMap[key] == 4 || fingerKeyMap[key] == 5;
    for (const trigram in trigrams) {
        const a = trigram[0];
        const b = trigram[1];
        const c = trigram[2];
        if (getHandFromKey(a) == getHandFromKey(b) &&
            getHandFromKey(b) == getHandFromKey(c) &&
            fingerKeyMap[a] != fingerKeyMap[b] &&
            fingerKeyMap[b] != fingerKeyMap[c] &&
            fingerKeyMap[a] < fingerKeyMap[b] != fingerKeyMap[b] < fingerKeyMap[c] &&
            !isThumb(a) &&
            !isThumb(b) &&
            !isThumb(c)) {
            redirect[trigram] = trigrams[trigram];
        }
    }
    return redirect;
};
exports.getRedirects = getRedirects;
const getRedirectWeaks = (trigrams, fingerKeyMap) => {
    const redirectWeak = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const isThumb = (key) => fingerKeyMap[key] == 4 || fingerKeyMap[key] == 5;
    const isIndex = (letter) => fingerKeyMap[letter] == 3 || fingerKeyMap[letter] == 6;
    for (const trigram in trigrams) {
        const a = trigram[0];
        const b = trigram[1];
        const c = trigram[2];
        if (getHandFromKey(a) == getHandFromKey(b) &&
            getHandFromKey(b) == getHandFromKey(c) &&
            fingerKeyMap[a] != fingerKeyMap[b] &&
            fingerKeyMap[b] != fingerKeyMap[c] &&
            fingerKeyMap[a] < fingerKeyMap[b] != fingerKeyMap[b] < fingerKeyMap[c] &&
            !isIndex(a) &&
            !isIndex(b) &&
            !isIndex(c) &&
            !isThumb(a) &&
            !isThumb(b) &&
            !isThumb(c)) {
            redirectWeak[trigram] = trigrams[trigram];
        }
    }
    return redirectWeak;
};
exports.getRedirectWeaks = getRedirectWeaks;
const getInrolls = (trigrams, fingerKeyMap) => {
    const inroll = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const roll = (trigram) => getHandFromKey(trigram[0]) != getHandFromKey(trigram[2]) &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
        fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]];
    for (const trigram in trigrams) {
        if (roll(trigram) &&
            Number(getHandFromKey(trigram[0]) == getHandFromKey(trigram[1])
                ? fingerKeyMap[trigram[0]] > fingerKeyMap[trigram[1]]
                : fingerKeyMap[trigram[2]] < fingerKeyMap[trigram[1]]) == getHandFromKey(trigram[1])) {
            inroll[trigram] = trigrams[trigram];
        }
    }
    return inroll;
};
exports.getInrolls = getInrolls;
const getOutrolls = (trigrams, fingerKeyMap) => {
    const outroll = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const roll = (trigram) => getHandFromKey(trigram[0]) != getHandFromKey(trigram[2]) &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
        fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]];
    for (const trigram in trigrams) {
        if (roll(trigram) &&
            Number(getHandFromKey(trigram[0]) == getHandFromKey(trigram[1])
                ? fingerKeyMap[trigram[0]] > fingerKeyMap[trigram[1]]
                : fingerKeyMap[trigram[2]] < fingerKeyMap[trigram[1]]) != getHandFromKey(trigram[1])) {
            outroll[trigram] = trigrams[trigram];
        }
    }
    return outroll;
};
exports.getOutrolls = getOutrolls;
const getIn3roll = (trigrams, fingerKeyMap) => {
    const in3roll = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const onehand = (trigram) => getHandFromKey(trigram[0]) == getHandFromKey(trigram[1]) &&
        getHandFromKey(trigram[1]) == getHandFromKey(trigram[2]) &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
        fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]] &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[2]] &&
        fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]] ==
            fingerKeyMap[trigram[1]] < fingerKeyMap[trigram[2]];
    for (const trigram in trigrams) {
        if (onehand(trigram) &&
            Number(fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]]) !=
                getHandFromKey(trigram[0])) {
            in3roll[trigram] = trigrams[trigram];
        }
    }
    return in3roll;
};
exports.getIn3roll = getIn3roll;
const getOut3roll = (trigrams, fingerKeyMap) => {
    const out3roll = {};
    const getHandFromKey = (key) => getHand(fingerKeyMap[key]);
    const onehand = (trigram) => getHandFromKey(trigram[0]) == getHandFromKey(trigram[1]) &&
        getHandFromKey(trigram[1]) == getHandFromKey(trigram[2]) &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[1]] &&
        fingerKeyMap[trigram[1]] != fingerKeyMap[trigram[2]] &&
        fingerKeyMap[trigram[0]] != fingerKeyMap[trigram[2]] &&
        fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]] ==
            fingerKeyMap[trigram[1]] < fingerKeyMap[trigram[2]];
    for (const trigram in trigrams) {
        if (onehand(trigram) &&
            Number(fingerKeyMap[trigram[0]] < fingerKeyMap[trigram[1]]) ==
                getHandFromKey(trigram[0])) {
            out3roll[trigram] = trigrams[trigram];
        }
    }
    return out3roll;
};
exports.getOut3roll = getOut3roll;
