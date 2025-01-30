import loadLayout from "./loadLayout";
import { Command, Layout, MagicRule } from "../types";
import viewLayout from "./viewLayout";
import * as fs from "fs";

const edits: Command[] = [];

const layoutNameModification = " (Modified)";

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

edits.push({
  token: "swap",
  minArgs: 2,
  explain: "[layoutname] [swap bigrams...]:\nView a swap and the stats for it",
  action: (gs, args): Layout | undefined => {
    const layoutName = args[0];
    const edits = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    layout.name += layoutNameModification;

    let noErrors = true;

    edits.forEach((swap) => {
      if (swap.length < 1) {
        console.log("Must have at least two letters to swap. Example 'ab'");
        noErrors = false;
        return;
      }

      if (swap.length == 2) {
        layout.rows = swapLettersInArray(layout.rows, swap[0], swap[1]);
      } else {
        for (let i = 0; i < swap.length - 1; i++)
          layout.rows = swapLettersInArray(layout.rows, swap[i], swap[i + 1]);
      }
    });

    if (noErrors) viewLayout(gs, "", layout);

    return noErrors ? layout : undefined;
  },
});

edits.push({
  token: "swap!",
  minArgs: 2,
  explain:
    "[layoutname] [swap bigrams...]:\nView a swap and the stats for it. Makes the changes permament to the file.",
  action: (gs, args) => {
    const filename = args[0];
    const layout: Layout | undefined = edits[0].action(gs, args);

    if (layout == undefined) return;

    try {
      const layoutFromFile = JSON.parse(
        fs.readFileSync(`layouts/${filename}.json`, "utf8"),
      );

      layoutFromFile.rows = layout.rows;

      fs.writeFileSync(
        `layouts/${filename}.json`,
        JSON.stringify(layoutFromFile, null, 2),
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

edits.push({
  token: "rulesadd",
  minArgs: 2,
  explain:
    "[layoutname] [add magic bigrams...]:\nAdds rules to a magic layout for preview.",
  action: (gs, args) => {
    const layoutName = args[0];
    const rules = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    if (!layout.hasMagic) {
      console.log("This layout does not have magic.");
      return;
    }

    layout.name += " (Modified)";

    const hasRuleWithStart = (rule: string): boolean => {
      for (let i = 0; i < layout.magicRules.length; i++)
        if (layout.magicRules[i][0] == rule[0]) return true;
      return false;
    };

    let noErrors = true;

    rules.forEach((rule) => {
      if (rule.length != 2) {
        console.log("rules must be two characters long only.");
        noErrors = false;
        return;
      }

      if (hasRuleWithStart(rule)) {
        console.log("A rule starting with the same key already exists.");
        noErrors = false;
        return;
      }

      layout.magicRules.push(rule);
    });

    if (noErrors) viewLayout(gs, "", layout);

    return noErrors ? layout : undefined;
  },
});

edits.push({
  token: "rulesadd!",
  minArgs: 2,
  explain:
    "[layoutname] [add magic bigrams...]:\nAdds rules to a magic layout for preview. Saves the changes to the layout.",
  action: (gs, args) => {
    const filename = args[0];
    const layout: Layout | undefined = edits[2].action(gs, args);

    if (layout == undefined) return;

    try {
      const layoutFromFile = JSON.parse(
        fs.readFileSync(`layouts/${filename}.json`, "utf8"),
      );

      layoutFromFile.magicRules = layout.magicRules;

      fs.writeFileSync(
        `layouts/${filename}.json`,
        JSON.stringify(layoutFromFile, null, 2),
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

edits.push({
  token: "rulesrm",
  minArgs: 2,
  explain:
    "[layoutname] [remove magic bigrams...]:\nRemoves rules from a magic layout for preview.",
  action: (gs, args) => {
    const layoutName = args[0];
    const rules = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    if (!layout.hasMagic) {
      console.log("This layout does not have magic.");
      return;
    }

    layout.name += " (Modified)";

    let noErrors = true;

    rules.forEach((rule) => {
      if (rule.length != 2) {
        console.log("rules must be two characters long only.");
        noErrors = false;
        return;
      }

      layout.magicRules.forEach((layoutRule, i) => {
        if (layoutRule == rule) layout.magicRules.splice(i, 1);
      });
    });

    if (noErrors) viewLayout(gs, "", layout);

    return noErrors ? layout : undefined;
  },
});

edits.push({
  token: "rulesrm!",
  minArgs: 2,
  explain:
    "[layoutname] [remove magic bigrams...]:\nRemoves rules from a magic layout for preview. Saves the changes to the layout.",
  action: (gs, args) => {
    const filename = args[0];
    const layout: Layout | undefined = edits[4].action(gs, args);

    if (layout == undefined) return;

    try {
      const layoutFromFile = JSON.parse(
        fs.readFileSync(`layouts/${filename}.json`, "utf8"),
      );

      layoutFromFile.magicRules = layout.magicRules;

      fs.writeFileSync(
        `layouts/${filename}.json`,
        JSON.stringify(layoutFromFile, null, 2),
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

edits.push({
  token: "ruleschange",
  minArgs: 2,
  explain:
    "[layoutname] [change magic bigrams...]:\nChanges rules from a magic layout for preview.",
  action: (gs, args) => {
    const layoutName = args[0];
    const rules = args;
    args.shift();

    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    const layout = gs.loadedLayouts[layoutPosition];

    if (!layout.hasMagic) {
      console.log("This layout does not have magic.");
      return;
    }

    layout.name += " (Modified)";

    let noErrors = true;

    rules.forEach((rule) => {
      if (rule.length != 2) {
        console.log("rules must be two characters long only.");
        noErrors = false;
        return;
      }

      layout.magicRules.forEach((layoutRule, i) => {
        if (layoutRule[0] == rule[0]) layout.magicRules[i] = rule;
      });
    });

    if (noErrors) viewLayout(gs, "", layout);

    return noErrors ? layout : undefined;
  },
});

edits.push({
  token: "ruleschange!",
  minArgs: 2,
  explain:
    "[layoutname] [changes magic bigrams...]:\nChanges rules of a magic layout for preview. Saves the changes to the layout.",
  action: (gs, args) => {
    const filename = args[0];
    const layout: Layout | undefined = edits[6].action(gs, args);

    if (layout == undefined) return;

    try {
      const layoutFromFile = JSON.parse(
        fs.readFileSync(`layouts/${filename}.json`, "utf8"),
      );

      layoutFromFile.magicRules = layout.magicRules;

      fs.writeFileSync(
        `layouts/${filename}.json`,
        JSON.stringify(layoutFromFile, null, 2),
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

export { edits };
