import loadLayout from "./loadLayout";
import { GlobalSettings, Layout, LayoutStats } from "./types";
import {
  getBigrams,
  getMonograms,
  getSkip2grams,
  getTrigrams,
} from "./corpusUtil";
import getLayoutStats from "./getLayoutStats";
import getStats from "./getStats";

const viewLayout = (gs: GlobalSettings, layoutName: string) => {
  const layoutPosition = loadLayout(gs, layoutName);

  if (layoutPosition == -1) {
    console.log(`Layout ${layoutName} was not found.`);
    return;
  }

  let layout = gs.loadedLayouts[layoutPosition];

  console.log(layout.name);

  layout.rows.forEach((row) => {
    console.log(`\t${row.split("").join(" ")}`);
  });

  if (gs.currentCorpora != -1) {
    const stats: LayoutStats = getStats(
      layout,
      gs.loadedCorpora[gs.currentCorpora],
      {
        heatmapScore: true,
      },
    );

    console.log(`Heatmap score: ${stats.heatmapScore}`);
  } else {
    console.log("No corpus loaded to show stats.");
  }
};

export default viewLayout;
