"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parseCorpus_1 = __importDefault(require("../../corpus/parseCorpus"));
const fs_1 = __importDefault(require("fs"));
fs_1.default.writeFileSync("corpus/test/twoWord.txt", `the brown`, { flag: "w" });
(0, parseCorpus_1.default)("test/twoWord.txt", "test/twoWord");
(0, vitest_1.test)("nonempty corpus is generated", () => {
    const fileValue = fs_1.default.readFileSync("parsed/test/twoWord.json", "utf8");
    (0, vitest_1.expect)(fileValue).not.toBe("");
});
(0, vitest_1.test)("extended monogram creation", () => {
    const fileValue = fs_1.default.readFileSync("parsed/test/twoWord.json", "utf8");
    const corpus = JSON.parse(fileValue);
    (0, vitest_1.expect)(corpus.extendedMonograms).toMatchObject({
        t: 1,
        th: 1,
        he: 1,
        b: 1,
        br: 1,
        ro: 1,
        ow: 1,
        wn: 1,
    });
});
