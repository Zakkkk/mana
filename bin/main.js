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
const commands_1 = __importDefault(require("./app/commands"));
const fs = __importStar(require("fs"));
const loadCorpus_1 = __importDefault(require("./corpus/loadCorpus"));
const keypressHandler_1 = require("./app/keypressHandler");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = {
            loadedCorpora: [],
            currentCorpora: -1,
            loadedLayouts: [],
        };
        try {
            (0, loadCorpus_1.default)(fs.readFileSync("defaultLoadCorpus", "utf-8"), settings);
        }
        catch (_a) { }
        console.log("'help' to list all commands.\n'explain [command]' for an explanation of any command.");
        process.stdout.write("> ");
        (0, keypressHandler_1.setupKeypressHandling)((input) => __awaiter(this, void 0, void 0, function* () {
            const args = input.split(" ");
            const command = args.shift();
            let commandFound = false;
            for (let i = 0; i < commands_1.default.length; i++) {
                if (command == commands_1.default[i].token) {
                    const minArgsCount = commands_1.default[i].minArgs == undefined ? 0 : commands_1.default[i].minArgs;
                    const hasMaxArgs = commands_1.default[i].maxArgs != undefined;
                    if (args.length < minArgsCount ||
                        (hasMaxArgs && args.length > commands_1.default[i].maxArgs)) {
                        console.log(`Invalid number of arguments. Accepting ${minArgsCount}-${hasMaxArgs ? commands_1.default[i].maxArgs : "∞"} but got ${args.length}.`);
                    }
                    else {
                        yield commands_1.default[i].action(settings, args);
                        commandFound = true;
                    }
                }
            }
            if (!commandFound) {
                console.log("Your input did not match a valid command.\n'help' to list all commands.\n'explain [command]' for an explanation of any command.");
            }
        }));
    });
}
main();
