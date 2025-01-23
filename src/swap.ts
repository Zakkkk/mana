import loadLayout from "./loadLayout";
import { Command } from "./types";
import viewLayout from "./viewLayout";
import * as fs from "fs";

const swaps: Command[] = [];

function swapLettersInArray(
  array: string[],
  letter1: string,
  letter2: string,
): string[] {
  return array.map((str) =>
    str
      .split("")
      .map((char) => {
        if (char === letter1) return letter2;
        if (char === letter2) return letter1;
        return char;
      })
      .join(""),
  );
}

swaps.push({
  token: "swap",
  minArgs: 2,
  explain: "[layoutname] [swap bigrams...]:\nView a swap and the stats for it",
  action: (gs, args) => {
    const layoutName = args[0];
    const swaps = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    layout.name += " (Modified)";

    swaps.forEach((swap) => {
      if (swap.length < 2) {
        console.log("Must have at least two letters to swap. Example 'ab'");
        return;
      }

      if (swap.length == 2) {
        layout.rows = swapLettersInArray(layout.rows, swap[0], swap[1]);
      } else {
        for (let i = 0; i < swap.length - 1; i++)
          layout.rows = swapLettersInArray(layout.rows, swap[i], swap[i + 1]);
      }
    });

    viewLayout(gs, "", layout);
  },
});

swaps.push({
  token: "swap!",
  minArgs: 2,
  explain:
    "[layoutname] [swap bigrams...]:\nView a swap and the stats for it. Makes the changes permament to the file.",
  action: (gs, args) => {
    const layoutName = args[0];
    const swaps = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    swaps.forEach((swap) => {
      if (swap.length < 2) {
        console.log("Must have at least two letters to swap. Example 'ab'");
        return;
      }

      if (swap.length == 2) {
        layout.rows = swapLettersInArray(layout.rows, swap[0], swap[1]);
      } else {
        for (let i = 0; i < swap.length - 1; i++)
          layout.rows = swapLettersInArray(layout.rows, swap[i], swap[i + 1]);
      }
    });

    viewLayout(gs, "", layout);

    try {
      const layoutFromFile = JSON.parse(
        fs.readFileSync(`layouts/${layoutName}.json`, "utf8"),
      );

      layoutFromFile.rows = layout.rows;

      fs.writeFileSync(
        `layouts/${layoutName}.json`,
        JSON.stringify(layoutFromFile),
        {
          flag: "w",
        },
      );

      console.log("Layout updated!");
    } catch (err) {
      console.log("There was an error writing the updates to the layout.");

      console.error(err);
    }
  },
});

export { swaps };
