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
    console.log(layout.name +
        (gs.currentCorpora != -1
            ? ` | ${gs.loadedCorpora[gs.currentCorpora].name}`
            : ""));
    layout.rows.forEach((row) => {
        console.log(`\t${row.split(" ").join("~").split("").join(" ")}\n\n`);
    });
    if (gs.currentCorpora != -1) {
        const stats = (0, getStats_1.default)(layout, gs.loadedCorpora[gs.currentCorpora], {
            heatmapScore: true,
            handbalanceScore: true,
            sfb: true,
            sfr: true,
            sfs: true,
            sfs2: true,
            sfsr: true,
            alternate: true,
            redirect: true,
            redirectWeak: true,
            inroll: true,
            outroll: true,
            in3roll: true,
            out3roll: true,
        });
        console.log(` Heatmap score: ${Math.round(stats.heatmapScore * 10 ** 5) / 10 ** 5}\n`, `Handbalance: ${Math.round(stats.handbalanceScore * 10 ** 5) / 10 ** 3}% / ${100 - Math.round(stats.handbalanceScore * 10 ** 5) / 10 ** 3}%\n`, `Sfb (Total): ${Math.round((stats.sfb + stats.sfr) * 10 ** 5) / 10 ** 3}%\n`, ` Sfb: ${Math.round(stats.sfb * 10 ** 5) / 10 ** 3}%\n`, ` Sfr: ${Math.round(stats.sfr * 10 ** 5) / 10 ** 3}%\n`, `Sfs: ${Math.round(stats.sfs * 10 ** 5) / 10 ** 3}%\n`, `Sfs2: ${Math.round(stats.sfs2 * 10 ** 5) / 10 ** 3}%\n`, `Sfsr: ${Math.round(stats.sfsr * 10 ** 5) / 10 ** 3}%\n`, `Alt: ${Math.round(stats.alternate * 10 ** 5) / 10 ** 3}%\n`, `Redirect: ${Math.round(stats.redirect * 10 ** 5) / 10 ** 3}%\n`, `Redirect (Weak): ${Math.round(stats.redirectWeak * 10 ** 5) / 10 ** 3}%\n`, `Rolls (Total): ${Math.round((stats.out3roll + stats.in3roll + stats.outroll + stats.inroll) * 10 ** 5) / 10 ** 3}%\n`, ` Inroll: ${Math.round(stats.inroll * 10 ** 5) / 10 ** 3}%\n`, ` Outroll: ${Math.round(stats.outroll * 10 ** 5) / 10 ** 3}%\n`, ` In3roll: ${Math.round(stats.in3roll * 10 ** 5) / 10 ** 3}%\n`, ` Out3roll: ${Math.round(stats.out3roll * 10 ** 5) / 10 ** 3}%\n`);
    }
    else {
        console.log("No corpus loaded to show stats.");
    }
};
exports.default = viewLayout;
