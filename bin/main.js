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
const commands_1 = __importDefault(require("./commands"));
const readline = require("readline-sync");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = {
            loadedCorpora: [],
            currentCorpora: -1,
            loadedLayouts: [],
        };
        console.log("'help' to list all commands.\n'explain [command]' for an explanation of any command.");
        for (;;) {
            const input = readline.question("> ");
            const args = input.split(" ");
            const command = args[0];
            args.shift();
            let commandFound = false;
            for (let i = 0; i < commands_1.default.length; i++) {
                if (command == commands_1.default[i].token) {
                    if (args.length != commands_1.default[i].args) {
                        console.log(`Invalid number of arguments. Expecting ${commands_1.default[i].args} but got ${args.length}.`);
                    }
                    else {
                        // the await below does indeed have an effect lol
                        yield commands_1.default[i].action(settings, args);
                        commandFound = true;
                    }
                }
            }
            if (!commandFound)
                console.log("Your input did not match a valid command.\n'help' to list all commands.\n'explain [command]' for an explanation of any command.");
        }
    });
}
main();
