import commands from "./app/commands";
import { GlobalSettings } from "./types";
import * as fs from "fs";
import setCorpusPositionByName from "./corpus/loadCorpus";

import { setupKeypressHandling } from "./app/keypressHandler";

const evalInput = async (settings: GlobalSettings, input: string) => {
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
};

async function main() {
  const manaArgs = process.argv.splice(2);

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

  if (manaArgs.length > 0) {
    evalInput(settings, manaArgs.join(" "));
    return;
  }

  console.log(
    "'help' to list all commands.\n'explain [command]' for an explanation of any command.",
  );
  setupKeypressHandling(async (input) => {
    evalInput(settings, input);
  });
}

main();
