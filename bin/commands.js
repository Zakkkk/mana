"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const parse_1 = __importDefault(require("./parse"));
const viewLayout_1 = __importDefault(require("./viewLayout"));
const loadCorpus_1 = __importDefault(require("./loadCorpus"));
const sfbs_1 = require("./commands/sfbs");
const sfs_1 = require("./commands/sfs");
const commands = [
    {
        token: "explain",
        explain: "Explains commands... but I have a feeling you already know that...",
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
        explain: "[filename] [corpus name]:\nTransforms a file with text into a file with information about the frequencies of bigrams/trigrams/fourgrams. Looks for files inside of the folder /corpus and writes the output to /parsed",
        args: 2,
        action: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Parsing corpus with filename of ${args[0]}`);
            yield (0, parse_1.default)(args[0], args[1]);
        }),
    },
    {
        token: "layouts",
        explain: "Lists all json files inside of /layouts",
        args: 0,
        action: () => __awaiter(void 0, void 0, void 0, function* () {
            fs.readdirSync("layouts").forEach((file) => {
                if (file.includes(".json"))
                    console.log(file.replace(/\.[^/.]+$/, ""));
            });
        }),
    },
    {
        token: "view",
        explain: "[layout file name w/ extension]:\nViews a layout and all the stats associated.",
        args: 1,
        action: (gs, args) => __awaiter(void 0, void 0, void 0, function* () {
            (0, viewLayout_1.default)(gs, args[0]);
        }),
    },
    sfbs_1.sfbs,
    sfs_1.sfs,
    {
        token: "corpora",
        explain: "Lists all json files inside of /parsed",
        args: 0,
        action: () => __awaiter(void 0, void 0, void 0, function* () {
            fs.readdirSync("parsed").forEach((file) => {
                if (file.includes(".json"))
                    console.log(file.replace(/\.[^/.]+$/, ""));
            });
        }),
    },
    {
        token: "corpus",
        explain: "[corpus name]:\nSwitches the current corpus to one of the ones that can be listed.",
        args: 1,
        action: (gs, args) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, loadCorpus_1.default)(args[0], gs);
            if (gs.currentCorpora == -1)
                console.log(`Corpus ${args[0]} could not be loaded`);
        }),
    },
    {
        token: "corpnow",
        explain: "Outputs the current corpus being used, as well as the corpus position.",
        args: 0,
        action: (gs) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`${gs.currentCorpora}: ${gs.currentCorpora == -1 ? "No corpus is currently loaded." : gs.loadedCorpora[gs.currentCorpora].name}`);
        }),
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
exports.default = commands;
