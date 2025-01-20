import { getBigrams, getTrigrams } from "../corpusUtil";
import { getFingerKeyMap } from "../getStats";
import { getSfs } from "../rules";
import loadLayout from "../loadLayout";

import { Command, Corpus, Layout, TokenFreq } from "../types";

export const sfs: Command = {
  token: "sfs",
  explain:
    "[layoutname]:\n Lists the top 20 ordered sfs with their frequencies.",
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

    const topSfs: TokenFreq = getNSortedSfs(
      gs.loadedLayouts[layoutPos],
      gs.loadedCorpora[gs.currentCorpora],
      20,
    );

    console.log(
      `Top 20 ${gs.loadedLayouts[layoutPos].name} sfs in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
    );

    let totalTopSfs = 0;

    let i = 1;
    for (const sfs in topSfs) {
      console.log(
        ` ${i}. ${sfs[0]}${sfs[1]}: ${Math.round(topSfs[sfs]! * 10 ** 5) / 10 ** 3}%`,
      );

      totalTopSfs += Math.round(topSfs[sfs]! * 10 ** 5) / 10 ** 3;

      i++;
    }

    console.log(`Total 20 sfs: ${totalTopSfs}%`);
  },
};

const getNSortedSfs = (
  layout: Layout,
  corpus: Corpus,
  amount: number,
): TokenFreq => {
  const sfss = getSfs(getTrigrams(corpus, layout), getFingerKeyMap(layout));

  const sortedSfss = Object.fromEntries(
    Object.entries(sfss).sort(([, a], [, b]) => b - a), // Sort by value in descending order
  );

  const topSortedSfss: TokenFreq = {};
  let i = 0;
  for (const sfs in sortedSfss) {
    topSortedSfss[sfs] = sortedSfss[sfs];

    i++;
    if (i >= amount) break;
  }

  return topSortedSfss;
};
