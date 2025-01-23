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
exports.swaps = void 0;
const loadLayout_1 = __importDefault(require("./loadLayout"));
const viewLayout_1 = __importDefault(require("./viewLayout"));
const fs = __importStar(require("fs"));
const swaps = [];
exports.swaps = swaps;
function swapLettersInArray(array, letter1, letter2) {
    return array.map((str) => str
        .split("")
        .map((char) => {
        if (char === letter1)
            return letter2;
        if (char === letter2)
            return letter1;
        return char;
    })
        .join(""));
}
swaps.push({
    token: "swap",
    minArgs: 2,
    explain: "[layoutname] [swap bigrams...]:\nView a swap and the stats for it",
    action: (gs, args) => {
        const layoutName = args[0];
        const swaps = args;
        args.shift();
        const layoutPosition = (0, loadLayout_1.default)(gs, layoutName);
        if (layoutPosition == -1) {
            console.log(`Layout ${layoutName} was not found.`);
            return;
        }
        const layout = gs.loadedLayouts[layoutPosition];
        layout.name += " (Modified)";
        swaps.forEach((swap) => {
            if (swap.length < 2) {
                console.log("Must have at least two letters to swap. Example 'ab'");
                return;
            }
            if (swap.length == 2) {
                layout.rows = swapLettersInArray(layout.rows, swap[0], swap[1]);
            }
            else {
                for (let i = 0; i < swap.length - 1; i++)
                    layout.rows = swapLettersInArray(layout.rows, swap[i], swap[i + 1]);
            }
        });
        (0, viewLayout_1.default)(gs, "", layout);
    },
});
swaps.push({
    token: "swap!",
    minArgs: 2,
    explain: "[layoutname] [swap bigrams...]:\nView a swap and the stats for it. Makes the changes permament to the file.",
    action: (gs, args) => {
        const layoutName = args[0];
        const swaps = args;
        args.shift();
        const layoutPosition = (0, loadLayout_1.default)(gs, layoutName);
        if (layoutPosition == -1) {
            console.log(`Layout ${layoutName} was not found.`);
            return;
        }
        const layout = gs.loadedLayouts[layoutPosition];
        swaps.forEach((swap) => {
            if (swap.length < 2) {
                console.log("Must have at least two letters to swap. Example 'ab'");
                return;
            }
            if (swap.length == 2) {
                layout.rows = swapLettersInArray(layout.rows, swap[0], swap[1]);
            }
            else {
                for (let i = 0; i < swap.length - 1; i++)
                    layout.rows = swapLettersInArray(layout.rows, swap[i], swap[i + 1]);
            }
        });
        (0, viewLayout_1.default)(gs, "", layout);
        try {
            const layoutFromFile = JSON.parse(fs.readFileSync(`layouts/${layoutName}.json`, "utf8"));
            layoutFromFile.rows = layout.rows;
            fs.writeFileSync(`layouts/${layoutName}.json`, JSON.stringify(layoutFromFile), {
                flag: "w",
            });
            console.log("Layout updated!");
        }
        catch (err) {
            console.log("There was an error writing the updates to the layout.");
            console.error(err);
        }
    },
});
