"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadLayout_1 = __importDefault(require("./loadLayout"));
const getStats_1 = __importDefault(require("./getStats"));
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
        const stats = (0, getStats_1.default)(layout, gs.loadedCorpora[gs.currentCorpora], {
            heatmapScore: true,
            handbalanceScore: true,
            sfb: true,
            alternate: true,
            inroll: true,
        });
        console.log(` Heatmap score: ${Math.round(stats.heatmapScore * 10 ** 5) / 10 ** 5}\n`, `Handbalance: ${Math.round(stats.handbalanceScore * 10 ** 5) / 10 ** 3}% / ${100 - Math.round(stats.handbalanceScore * 10 ** 5) / 10 ** 3}%\n`, `Sfb: ${Math.round(stats.sfb * 10 ** 5) / 10 ** 3}%\n`, `Alt: ${Math.round(stats.alternate * 10 ** 5) / 10 ** 3}%\n`, `Inroll: ${Math.round(stats.inroll * 10 ** 5) / 10 ** 3}%\n`);
    }
    else {
        console.log("No corpus loaded to show stats.");
    }
};
exports.default = viewLayout;
