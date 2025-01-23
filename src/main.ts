import commands from "./commands";
import { GlobalSettings } from "./types";
import readline from "readline-sync";
import * as fs from "fs";
import setCorpusPositionByName from "./loadCorpus";

import { setupKeypressHandling } from "./keypressHandler";

async function main() {
  const settings: GlobalSettings = {
    loadedCorpora: [],
    currentCorpora: -1,
    loadedLayouts: [],
  };

  try {
    setCorpusPositionByName(
      fs.readFileSync("defaultLoadCorpus", "utf-8"),
      settings,
    );
  } catch {}

  console.log(
    "'help' to list all commands.\n'explain [command]' for an explanation of any command.",
  );

  process.stdout.write("> ");

  setupKeypressHandling(async (input) => {
    const args = input.split(" ");
    const command = args.shift();

    let commandFound = false;

    for (let i = 0; i < commands.length; i++) {
      if (command == commands[i].token) {
        const minArgsCount =
          commands[i].minArgs == undefined ? 0 : commands[i].minArgs;
        const hasMaxArgs = commands[i].maxArgs != undefined;

        if (
          args.length < minArgsCount! ||
          (hasMaxArgs && args.length > commands[i].maxArgs!)
        ) {
          console.log(
            `Invalid number of arguments. Accepting ${minArgsCount}-${
              hasMaxArgs ? commands[i].maxArgs! : "∞"
            } but got ${args.length}.`,
          );
        } else {
          await commands[i].action(settings, args);
          commandFound = true;
        }
      }
    }

    if (!commandFound) {
      console.log(
        "Your input did not match a valid command.\n'help' to list all commands.\n'explain [command]' for an explanation of any command.",
      );
    }
  });
}

main();
