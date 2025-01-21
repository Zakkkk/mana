import * as fs from "fs";

import { Layout, GlobalSettings, MagicRule } from "./types";

const loadLayout = (gs: GlobalSettings, layoutName: string): number => {
  for (let i = 0; i < gs.loadedLayouts.length; i++) {
    if (gs.loadedLayouts[i].name == layoutName) {
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

      if (data.magicIdentifier != undefined && data.magicRules != undefined) {
        const magicRules: MagicRule[] = [];

        data.magicRules.forEach((magicRule: string) => {
          magicRules.push({
            activator: magicRule[0],
            transformTo: magicRule[1],
          });
        });

        data.magicRules = magicRules;

        gs.loadedLayouts.push(data);
        return gs.loadedLayouts.length - 1;
      }
    } else {
      console.log(
        "The layout could not be loaded because it is missing inforamtion.",
      );
    }
  } catch (err) {
    console.error(err);
    return -1;
  }

  return -1;
};

export default loadLayout;
