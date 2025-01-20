"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOut3roll = exports.getIn3roll = exports.getOutrolls = exports.getInrolls = exports.getRedirectWeaks = exports.getRedirects = exports.getAlternates = exports.getSfsr = exports.getSfs2 = exports.getSfs = exports.getSfr = exports.getSfbs = void 0;
const getHand = (finger) => (finger < 5 ? 0 : 1);
const getSfbs = (bigrams, fingerKeyMap) => {
    const sfbs = {};
    for (const bigram in bigrams) {
        if (fingerKeyMap[bigram[0]] == fingerKeyMap[bigram[1]] &&
            bigram[0] != bigram[1])
            sfbs[bigram] = bigrams[bigram];
        // if (bigrams[bigram] != undefined) sfbs[bigram] = bigrams[bigram];
    }
    return sfbs;
};
exports.getSfbs = getSfbs;
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
            trigram[0] != trigram[2]) {
            sfs[trigram] == trigrams[trigram];
        }
    }
    return sfs;
};
exports.getSfs = getSfs;
const getSfs2 = (skip2grams, fingerKeyMap) => {
    const sfs2 = {};
    for (const skip2gram in skip2grams) {
        if (fingerKeyMap[skip2gram[0]] == fingerKeyMap[skip2gram[1]] &&
            skip2gram[0] != skip2gram[1]) {
            sfs2[skip2gram] = skip2grams[skip2gram];
        }
    }
    return sfs2;
};
exports.getSfs2 = getSfs2;
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
