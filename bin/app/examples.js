"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allExamples = void 0;
const corpusUtil_1 = require("../corpus/corpusUtil");
const getStats_1 = require("../analyse/getStats");
const loadLayout_1 = __importDefault(require("./loadLayout"));
const messages_1 = require("./messages");
const rules_1 = require("../analyse/rules");
const getCommand = (name, token, getSpecificStats, getOverallNGrams, getLayout) => {
    const command = {
        token: token,
        minArgs: 1,
        maxArgs: 2,
        explain: `[layoutname] [optional amount]:\nLists the top ordered ${name} with their frequencies.`,
        action: (gs, args) => {
            const maxAmount = args.length == 2 ? parseInt(args[1]) : 20;
            const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
            if (layoutPos == -1) {
                console.log(`${args[0]} was not found.`);
                return;
            }
            const layout = gs.loadedLayouts[layoutPos];
            if (gs.currentCorpora == -1) {
                (0, messages_1.noCorpusLoaded)();
                return;
            }
            const ngramsOverall = getOverallNGrams(gs.loadedCorpora[gs.currentCorpora], gs.loadedLayouts[(0, loadLayout_1.default)(gs, args[0])]);
            let ngrams;
            if (!getLayout)
                ngrams = getSpecificStats(ngramsOverall, (0, getStats_1.getFingerKeyMap)(gs.loadedLayouts[(0, loadLayout_1.default)(gs, args[0])]));
            else
                ngrams = getSpecificStats(ngramsOverall, (0, getStats_1.getFingerKeyMap)(gs.loadedLayouts[(0, loadLayout_1.default)(gs, args[0])]), layout);
            const sorted = Object.fromEntries(Object.entries(ngrams).sort(([, a], [, b]) => b - a));
            const topSorted = {};
            let loopCount = 0;
            for (const ngram in sorted) {
                topSorted[ngram] = sorted[ngram];
                loopCount++;
                if (loopCount >= maxAmount)
                    break;
            }
            console.log(`Top ${maxAmount} ${layout.name} ${name} in ${gs.loadedCorpora[gs.currentCorpora].name}:`);
            let totalTop = 0;
            let i = 1;
            for (const ngram in topSorted) {
                console.log(` ${i}. ${ngram}: ${Math.round(topSorted[ngram] * 10 ** 5) / 10 ** 3}%`);
                totalTop += Math.round(topSorted[ngram] * 10 ** 5) / 10 ** 3;
                i++;
            }
            console.log(`Total ${maxAmount} ${name}: ${totalTop}%`);
        },
    };
    return command;
};
exports.allExamples = [
    getCommand("sfb's", "sfb", rules_1.getSfbs, corpusUtil_1.getBigrams, false),
    getCommand("sfr's", "sfr", rules_1.getSfr, corpusUtil_1.getBigrams, false),
    // @ts-ignore
    getCommand("lsb's", "lsb", rules_1.getLsb, corpusUtil_1.getBigrams, true),
    // @ts-ignore
    getCommand("lss's", "lss", rules_1.getLss, corpusUtil_1.getTrigrams, true),
    // @ts-ignore
    getCommand("lss2's", "lss2", rules_1.getLsb, corpusUtil_1.getSkip2grams, true),
    // @ts-ignore
    getCommand("half scissors", "hs", rules_1.getHalfScissors, corpusUtil_1.getBigrams, true),
    // @ts-ignore
    getCommand("full scissors", "fs", rules_1.getSkipFullScissors, corpusUtil_1.getBigrams, true),
    getCommand("skip half scissors", "hss", 
    // @ts-ignore
    rules_1.getSkipHalfScissors, corpusUtil_1.getTrigrams, true),
    getCommand("skip full scissors", "fss", 
    // @ts-ignore
    rules_1.getSkipFullScissors, corpusUtil_1.getTrigrams, true),
    getCommand("skip 2 full scissors", "hss2", 
    // @ts-ignore
    rules_1.getFullScissors, corpusUtil_1.getSkip2grams, true),
    getCommand("skip 2 full scissors", "fss2", 
    // @ts-ignore
    rules_1.getFullScissors, corpusUtil_1.getSkip2grams, true),
    getCommand("sfs's", "sfs", rules_1.getSfs, corpusUtil_1.getTrigrams, false),
    getCommand("sfs2's", "sfs2", rules_1.getSfbs, corpusUtil_1.getSkip2grams, false),
    getCommand("sfsr's", "sfsr", rules_1.getSfsr, corpusUtil_1.getTrigrams, false),
    getCommand("alts", "alt", rules_1.getAlternates, corpusUtil_1.getTrigrams, false),
    getCommand("redirects", "red", rules_1.getRedirects, corpusUtil_1.getTrigrams, false),
    getCommand("weak redirects", "redw", rules_1.getRedirectWeaks, corpusUtil_1.getTrigrams, false),
    getCommand("inrolls", "inroll", rules_1.getInrolls, corpusUtil_1.getTrigrams, false),
    getCommand("outrolls", "outroll", rules_1.getOutrolls, corpusUtil_1.getTrigrams, false),
    getCommand("in 3rolls", "in3roll", rules_1.getIn3roll, corpusUtil_1.getTrigrams, false),
    getCommand("out 3rolls", "out3roll", rules_1.getOut3roll, corpusUtil_1.getTrigrams, false),
];
