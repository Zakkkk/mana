import { Command } from "./types";

import parse from "./parse";

const listAllCommandsString = `
  parse 'filename' 'corpus name': parses a corpus
  load 'corpusfilename': loads a corpus
  clear: clears the terminal
  end: ends the program
`;

const commands: Command[] = [
  {
    token: "parse",
    args: 2,
    action: async (args) => {
      console.log(`Parsing corpus with filename of ${args[0]}...`);
      await parse(args[0], args[1]);
    },
  },
  {
    token: "clear",
    args: 0,
    action: (args) => {
      console.clear();
    },
  },
  {
    token: "end",
    args: 0,
    action: (args) => {
      process.exit();
    },
  },
  {
    token: "help",
    args: 0,
    action: (args) => {
      console.log(listAllCommandsString);
    },
  },
];

export default commands;
