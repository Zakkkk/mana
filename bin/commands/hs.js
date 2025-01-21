"use strict";
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
exports.hs = void 0;
const corpusUtil_1 = require("../corpusUtil");
const getStats_1 = require("../getStats");
const rules_1 = require("../rules");
const loadLayout_1 = __importDefault(require("../loadLayout"));
exports.hs = {
    token: "hs",
    explain: "[layoutname]:\n Lists the top 20 ordered half scissors with their frequencies.",
    args: 1,
    action: (gs, args) => __awaiter(void 0, void 0, void 0, function* () {
        const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
        if (layoutPos == -1) {
            console.log(`${args[0]} was not found.`);
            return;
        }
        if (gs.currentCorpora == -1) {
            console.log("No corpus is currently loaded. Run `corpus [corpusname]` to set one.");
            return;
        }
        const topHs = getNSortedHs(gs.loadedLayouts[layoutPos], gs.loadedCorpora[gs.currentCorpora], 20);
        console.log(`Top 20 ${gs.loadedLayouts[layoutPos].name} half scissors in ${gs.loadedCorpora[gs.currentCorpora].name}:`);
        let totalTopHs = 0;
        let i = 1;
        for (const hs in topHs) {
            console.log(` ${i}. ${hs}: ${Math.round(topHs[hs] * 10 ** 5) / 10 ** 3}%`);
            totalTopHs += Math.round(topHs[hs] * 10 ** 5) / 10 ** 3;
            i++;
        }
        console.log(`Total 20 half scissors: ${totalTopHs}%`);
    }),
};
const getNSortedHs = (layout, corpus, amount) => {
    const hss = (0, rules_1.getHalfScissors)((0, corpusUtil_1.getBigrams)(corpus, layout), (0, getStats_1.getFingerKeyMap)(layout), layout);
    const sortedHs = Object.fromEntries(Object.entries(hss).sort(([, a], [, b]) => b - a));
    const topSortedHs = {};
    let i = 0;
    for (const hs in sortedHs) {
        topSortedHs[hs] = sortedHs[hs];
        i++;
        if (i >= amount)
            break;
    }
    return topSortedHs;
};
