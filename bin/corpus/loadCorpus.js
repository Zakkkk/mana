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
exports.loadCorpus = void 0;
const fs = __importStar(require("fs"));
const loadCorpus = (corpusName, overWriteDefaut) => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(`parsed/${corpusName}.json`, "utf8"));
        if (overWriteDefaut != false)
            try {
                fs.writeFileSync(`defaultLoadCorpus`, corpusName, {
                    flag: "w",
                });
            }
            catch { }
    }
    catch (err) {
        // console.error(err);
        return -1;
    }
    let corpus = {
        name: data.name,
        extendedMonograms: data.extendedMonograms,
        extendedBigrams: data.extendedBigrams,
        extendedTrigrams: data.extendedTrigrams,
        extendedSkip2grams: data.extendedSkip2grams,
    };
    return corpus;
};
exports.loadCorpus = loadCorpus;
const setCorpusPositionByName = async (corpusName, gs, overWriteDefault) => {
    for (let i = 0; i < gs.loadedCorpora.length; i++) {
        if (gs.loadedCorpora[i].name == corpusName) {
            gs.currentCorpora = i;
            console.log(`Corpus has been set to ${corpusName}!`);
            return true;
        }
    }
    const newCorpus = (0, exports.loadCorpus)(corpusName, overWriteDefault);
    if (typeof newCorpus === "number")
        return false;
    else if (newCorpus.name == corpusName) {
        gs.loadedCorpora.push(newCorpus);
        gs.currentCorpora = gs.loadedCorpora.length - 1;
        console.log(`Corpus has been set to ${corpusName}!`);
        return true;
    }
    return false;
};
exports.default = setCorpusPositionByName;
