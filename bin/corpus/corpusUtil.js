"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkip2grams = exports.getTrigrams = exports.getBigrams = exports.getMonograms = exports.mismatchingLetters = void 0;
const addGramAmount = (gram, amount, ngram) => {
    if (gram in ngram)
        ngram[gram] += amount;
    else
        ngram[gram] = amount;
};
const mismatchingLetters = (stringToCheck, allowedLetters) => [...stringToCheck].some((letter) => !allowedLetters.includes(letter));
exports.mismatchingLetters = mismatchingLetters;
const getMonograms = (corpus, layout) => {
    const monograms = {};
    for (let extendedMonogram in corpus.extendedMonograms) {
        const freq = corpus.extendedMonograms[extendedMonogram];
        let magicReplacements = 0;
        if (layout.hasMagic)
            for (let i = 0; i < layout.magicRules.length; i++) {
                const replacement = extendedMonogram.replace(layout.magicRules[i], layout.magicRules[i][0] + layout.magicIdentifier);
                if (replacement != extendedMonogram) {
                    extendedMonogram = replacement;
                    magicReplacements++;
                    if (magicReplacements == 1)
                        break;
                }
            }
        if (extendedMonogram.length == 2)
            extendedMonogram = extendedMonogram[1];
        addGramAmount(extendedMonogram, freq, monograms);
    }
    let total = 0;
    for (const monogram in monograms)
        total += monograms[monogram];
    for (const monogram in monograms)
        monograms[monogram] /= total;
    return monograms;
};
exports.getMonograms = getMonograms;
const getBigrams = (corpus, layout) => {
    const bigrams = {};
    for (let extendedBigram in corpus.extendedBigrams) {
        const freq = corpus.extendedBigrams[extendedBigram];
        let magicReplacements = 0;
        if (layout.hasMagic)
            for (let i = 0; i < layout.magicRules.length; i++) {
                const replacement = extendedBigram.replace(layout.magicRules[i], layout.magicRules[i][0] + layout.magicIdentifier);
                if (replacement != extendedBigram) {
                    extendedBigram = replacement;
                    magicReplacements++;
                    if (magicReplacements == 1)
                        break;
                }
            }
        if (extendedBigram.length == 3)
            extendedBigram = extendedBigram.slice(1, 3);
        addGramAmount(extendedBigram, freq, bigrams);
    }
    let bigramTotal = 0;
    for (const bigram in bigrams) {
        if (!(0, exports.mismatchingLetters)(bigram, [...layout.rows].join(""))) {
            bigramTotal += bigrams[bigram];
        }
        else
            delete bigrams[bigram];
    }
    for (const bigram in bigrams) {
        bigrams[bigram] /= bigramTotal;
    }
    return bigrams;
};
exports.getBigrams = getBigrams;
const getTrigrams = (corpus, layout) => {
    const trigrams = {};
    for (let extendedTrigram in corpus.extendedTrigrams) {
        const freq = corpus.extendedTrigrams[extendedTrigram];
        let magicReplacements = 0;
        if (layout.hasMagic)
            for (let i = 0; i < layout.magicRules.length; i++) {
                const replacement = extendedTrigram.replace(layout.magicRules[i], layout.magicRules[i][0] + layout.magicIdentifier);
                if (replacement != extendedTrigram) {
                    extendedTrigram = replacement;
                    magicReplacements++;
                    if (magicReplacements == 2)
                        break;
                }
            }
        if (extendedTrigram.length == 4)
            extendedTrigram = extendedTrigram.slice(1, 4);
        addGramAmount(extendedTrigram, freq, trigrams);
    }
    let trigramTotal = 0;
    for (const trigram in trigrams) {
        if (!(0, exports.mismatchingLetters)(trigram, [...layout.rows].join(""))) {
            trigramTotal += trigrams[trigram];
        }
        else
            delete trigrams[trigram];
    }
    for (const trigram in trigrams) {
        trigrams[trigram] /= trigramTotal;
    }
    return trigrams;
};
exports.getTrigrams = getTrigrams;
const getSkip2grams = (corpus, layout) => {
    const skip2grams = {};
    for (let extendedSkip2gram in corpus.extendedSkip2grams) {
        const freq = corpus.extendedSkip2grams[extendedSkip2gram];
        let parts = [extendedSkip2gram[0], extendedSkip2gram[1]];
        let magicReplacements = 0;
        if (layout.hasMagic)
            for (let i = 0; i < layout.magicRules.length; i++) {
                const replacement = extendedSkip2gram.replace(layout.magicRules[i], layout.magicRules[i][0] + layout.magicIdentifier);
                if (replacement != extendedSkip2gram) {
                    extendedSkip2gram = replacement;
                    magicReplacements++;
                    if (magicReplacements == 2)
                        break;
                }
            }
        addGramAmount(parts.join(""), freq, skip2grams);
    }
    let skip2gramtotal = 0;
    for (const skip2gram in skip2grams) {
        if (!(0, exports.mismatchingLetters)(skip2gram, [...layout.rows].join(""))) {
            skip2gramtotal += skip2grams[skip2gram];
        }
        else
            delete skip2grams[skip2gram];
    }
    for (const skip2gram in skip2grams) {
        skip2grams[skip2gram] /= skip2gramtotal;
    }
    return skip2grams;
};
exports.getSkip2grams = getSkip2grams;
