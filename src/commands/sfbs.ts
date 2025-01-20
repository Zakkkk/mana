import { getBigrams } from "../corpusUtil";
import { getFingerKeyMap } from "../getStats";
import { getSfbs } from "../rules";
import loadLayout from "../loadLayout";

import { Command, Corpus, Layout, TokenFreq } from "../types";

export const sfbs: Command = {
  token: "sfbs",
  explain:
    "[layoutname]:\n Lists the top 20 ordered sfbs with their frequencies.",
  args: 1,
  action: async (gs, args) => {
    const layoutPos = loadLayout(gs, args[0]);
    if (layoutPos == -1) {
      console.log(`${args[0]} was not found.`);
      return;
    }

    if (gs.currentCorpora == -1) {
      console.log(
        "No corpus is currently loaded. Run `corpus [corpasname]` to set one.",
      );

      return;
    }

    const topSfb: TokenFreq = getNSortedSfbs(
      gs.loadedLayouts[layoutPos],
      gs.loadedCorpora[gs.currentCorpora],
      20,
    );

    console.log(
      `Top 20 ${gs.loadedLayouts[layoutPos].name} sfbs in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
    );

    let totalTopSfb = 0;

    let i = 1;
    for (const sfb in topSfb) {
      console.log(
        ` ${i}. ${sfb}: ${Math.round(topSfb[sfb]! * 10 ** 5) / 10 ** 3}%`,
      );

      totalTopSfb += Math.round(topSfb[sfb]! * 10 ** 5) / 10 ** 3;

      i++;
    }

    console.log(`Total 20 sfb: ${totalTopSfb}%`);
  },
};

const getNSortedSfbs = (
  layout: Layout,
  corpus: Corpus,
  amount: number,
): TokenFreq => {
  const sfbs = getSfbs(getBigrams(corpus, layout), getFingerKeyMap(layout));

  const sortedSfb = Object.fromEntries(
    Object.entries(sfbs).sort(([, a], [, b]) => b - a), // Sort by value in descending order
  );

  const topSortedSfb: TokenFreq = {};
  let i = 0;
  for (const sfb in sortedSfb) {
    topSortedSfb[sfb] = sortedSfb[sfb];

    i++;
    if (i >= amount) break;
  }

  return topSortedSfb;
};

export default getSfbs;
