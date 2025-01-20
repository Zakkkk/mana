import { getBigrams } from "../corpusUtil";
import { getFingerKeyMap } from "../getStats";
import { getFullScissors } from "../rules";
import loadLayout from "../loadLayout";

import { Command, Corpus, Layout, TokenFreq } from "../types";

export const fs: Command = {
  token: "fs",
  explain:
    "[layoutname]:\n Lists the top 20 ordered full scissors with their frequencies.",
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

    const topFs: TokenFreq = getNSortedFs(
      gs.loadedLayouts[layoutPos],
      gs.loadedCorpora[gs.currentCorpora],
      20,
    );

    console.log(
      `Top 20 ${gs.loadedLayouts[layoutPos].name} full scissors in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
    );

    let totalTopFs = 0;

    let i = 1;
    for (const fs in topFs) {
      console.log(
        ` ${i}. ${fs}: ${Math.round(topFs[fs]! * 10 ** 5) / 10 ** 3}%`,
      );

      totalTopFs += Math.round(topFs[fs]! * 10 ** 5) / 10 ** 3;

      i++;
    }

    console.log(`Total 20 full scissors: ${totalTopFs}%`);
  },
};

const getNSortedFs = (
  layout: Layout,
  corpus: Corpus,
  amount: number,
): TokenFreq => {
  const fss = getFullScissors(
    getBigrams(corpus, layout),
    getFingerKeyMap(layout),
    layout,
  );

  const sortedFs = Object.fromEntries(
    Object.entries(fss).sort(([, a], [, b]) => b - a), // Sort by value in descending order
  );

  const topSortedFs: TokenFreq = {};
  let i = 0;
  for (const fs in sortedFs) {
    topSortedFs[fs] = sortedFs[fs];

    i++;
    if (i >= amount) break;
  }

  return topSortedFs;
};
