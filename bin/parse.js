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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readFile_1 = __importDefault(require("./readFile"));
const parse = (filename, corpusName) => __awaiter(void 0, void 0, void 0, function* () {
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
    /*
    bigram words
    trigram starts
    fougrams
    */
    const monograms = {};
    const bigramWords = {};
    const trigramWords = {};
    const fourgrams = {};
    const addGram = (gram, ngram) => {
        if (gram in ngram)
            ngram[gram] += 1;
        else
            ngram[gram] = 1;
    };
    yield (0, readFile_1.default)(`corpus/${filename}`, (line) => {
        keySwaps.forEach((swap) => (line = line.replace(swap[0], swap[1])));
        line = line.toLowerCase();
        const words = line.split(" ");
        for (let k = 0; k < words.length; k++) {
            const word = words[k];
            for (let j = 0; j < word.length; j++)
                addGram(word[j], monograms);
            if (word.length == 2) {
                addGram(word, bigramWords);
            }
            else if (word.length == 3) {
                addGram(word, trigramWords);
            }
            else if (word.length > 3) {
                for (let i = 0; i < word.length; i++) {
                    const currentChar = word[i];
                    const getChar = (d) => word[i + d] != undefined ? word[i + d] : "";
                    const prev1Char = getChar(-1);
                    const prev2Char = getChar(-2);
                    const prev3Char = getChar(-3);
                    const trigramWord = prev2Char + prev1Char + currentChar;
                    const fourgram = prev3Char + trigramWord;
                    if (fourgram.length == 3)
                        addGram(trigramWord, trigramWords);
                    if (fourgram.length == 4)
                        addGram(fourgram, fourgrams);
                }
            }
        }
    });
    const corpus = {
        name: corpusName,
        monograms: monograms,
        bigramWords: bigramWords,
        trigramWords: trigramWords,
        fourgrams: fourgrams,
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
});
exports.default = parse;
