"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(require("./parse"));
const listAllCommandsString = `
  parse 'filename' 'corpus name': parses a corpus
  load 'corpusfilename': loads a corpus
  clear: clears the terminal
  end: ends the program
`;
const commands = [
    {
        token: "parse",
        args: 2,
        action: (args) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Parsing corpus with filename of ${args[0]}...`);
            yield (0, parse_1.default)(args[0], args[1]);
        }),
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
exports.default = commands;
