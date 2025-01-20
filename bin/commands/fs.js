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
exports.fs = void 0;
const corpusUtil_1 = require("../corpusUtil");
const getStats_1 = require("../getStats");
const rules_1 = require("../rules");
const loadLayout_1 = __importDefault(require("../loadLayout"));
exports.fs = {
    token: "fs",
    explain: "[layoutname]:\n Lists the top 20 ordered full scissors with their frequencies.",
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
        const topFs = getNSortedFs(gs.loadedLayouts[layoutPos], gs.loadedCorpora[gs.currentCorpora], 20);
        console.log(`Top 20 ${gs.loadedLayouts[layoutPos].name} full scissors in ${gs.loadedCorpora[gs.currentCorpora].name}:`);
        let totalTopFs = 0;
        let i = 1;
        for (const fs in topFs) {
            console.log(` ${i}. ${fs}: ${Math.round(topFs[fs] * 10 ** 5) / 10 ** 3}%`);
            totalTopFs += Math.round(topFs[fs] * 10 ** 5) / 10 ** 3;
            i++;
        }
        console.log(`Total 20 full scissors: ${totalTopFs}%`);
    }),
};
const getNSortedFs = (layout, corpus, amount) => {
    const fss = (0, rules_1.getFullScissors)((0, corpusUtil_1.getBigrams)(corpus, layout), (0, getStats_1.getFingerKeyMap)(layout), layout);
    const sortedFs = Object.fromEntries(Object.entries(fss).sort(([, a], [, b]) => b - a));
    const topSortedFs = {};
    let i = 0;
    for (const fs in sortedFs) {
        topSortedFs[fs] = sortedFs[fs];
        i++;
        if (i >= amount)
            break;
    }
    return topSortedFs;
};
