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
    let cursorPos = 0;
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    process.stdin.on("keypress", (str, key) => __awaiter(this, void 0, void 0, function* () {
        const isMac = process.platform === "darwin";
        if (key.ctrl && key.name === "c") {
            process.exit();
        }
        if (key.name === "return") {
            if (currentInput.trim()) {
                history.push(currentInput);
                historyIndex = history.length;
            }
            const input = currentInput;
            currentInput = "";
            cursorPos = 0;
            process.stdout.write("\n");
            yield processInput(input);
            process.stdout.write("> ");
            return;
        }
        // Key handling
        switch (key.sequence) {
            case "\x7f": // Backspace
                if (cursorPos > 0) {
                    currentInput =
                        currentInput.slice(0, cursorPos - 1) +
                            currentInput.slice(cursorPos);
                    cursorPos -= 1;
                }
                break;
            case "\x1b[3~": // Delete key
                if (cursorPos < currentInput.length) {
                    currentInput =
                        currentInput.slice(0, cursorPos) +
                            currentInput.slice(cursorPos + 1);
                }
                break;
            case "\x1b[D": // Left Arrow
                if (cursorPos > 0)
                    cursorPos -= 1;
                break;
            case "\x1b[C": // Right Arrow
                if (cursorPos < currentInput.length)
                    cursorPos += 1;
                break;
            case "\x1b[H": // Home (Command+Left on macOS)
            case "\x1b[1~": // Home (Linux/Windows)
                cursorPos = 0;
                break;
            case "\x1b[F": // End (Command+Right on macOS)
            case "\x1b[4~": // End (Linux/Windows)
                cursorPos = currentInput.length;
                break;
            case "\x1b\x7f": // Option+Backspace
                const leftOfCursor = currentInput.slice(0, cursorPos);
                const rightOfCursor = currentInput.slice(cursorPos);
                const newLeft = leftOfCursor.replace(/\S+\s*$/, ""); // Remove last word
                cursorPos = newLeft.length;
                currentInput = newLeft + rightOfCursor;
                break;
            case "\x1bb": // Option+Left
                if (isMac) {
                    const left = currentInput.slice(0, cursorPos);
                    const match = left.match(/(\S+\s*)$/);
                    cursorPos -= match ? match[0].length : 0;
                    if (cursorPos < 0)
                        cursorPos = 0;
                }
                break;
            case "\x1bf": // Option+Right
                if (isMac) {
                    const right = currentInput.slice(cursorPos);
                    const match = right.match(/^(\S+\s*)/);
                    cursorPos += match ? match[0].length : 0;
                    if (cursorPos > currentInput.length)
                        cursorPos = currentInput.length;
                }
                break;
            case "\x1b[A": // Up Arrow
                if (historyIndex > 0) {
                    historyIndex -= 1;
                    currentInput = history[historyIndex];
                    cursorPos = currentInput.length;
                }
                break;
            case "\x1b[B": // Down Arrow
                if (historyIndex < history.length - 1) {
                    historyIndex += 1;
                    currentInput = history[historyIndex];
                    cursorPos = currentInput.length;
                }
                else {
                    historyIndex = history.length;
                    currentInput = "";
                    cursorPos = 0;
                }
                break;
            default:
                if (!key.ctrl &&
                    !key.meta &&
                    key.sequence &&
                    key.sequence.length === 1) {
                    // Append any single printable character
                    currentInput += key.sequence;
                    rewriteLine(currentInput, cursorPos);
                    cursorPos++;
                }
                break;
        }
        // Rewrite line
        rewriteLine(currentInput, cursorPos);
    }));
    process.stdout.write("> ");
    function rewriteLine(input, cursorPos) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write("> " + input);
        readline.cursorTo(process.stdout, cursorPos + 2); // Account for prompt "> "
    }
}
