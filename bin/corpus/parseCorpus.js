"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readFile_1 = __importDefault(require("../util/readFile"));
const parse = async (filename, corpusName) => {
    const keySwaps = [
        ["´", "'"],
        ["‘", "'"],
        ["’", "'"],
        ["÷", "/"],
        ["‐", "-"],
        ["–", "-"],
        ["—", "-"],
        ["«", "'"],
        ["»", "'"],
        ["“", "'"],
        ["”", "'"],
        ["…", ". . ."],
    ];
    const extendedMonograms = {};
    const extendedBigrams = {};
    const extendedTrigrams = {};
    const extendedSkip2gram = {};
    const addGram = (gram, ngram) => {
        if (gram in ngram)
            ngram[gram] += 1;
        else
            ngram[gram] = 1;
    };
    await (0, readFile_1.default)(`corpus/${filename}`, (line) => {
        keySwaps.forEach((swap) => (line = line.replace(swap[0], swap[1])));
        line = line.toLowerCase();
        const words = line.split(" ");
        for (let k = 0; k < words.length; k++) {
            const word = words[k];
            for (let i = 0; i < word.length; i++) {
                const currentChar = word[i];
                const getChar = (d) => word[i + d] != undefined ? word[i + d] : "";
                const prev1Char = getChar(-1);
                const prev2Char = getChar(-2);
                const prev3Char = getChar(-3);
                const prev4Char = getChar(-4);
                // Extended Monograms
                if (i == 0)
                    addGram(currentChar, extendedMonograms);
                if (i > 0)
                    addGram(prev1Char + currentChar, extendedMonograms);
                // Extended Bigrams
                if (i == 1)
                    addGram(prev1Char + currentChar, extendedBigrams);
                if (i > 1)
                    addGram(prev2Char + prev1Char + currentChar, extendedBigrams);
                // Extended Trigrams
                if (i == 2)
                    addGram(prev2Char + prev1Char + currentChar, extendedTrigrams);
                if (i > 2)
                    addGram(prev3Char + prev2Char + prev1Char + currentChar, extendedTrigrams);
                // Extended Skip2grams
                if (i == 3)
                    addGram(prev3Char + prev1Char + currentChar, extendedSkip2gram);
                if (i > 3)
                    addGram(prev4Char + prev3Char + prev1Char + currentChar, extendedSkip2gram);
            }
        }
    });
    const corpus = {
        name: corpusName,
        extendedMonograms: extendedMonograms,
        extendedBigrams: extendedBigrams,
        extendedTrigrams: extendedTrigrams,
        extendedSkip2grams: extendedSkip2gram,
    };
    console.log("Corpus parsed!");
    try {
        fs.writeFileSync(`parsed/${corpusName}.json`, JSON.stringify(corpus), {
            flag: "w",
        });
        console.log("Corpus file written!");
    }
    catch (err) {
        console.log("There was an error writing the corpus file.");
        console.error(err);
    }
};
exports.default = parse;
