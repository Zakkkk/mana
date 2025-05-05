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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const parseCorpus_1 = __importDefault(require("../corpus/parseCorpus"));
const viewLayout_1 = __importDefault(require("./viewLayout"));
const loadCorpus_1 = __importDefault(require("../corpus/loadCorpus"));
const examples_1 = require("./examples");
const loadLayout_1 = __importDefault(require("./loadLayout"));
const messages_1 = require("./messages");
const corpusUtil_1 = require("../corpus/corpusUtil");
const edit_1 = require("./edit");
const getStats_1 = __importDefault(require("../analyse/getStats"));
const commands = [
    {
        token: "explain",
        explain: "Explains commands... but I have a feeling you already know that...",
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
        explain: "[filename] [corpus name]:\nTransforms a file with text into a file with information about the frequencies of bigrams/trigrams/fourgrams. Looks for files inside of the folder /corpus and writes the output to /parsed",
        minArgs: 2,
        maxArgs: 2,
        action: async (_, args) => {
            console.log(`Parsing corpus with filename of ${args[0]}`);
            await (0, parseCorpus_1.default)(args[0], args[1]);
        },
    },
    {
        token: "layouts",
        explain: "Lists all json files inside of /layouts",
        maxArgs: 0,
        action: async () => {
            fs.readdirSync("layouts").forEach((file) => {
                if (file.includes(".json"))
                    console.log(file.replace(/\.[^/.]+$/, ""));
            });
        },
    },
    {
        token: "view",
        explain: "[layout file name w/ extension]:\nViews a layout and all the stats associated.",
        minArgs: 1,
        maxArgs: 1,
        action: async (gs, args) => {
            (0, viewLayout_1.default)(gs, args[0]);
        },
    },
    {
        token: "corpora",
        explain: "Lists all json files inside of /parsed",
        maxArgs: 0,
        action: async () => {
            fs.readdirSync("parsed").forEach((file) => {
                if (file.includes(".json"))
                    console.log(file.replace(/\.[^/.]+$/, ""));
            });
        },
    },
    {
        token: "corpus",
        explain: "[corpus name]:\nSwitches the current corpus to one of the ones that can be listed.",
        minArgs: 1,
        maxArgs: 1,
        action: async (gs, args) => {
            await (0, loadCorpus_1.default)(args[0], gs);
            if (gs.currentCorpora == -1)
                console.log(`Corpus ${args[0]} could not be loaded`);
        },
    },
    {
        token: "corpnow",
        explain: "Outputs the current corpus being used, as well as the corpus position.",
        maxArgs: 0,
        action: async (gs) => {
            console.log(`${gs.currentCorpora}: ${gs.currentCorpora == -1 ? "No corpus is currently loaded." : gs.loadedCorpora[gs.currentCorpora].name}`);
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
                const minArgsCount = commands[i].minArgs == undefined ? 0 : commands[i].minArgs;
                const hasMaxArgs = commands[i].maxArgs != undefined;
                console.log(`${command.token}: requires ${minArgsCount}-${hasMaxArgs ? commands[i].maxArgs : "∞"}  args`);
            }
        },
    },
    {
        token: "bigrams",
        explain: "[layoutname]\nShows bigrams",
        minArgs: 1,
        maxArgs: 1,
        action: (gs, args) => {
            const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
            if (layoutPos == -1) {
                console.log(`${args[0]} was not found.`);
                return;
            }
            const layout = gs.loadedLayouts[layoutPos];
            if (gs.currentCorpora == -1) {
                (0, messages_1.noCorpusLoaded)();
                return;
            }
            console.log((0, corpusUtil_1.getBigrams)(gs.loadedCorpora[gs.currentCorpora], layout));
        },
    },
    {
        token: "trigrams",
        explain: "[layoutname]\nShows trigrams",
        minArgs: 1,
        maxArgs: 1,
        action: (gs, args) => {
            const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
            if (layoutPos == -1) {
                console.log(`${args[0]} was not found.`);
                return;
            }
            const layout = gs.loadedLayouts[layoutPos];
            if (gs.currentCorpora == -1) {
                (0, messages_1.noCorpusLoaded)();
                return;
            }
            console.log((0, corpusUtil_1.getTrigrams)(gs.loadedCorpora[gs.currentCorpora], layout));
        },
    },
    {
        token: "time",
        explain: "[command]\n Times a command",
        minArgs: 1,
        action: (gs, args) => {
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].token == args[0]) {
                    const time = new Date().getTime();
                    commands[i].action(gs, [...args].slice(1));
                    console.log(`Took ${(new Date().getTime() - time) / 1000}s to complete.`);
                    break;
                }
            }
        },
    },
    {
        token: "timen",
        explain: "[amount of times to run] [command]\n Times a command",
        minArgs: 2,
        action: (gs, args) => {
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].token == args[1]) {
                    const time = new Date().getTime();
                    for (let j = 0; j < parseInt(args[0]); j++)
                        commands[i].action(gs, [...args].slice(2));
                    console.log(`Took ${(new Date().getTime() - time) / 1000}s to complete.`);
                    break;
                }
            }
        },
    },
    {
        token: "rules",
        explain: "[layoutname]:\n lists the magic rules for a layout",
        minArgs: 1,
        maxArgs: 1,
        action: (gs, args) => {
            const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
            if (layoutPos == -1) {
                console.log(`${args[0]} was not found.`);
                return;
            }
            const layout = gs.loadedLayouts[layoutPos];
            if (gs.currentCorpora == -1) {
                (0, messages_1.noCorpusLoaded)();
                return;
            }
            if (!layout.hasMagic) {
                console.log("This is not a magic layout.");
                return;
            }
            console.log(layout.magicRules.join(" "));
        },
    },
    {
        token: "fingers",
        explain: "[layoutname]\nShows finger usage for a layout.",
        minArgs: 1,
        maxArgs: 1,
        action: (gs, args) => {
            const layoutPos = (0, loadLayout_1.default)(gs, args[0]);
            if (layoutPos == -1) {
                console.log(`${args[0]} was not found.`);
                return;
            }
            const layout = gs.loadedLayouts[layoutPos];
            if (gs.currentCorpora == -1) {
                (0, messages_1.noCorpusLoaded)();
                return;
            }
            const fingers = (0, getStats_1.default)(layout, gs.loadedCorpora[gs.currentCorpora], {
                fingerFreq: true,
            }).fingerFreq;
            fingers?.forEach((amount, finger) => {
                let x = Math.round(amount * 10 ** 5) / 10 ** 3;
                console.log(`${finger}: ${x}%`);
            });
        },
    },
    ...edit_1.edits,
    ...examples_1.allExamples,
];
exports.default = commands;
