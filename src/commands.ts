import { Command } from "./types";
import * as fs from "fs";

import parse from "./parse";
import viewLayout from "./viewLayout";
import setCorpusPositionByName from "./loadCorpus";

const commands: Command[] = [
  {
    token: "explain",
    explain:
      "Explains commands... but I have a feeling you already know that...",
    args: 1,
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
    args: 2,
    action: async (_, args) => {
      console.log(`Parsing corpus with filename of ${args[0]}`);
      await parse(args[0], args[1]);
    },
  },
  {
    token: "layouts",
    explain: "Lists all json files inside of /layouts",
    args: 0,
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
    args: 1,
    action: async (gs, args) => {
      viewLayout(gs, args[0]);
    },
  },
  {
    token: "corpora",
    explain: "Lists all json files inside of /parsed",
    args: 0,
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
    args: 1,
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
    args: 0,
    action: async (gs) => {
      console.log(
        `${gs.currentCorpora}: ${gs.currentCorpora == -1 ? "No corpus is currently loaded." : gs.loadedCorpora[gs.currentCorpora].name}`,
      );
    },
  },
  {
    token: "clear",
    explain: "Clears the terminal.",
    args: 0,
    action: () => {
      console.clear();
    },
  },
  {
    token: "end",
    explain: "Ends the program.",
    args: 0,
    action: () => {
      process.exit();
    },
  },
  {
    token: "help",
    explain: "Lists all the commands available.",
    args: 0,
    action: () => {
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        console.log(`${command.token}: requires ${command.args} args`);
      }
    },
  },
];

export default commands;
