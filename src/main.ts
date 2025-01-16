import commands from "./commands";
import { Corpus, GlobalSettings } from "./types";
const readline = require("readline-sync");

async function main() {
  const settings: GlobalSettings = {
    loadedCorpora: [],
    currentCorpora: -1,
  };

  console.log(
    "'help' to list all commands.\n'explain [command]' for an explanation of any command",
  );

  for (;;) {
    const input = readline.question("> ");
    const args = input.split(" ");
    const command = args[0];
    args.shift();

    let commandFound = false;

    for (let i = 0; i < commands.length; i++) {
      if (command == commands[i].token) {
        if (args.length != commands[i].args) {
          console.log(
            `Invalid number of arguments. Expecting ${commands[i].args} but got ${args.length}.`,
          );
        } else {
          // the await below does indeed have an effect lol
          await commands[i].action(settings, args);
          commandFound = true;
        }
      }
    }

    if (!commandFound)
      console.log(
        "Your input did not match a valid command.\n'help' to list all commands.\n'explain [command]' for an explanation of any command.",
      );
  }
}

main();
