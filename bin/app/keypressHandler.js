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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupKeypressHandling = setupKeypressHandling;
const readline = __importStar(require("readline"));
function setupKeypressHandling(processInput) {
    const history = [];
    let historyIndex = -1;
    let currentInput = "";
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    process.stdin.on("keypress", (str, key) => __awaiter(this, void 0, void 0, function* () {
        if (key.ctrl && key.name === "c") {
            process.stdout.write("\nExiting...\n");
            process.exit();
        }
        const isMac = process.platform === "darwin";
        switch (key.name) {
            case "return":
                if (currentInput.trim()) {
                    history.push(currentInput);
                    historyIndex = history.length;
                }
                const input = currentInput;
                currentInput = "";
                process.stdout.write("\n");
                yield processInput(input);
                process.stdout.write("> ");
                break;
            case "up":
                if (historyIndex > 0) {
                    historyIndex--;
                    currentInput = history[historyIndex];
                }
                rewriteLine(currentInput);
                break;
            case "down":
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    currentInput = history[historyIndex];
                }
                else {
                    historyIndex = history.length;
                    currentInput = "";
                }
                rewriteLine(currentInput);
                break;
            case "backspace":
                if (isMac && key.meta) {
                    // Command+Backspace: Delete entire line
                    currentInput = "";
                }
                else if (isMac && key.alt) {
                    // Option+Backspace: Delete last word
                    currentInput = currentInput.replace(/\s*\S*$/, ""); // Remove the last word
                }
                else {
                    // Regular Backspace: Delete the last character
                    currentInput = currentInput.slice(0, -1);
                }
                rewriteLine(currentInput);
                break;
            default:
                if (!key.ctrl && !key.meta) {
                    currentInput += str;
                    rewriteLine(currentInput);
                }
        }
    }));
}
function rewriteLine(input) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write("> " + input);
}
