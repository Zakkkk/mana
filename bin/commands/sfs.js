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
exports.sfs = void 0;
const corpusUtil_1 = require("../corpusUtil");
const getStats_1 = require("../getStats");
const rules_1 = require("../rules");
const loadLayout_1 = __importDefault(require("../loadLayout"));
exports.sfs = {
    token: "sfs",
    explain: "[layoutname]:\n Lists the top 20 ordered sfs with their frequencies.",
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
        const topSfs = getNSortedSfs(gs.loadedLayouts[layoutPos], gs.loadedCorpora[gs.currentCorpora], 20);
        console.log(`Top 20 ${gs.loadedLayouts[layoutPos].name} sfs in ${gs.loadedCorpora[gs.currentCorpora].name}:`);
        let totalTopSfs = 0;
        let i = 1;
        for (const sfs in topSfs) {
            console.log(` ${i}. ${sfs[0]}${sfs[1]}: ${Math.round(topSfs[sfs] * 10 ** 5) / 10 ** 3}%`);
            totalTopSfs += Math.round(topSfs[sfs] * 10 ** 5) / 10 ** 3;
            i++;
        }
        console.log(`Total 20 sfs: ${totalTopSfs}%`);
    }),
};
const getNSortedSfs = (layout, corpus, amount) => {
    const sfss = (0, rules_1.getSfs)((0, corpusUtil_1.getTrigrams)(corpus, layout), (0, getStats_1.getFingerKeyMap)(layout));
    const sortedSfss = Object.fromEntries(Object.entries(sfss).sort(([, a], [, b]) => b - a));
    const topSortedSfss = {};
    let i = 0;
    for (const sfs in sortedSfss) {
        topSortedSfss[sfs] = sortedSfss[sfs];
        i++;
        if (i >= amount)
            break;
    }
    return topSortedSfss;
};
