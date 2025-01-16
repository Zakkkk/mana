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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorpusPositionByName = exports.loadCorpus = void 0;
const fs = __importStar(require("fs"));
const loadCorpus = (corpusName) => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(`parsed/${corpusName}.json`, "utf8"));
    }
    catch (err) {
        console.error(err);
        return -1;
    }
    let corpus = {
        name: data.name,
        monograms: data.monograms,
        bigramWords: data.bigramWords,
        trigramWords: data.trigramWords,
        fourgrams: data.fourgrams,
    };
    return corpus;
};
exports.loadCorpus = loadCorpus;
const getCorpusPositionByName = (corpusName, loadedCorpora) => {
    for (let i = 0; i < loadedCorpora.length; i++) {
        if (loadedCorpora[i].name == corpusName)
            return i;
    }
    const newCorpus = loadCorpus(corpusName);
    if (typeof newCorpus === "number")
        return -1;
    else if (newCorpus.name == corpusName) {
        loadedCorpora.push(newCorpus);
        return loadedCorpora.length - 1;
    }
    return -1;
};
exports.getCorpusPositionByName = getCorpusPositionByName;
