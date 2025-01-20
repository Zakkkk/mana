import { getBigrams } from "../corpusUtil";
import { getFingerKeyMap } from "../getStats";
import { getFullScissors, getHalfScissors } from "../rules";
import loadLayout from "../loadLayout";

import { Command, Corpus, Layout, TokenFreq } from "../types";

export const hs: Command = {
  token: "hs",
  explain:
    "[layoutname]:\n Lists the top 20 ordered half scissors with their frequencies.",
  args: 1,
  action: async (gs, args) => {
    const layoutPos = loadLayout(gs, args[0]);
    if (layoutPos == -1) {
      console.log(`${args[0]} was not found.`);
      return;
    }

    if (gs.currentCorpora == -1) {
      console.log(
        "No corpus is currently loaded. Run `corpus [corpusname]` to set one.",
      );

      return;
    }

    const topHs: TokenFreq = getNSortedHs(
      gs.loadedLayouts[layoutPos],
      gs.loadedCorpora[gs.currentCorpora],
      20,
    );

    console.log(
      `Top 20 ${gs.loadedLayouts[layoutPos].name} full scissors in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
    );

    let totalTopHs = 0;

    let i = 1;
    for (const hs in topHs) {
      console.log(
        ` ${i}. ${hs}: ${Math.round(topHs[hs]! * 10 ** 5) / 10 ** 3}%`,
      );

      totalTopHs += Math.round(topHs[hs]! * 10 ** 5) / 10 ** 3;

      i++;
    }

    console.log(`Total 20 half scissors: ${totalTopHs}%`);
  },
};

const getNSortedHs = (
  layout: Layout,
  corpus: Corpus,
  amount: number,
): TokenFreq => {
  const hss = getHalfScissors(
    getBigrams(corpus, layout),
    getFingerKeyMap(layout),
    layout,
  );

  const sortedHs = Object.fromEntries(
    Object.entries(hss).sort(([, a], [, b]) => b - a), // Sort by value in descending order
  );

  const topSortedHs: TokenFreq = {};
  let i = 0;
  for (const hs in sortedHs) {
    topSortedHs[hs] = sortedHs[hs];

    i++;
    if (i >= amount) break;
  }

  return topSortedHs;
};
