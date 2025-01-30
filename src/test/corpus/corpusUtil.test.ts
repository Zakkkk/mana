import { expect, test } from "vitest";

import fs from "fs";
import { Corpus, Layout } from "../../types";

import { loadCorpus } from "../../corpus/loadCorpus";
import parseCorpus from "../../corpus/parseCorpus";

import { getMonograms } from "../../corpus/corpusUtil";

fs.writeFileSync("corpus/test/corpusUtil1.txt", `a b c hi jk lm no pq rs`, {
  flag: "w",
});

parseCorpus("test/corpusUtil1.txt", "test/corpusUtil1");
// @ts-ignore
const corpusUtit1: Corpus = loadCorpus("test/corpusUtil1");

const layout: Layout = {
  name: "test",
  rows: ["abcdefghij", "klmno*qrst", "uvwxyz.;,'", "p"],
  fingermap: ["0123366789", "0123366789", "0123366789", "4"],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: ["hi", "jk", "lm"],
};

// test("Monogram collection", () => {
//   const monograms1 = getMonograms(corpusUtit1, layout);
//   expect(monograms1).toMatchObject({
//     a: 1,
//     b: 1,
//     c: 1,
//   });
// });
