"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadLayout_1 = __importDefault(require("./loadLayout"));
const corpusUtil_1 = require("./corpusUtil");
const viewLayout = (gs, layoutName) => {
    const layoutPosition = (0, loadLayout_1.default)(gs, layoutName);
    if (layoutPosition == -1) {
        console.log(`Layout ${layoutName} was not found.`);
        return;
    }
    let layout = gs.loadedLayouts[layoutPosition];
    console.log(layout.name);
    layout.rows.forEach((row) => {
        console.log(`\t${row.split("").join(" ")}`);
    });
    if (gs.currentCorpora != -1) {
        const monograms = (0, corpusUtil_1.getMonograms)(gs.loadedCorpora[gs.currentCorpora], layout);
        console.log(monograms);
    }
    else {
        console.log("No corpus loaded to show stats.");
    }
};
exports.default = viewLayout;
