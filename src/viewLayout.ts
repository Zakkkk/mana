import loadLayout from "./loadLayout";
import { GlobalSettings, Layout } from "./types";
import { getMonograms } from "./corpusUtil";

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
    const monograms = getMonograms(gs.loadedCorpora[gs.currentCorpora], layout);
    console.log(monograms);
  } else {
    console.log("No corpus loaded to show stats.");
  }
};

export default viewLayout;
