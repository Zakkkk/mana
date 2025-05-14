import { getBigrams, getSkip2grams, getTrigrams } from "../corpus/corpusUtil";
import { getFingerKeyMap } from "../analyse/getStats";
import loadLayout from "./loadLayout";
import { noCorpusLoaded } from "./messages";
import {
  getAlternates,
  getFullScissors,
  getHalfScissors,
  getSkipFullScissors,
  getSkipHalfScissors,
  getIn3roll,
  getInrolls,
  getLsb,
  getLss,
  getOut3roll,
  getOutrolls,
  getRedirects,
  getRedirectWeaks,
  getSfbs,
  getSfr,
  getSfs,
  getSfsr,
} from "../analyse/rules";
import { Command, Corpus, Layout, TokenFreq } from "../types";

const getCommand = (
  name: string,
  token: string,
  getSpecificStats: (
    ngrams: TokenFreq,
    fingerKeyMap: TokenFreq,
    layout?: Layout,
  ) => TokenFreq,
  getOverallNGrams: (corpus: Corpus, layout: Layout) => TokenFreq,
  getLayout: boolean,
): Command => {
  const command: Command = {
    token: token,
    minArgs: 1,
    maxArgs: 2,
    explain: `[layoutname] [optional amount]:\nLists the top ordered ${name} with their frequencies.`,
    action: (gs, args) => {
      const maxAmount = args.length == 2 ? parseInt(args[1]) : 20;

      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();

        return;
      }

      const ngramsOverall = getOverallNGrams(
        gs.loadedCorpora[gs.currentCorpora],
        gs.loadedLayouts[loadLayout(gs, args[0])],
      );

      let ngrams: TokenFreq;

      if (!getLayout)
        ngrams = getSpecificStats(
          ngramsOverall,
          getFingerKeyMap(gs.loadedLayouts[loadLayout(gs, args[0])]),
        );
      else
        ngrams = getSpecificStats(
          ngramsOverall,
          getFingerKeyMap(gs.loadedLayouts[loadLayout(gs, args[0])]),
          layout,
        );

      const sorted = Object.fromEntries(
        Object.entries(ngrams).sort(([, a], [, b]) => b - a), // Sort by value in descending order
      );

      const topSorted: TokenFreq = {};
      let loopCount = 0;
      for (const ngram in sorted) {
        topSorted[ngram] = sorted[ngram];

        loopCount++;
        if (loopCount >= maxAmount) break;
      }

      console.log(
        `Top ${maxAmount} ${layout.name} ${name} in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
      );

      let totalTop = 0;

      let i = 1;
      for (const ngram in topSorted) {
        console.log(
          ` ${i}. ${ngram}: ${Math.round(topSorted[ngram]! * 10 ** 5) / 10 ** 3}%`,
        );

        totalTop += Math.round(topSorted[ngram]! * 10 ** 5) / 10 ** 3;

        i++;
      }

      console.log(`Total ${maxAmount} ${name}: ${totalTop}%`);
    },
  };

  return command;
};

export const allRuleExamples: Command[] = [
  getCommand("sfb's", "sfb", getSfbs, getBigrams, false),
  getCommand("sfr's", "sfr", getSfr, getBigrams, false),
  // @ts-ignore
  getCommand("lsb's", "lsb", getLsb, getBigrams, true),
  // @ts-ignore
  getCommand("lss's", "lss", getLss, getTrigrams, true),
  // @ts-ignore
  getCommand("lss2's", "lss2", getLsb, getSkip2grams, true),
  // @ts-ignore
  getCommand("half scissors", "hsb", getHalfScissors, getBigrams, true),
  // @ts-ignore
  getCommand("full scissors", "fsb", getFullScissors, getBigrams, true),
  getCommand(
    "skip half scissors",
    "hss",
    // @ts-ignore
    getSkipHalfScissors,
    getTrigrams,
    true,
  ),
  getCommand(
    "skip full scissors",
    "fss",
    // @ts-ignore
    getSkipFullScissors,
    getTrigrams,
    true,
  ),
  getCommand(
    "skip 2 half scissors",
    "hss2",
    // @ts-ignore
    getHalfScissors,
    getSkip2grams,
    true,
  ),
  getCommand(
    "skip 2 full scissors",
    "fss2",
    // @ts-ignore
    getFullScissors,
    getSkip2grams,
    true,
  ),
  getCommand("sfs's", "sfs", getSfs, getTrigrams, false),
  getCommand("sfs2's", "sfs2", getSfbs, getSkip2grams, false),
  getCommand("sfsr's", "sfsr", getSfsr, getTrigrams, false),
  getCommand("alts", "alt", getAlternates, getTrigrams, false),
  getCommand("redirects", "red", getRedirects, getTrigrams, false),
  getCommand("weak redirects", "redw", getRedirectWeaks, getTrigrams, false),
  getCommand("inrolls", "inroll", getInrolls, getTrigrams, false),
  getCommand("outrolls", "outroll", getOutrolls, getTrigrams, false),
  getCommand("in 3rolls", "in3roll", getIn3roll, getTrigrams, false),
  getCommand("out 3rolls", "out3roll", getOut3roll, getTrigrams, false),
];
