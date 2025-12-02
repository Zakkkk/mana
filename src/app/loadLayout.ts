import * as fs from "fs";

import { GlobalSettings } from "../types";

const loadLayout = (gs: GlobalSettings, layoutName: string): number => {
  for (let i = 0; i < gs.loadedLayouts.length; i++) {
    if (gs.loadedLayouts[i].name.toLowerCase() == layoutName.toLowerCase()) {
      return i;
    }
  }

  let data;

  try {
    data = JSON.parse(fs.readFileSync(`layouts/${layoutName}.json`, "utf8"));

    if (
      data.name != undefined &&
      data.rows != undefined &&
      data.fingermap != undefined &&
      data.hasMagic != undefined
    ) {
      if (!data.hasMagic) {
        gs.loadedLayouts.push(data);
        return gs.loadedLayouts.length - 1;
      }

      if (data.willRepeatUnlessOverridden == undefined)
        data.willRepeatUnlessOverridden = false;

      if (data.magicIdentifier != undefined && data.magicRules != undefined) {
        gs.loadedLayouts.push(data);
        return gs.loadedLayouts.length - 1;
      }
    } else {
      console.log(
        "The layout could not be loaded because it is missing inforamtion.",
      );
    }
  } catch (err) {
    console.error(
      "There was a problem loading this layout. Double check the JSON is formatted properly and run `layouts` to check that the file is being found.",
    );
    return -1;
  }

  return -1;
};

export default loadLayout;
