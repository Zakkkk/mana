import { Command } from "../types";
import * as fs from "fs";

import parse from "../corpus/parseCorpus";
import viewLayout from "./viewLayout";
import setCorpusPositionByName from "../corpus/loadCorpus";
import { allExamples } from "./examples";
import loadLayout from "./loadLayout";
import { noCorpusLoaded } from "./messages";
import { getBigrams, getTrigrams } from "../corpus/corpusUtil";
import { edits } from "./edit";

const commands: Command[] = [
  {
    token: "explain",
    explain:
      "Explains commands... but I have a feeling you already know that...",
    minArgs: 1,
    maxArgs: 1,
    action: (_, args) => {
      for (let i = 0; i < commands.length; i++) {
        if (args[0] == commands[i].token) {
          console.log(commands[i].explain);
          return;
        }
      }

      console.log(`Command ${args[0]} not found.`);
    },
  },
  {
    token: "parse",
    explain:
      "[filename] [corpus name]:\nTransforms a file with text into a file with information about the frequencies of bigrams/trigrams/fourgrams. Looks for files inside of the folder /corpus and writes the output to /parsed",
    minArgs: 2,
    maxArgs: 2,
    action: async (_, args) => {
      console.log(`Parsing corpus with filename of ${args[0]}`);
      await parse(args[0], args[1]);
    },
  },
  {
    token: "layouts",
    explain: "Lists all json files inside of /layouts",
    maxArgs: 0,
    action: async () => {
      fs.readdirSync("layouts").forEach((file) => {
        if (file.includes(".json")) console.log(file.replace(/\.[^/.]+$/, ""));
      });
    },
  },
  {
    token: "view",
    explain:
      "[layout file name w/ extension]:\nViews a layout and all the stats associated.",
    minArgs: 1,
    maxArgs: 1,
    action: async (gs, args) => {
      viewLayout(gs, args[0]);
    },
  },
  {
    token: "corpora",
    explain: "Lists all json files inside of /parsed",
    maxArgs: 0,
    action: async () => {
      fs.readdirSync("parsed").forEach((file) => {
        if (file.includes(".json")) console.log(file.replace(/\.[^/.]+$/, ""));
      });
    },
  },
  {
    token: "corpus",
    explain:
      "[corpus name]:\nSwitches the current corpus to one of the ones that can be listed.",
    minArgs: 1,
    maxArgs: 1,
    action: async (gs, args) => {
      await setCorpusPositionByName(args[0], gs);
      if (gs.currentCorpora == -1)
        console.log(`Corpus ${args[0]} could not be loaded`);
    },
  },
  {
    token: "corpnow",
    explain:
      "Outputs the current corpus being used, as well as the corpus position.",
    maxArgs: 0,
    action: async (gs) => {
      console.log(
        `${gs.currentCorpora}: ${gs.currentCorpora == -1 ? "No corpus is currently loaded." : gs.loadedCorpora[gs.currentCorpora].name}`,
      );
    },
  },
  {
    token: "clear",
    explain: "Clears the terminal.",
    maxArgs: 0,
    action: () => {
      console.clear();
    },
  },
  {
    token: "end",
    explain: "Ends the program.",
    maxArgs: 0,
    action: () => {
      process.exit();
    },
  },
  {
    token: "help",
    explain: "Lists all the commands available.",
    maxArgs: 0,
    action: () => {
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        const minArgsCount =
          commands[i].minArgs == undefined ? 0 : commands[i].minArgs;
        const hasMaxArgs = commands[i].maxArgs != undefined;

        console.log(
          `${command.token}: requires ${minArgsCount}-${hasMaxArgs ? commands[i].maxArgs! : "∞"}  args`,
        );
      }
    },
  },
  {
    token: "bigrams",
    explain: "[layoutname]\nShows bigrams",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      console.log(getBigrams(gs.loadedCorpora[gs.currentCorpora], layout));
    },
  },
  {
    token: "trigrams",
    explain: "[layoutname]\nShows trigrams",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      console.log(getTrigrams(gs.loadedCorpora[gs.currentCorpora], layout));
    },
  },
  {
    token: "rules",
    explain: "[layoutname]:\n lists the magic rules for a layout",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      if (!layout.hasMagic) {
        console.log("This is not a magic layout.");
        return;
      }

      let magicRules = "";

      layout.magicRules.forEach((magicRule) => {
        magicRules += magicRule.activator + magicRule.transformTo + " ";
      });

      console.log(magicRules);
    },
  },
  ...edits,
  ...allExamples,
];

export default commands;
