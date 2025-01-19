"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkip2grams = exports.getTrigrams = exports.getBigrams = exports.getMonograms = void 0;
const addGram = (gram, ngram) => {
    if (gram in ngram)
        ngram[gram] += 1;
    else
        ngram[gram] = 1;
};
const addGramAmount = (gram, amount, ngram) => {
    if (gram in ngram)
        ngram[gram] += amount;
    else
        ngram[gram] = amount;
};
const getMonograms = (corpus, layout) => {
    const monograms = {};
    if (!layout.hasMagic) {
        // figure this out later
        return monograms;
    }
    for (let extendedMonogram in corpus.extendedMonograms) {
        const freq = corpus.extendedMonograms[extendedMonogram];
        if (extendedMonogram.length == 2) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedMonogram[0] &&
                    magicRule.transformTo == extendedMonogram[1])
                    extendedMonogram = layout.magicIdentifier;
                //else extendedMonogram = extendedMonogram[1];
            });
        }
        //addGram(extendedMonogram, monograms);
        if (extendedMonogram.length == 2)
            extendedMonogram = extendedMonogram[1];
        // monograms[extendedMonogram] = freq;
        addGramAmount(extendedMonogram, freq, monograms);
    }
    return monograms;
};
exports.getMonograms = getMonograms;
const getBigrams = (corpus, layout) => {
    const bigrams = {};
    if (!layout.hasMagic) {
        // figure this out later
        return bigrams;
    }
    for (let extendedBigram in corpus.extendedBigrams) {
        if (extendedBigram.length == 2) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedBigram[0] &&
                    magicRule.transformTo == extendedBigram[1])
                    extendedBigram = extendedBigram[0] + layout.magicIdentifier;
            });
        }
        else if (extendedBigram.length == 3) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedBigram[0] &&
                    magicRule.transformTo == extendedBigram[1])
                    extendedBigram = layout.magicIdentifier + extendedBigram[2];
                else if (magicRule.activator == extendedBigram[1] &&
                    magicRule.transformTo == extendedBigram[2])
                    extendedBigram = extendedBigram[1] + layout.magicIdentifier;
                else
                    extendedBigram = extendedBigram[1] + extendedBigram[2];
            });
        }
        addGram(extendedBigram, bigrams);
    }
    return bigrams;
};
exports.getBigrams = getBigrams;
const getTrigrams = (corpus, layout) => {
    const trigrams = {};
    if (!layout.hasMagic) {
        // figure this out later
        return trigrams;
    }
    for (let extendedTrigram in corpus.extendedTrigrams) {
        if (extendedTrigram.length == 3) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedTrigram[0] &&
                    magicRule.transformTo == extendedTrigram[1])
                    extendedTrigram =
                        extendedTrigram[0] + layout.magicIdentifier + extendedTrigram[2];
                else if (magicRule.activator == extendedTrigram[1] &&
                    magicRule.transformTo == extendedTrigram[2])
                    extendedTrigram =
                        extendedTrigram[0] + extendedTrigram[1] + layout.magicIdentifier;
            });
        }
        else if (extendedTrigram.length == 4) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedTrigram[0] &&
                    magicRule.transformTo == extendedTrigram[1])
                    extendedTrigram =
                        layout.magicIdentifier + extendedTrigram[2] + extendedTrigram[3];
                else if (magicRule.activator == extendedTrigram[1] &&
                    magicRule.transformTo == extendedTrigram[2])
                    extendedTrigram =
                        extendedTrigram[1] + layout.magicIdentifier + extendedTrigram[3];
                else if (magicRule.activator == extendedTrigram[2] &&
                    magicRule.transformTo == extendedTrigram[3])
                    extendedTrigram =
                        extendedTrigram[1] + extendedTrigram[2] + layout.magicIdentifier;
                else
                    extendedTrigram =
                        extendedTrigram[1] + extendedTrigram[2] + extendedTrigram[3];
            });
        }
        addGram(extendedTrigram, trigrams);
    }
    return trigrams;
};
exports.getTrigrams = getTrigrams;
const getSkip2grams = (corpus, layout) => {
    const skip2grams = {};
    if (!layout.hasMagic) {
        // figure this out later
        return skip2grams;
    }
    for (let extendedSkip2gram in corpus.extendedSkip2grams) {
        let parts = [extendedSkip2gram[0], extendedSkip2gram[1]];
        if (extendedSkip2gram.length == 3) {
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedSkip2gram[1] &&
                    magicRule.transformTo == extendedSkip2gram[2])
                    parts = [extendedSkip2gram[0], layout.magicIdentifier];
                else
                    parts = [extendedSkip2gram[0], extendedSkip2gram[2]];
            });
        }
        else if (extendedSkip2gram.length == 4) {
            parts = [extendedSkip2gram[1], extendedSkip2gram[3]];
            layout.magicRules.forEach((magicRule) => {
                if (magicRule.activator == extendedSkip2gram[0] &&
                    magicRule.transformTo == extendedSkip2gram[1])
                    parts[0] = layout.magicIdentifier;
                if (magicRule.activator == extendedSkip2gram[2] &&
                    magicRule.transformTo == extendedSkip2gram[3])
                    parts[1] = layout.magicIdentifier;
            });
        }
        addGram(parts.join(""), skip2grams);
    }
    return skip2grams;
};
exports.getSkip2grams = getSkip2grams;
