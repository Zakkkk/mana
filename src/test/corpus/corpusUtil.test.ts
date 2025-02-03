import { expect, test } from "vitest";

import fs from "fs";
import { Corpus, Layout } from "../../types";

import { loadCorpus } from "../../corpus/loadCorpus";
import parseCorpus from "../../corpus/parseCorpus";

import { getBigrams, getMonograms, getTrigrams } from "../../corpus/corpusUtil";

fs.writeFileSync("corpus/test/corpusUtil1.txt", `p a b c hi jk lm na`, {
  flag: "w",
});

fs.writeFileSync(
  "corpus/test/corpusUtil2.txt",
  `him ghost realm hihihi eeeee how`,
  {
    flag: "w",
  },
);

parseCorpus("test/corpusUtil1.txt", "test/corpusUtil1");
parseCorpus("test/corpusUtil2.txt", "test/corpusUtil2");
// @ts-ignore
const corpusUtit1: Corpus = loadCorpus("test/corpusUtil1", false);
// @ts-ignore
const corpusUtit2: Corpus = loadCorpus("test/corpusUtil2", false);

const layout: Layout = {
  name: "test",
  rows: ["abcdefghij", "klmno*qrst", "uvwxyz.;,'", "p"],
  fingermap: ["0123366789", "0123366789", "0123366789", "4"],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: ["hi", "jk", "lm", "ee"],
};

test("Monogram collection", () => {
  const monograms1 = getMonograms(corpusUtit1, layout);
  const monograms1Total = 12;
  expect(monograms1).toMatchObject({
    a: 2 / monograms1Total,
    b: 1 / monograms1Total,
    c: 1 / monograms1Total,
    h: 1 / monograms1Total,
    "*": 3 / monograms1Total,
    j: 1 / monograms1Total,
    l: 1 / monograms1Total,
    n: 1 / monograms1Total,
    p: 1 / monograms1Total,
  });

  const monograms2 = getMonograms(corpusUtit2, layout);
  const monograms2Total = 27;
  expect(monograms2).toMatchObject({
    h: 6 / monograms2Total,
    a: 1 / monograms2Total,
    "*": 9 / monograms2Total,
    m: 1 / monograms2Total,
    g: 1 / monograms2Total,
    o: 2 / monograms2Total,
    s: 1 / monograms2Total,
    t: 1 / monograms2Total,
    r: 1 / monograms2Total,
    e: 2 / monograms2Total,
    l: 1 / monograms2Total,
    w: 1 / monograms2Total,
  });
});

test("Bigram collection", () => {
  const bigrams1 = getBigrams(corpusUtit1, layout);
  const bigrams1Total = 4;
  expect(bigrams1).toMatchObject({
    "h*": 1 / bigrams1Total,
    "j*": 1 / bigrams1Total,
    "l*": 1 / bigrams1Total,
    na: 1 / bigrams1Total,
  });

  const bigrams2 = getBigrams(corpusUtit2, layout);
  const bigrams2Total = 21;
  expect(bigrams2).toMatchObject({
    "h*": 4 / bigrams2Total,
    "*m": 1 / bigrams2Total,
    gh: 1 / bigrams2Total,
    ho: 2 / bigrams2Total,
    os: 1 / bigrams2Total,
    st: 1 / bigrams2Total,
    re: 1 / bigrams2Total,
    ea: 1 / bigrams2Total,
    al: 1 / bigrams2Total,
    "l*": 1 / bigrams2Total,
    "*h": 2 / bigrams2Total,
    "e*": 1 / bigrams2Total,
    "*e": 3 / bigrams2Total,
    ow: 1 / bigrams2Total,
  });
});

test("trigram collection", () => {
  const trigrams1 = getTrigrams(corpusUtit1, layout);
  expect(trigrams1).toMatchObject({});

  const trigrams2 = getTrigrams(corpusUtit2, layout);
  const trigrams2Total = 15;
  expect(trigrams2).toMatchObject({
    "h*m": 1 / trigrams2Total,
    gho: 1 / trigrams2Total,
    hos: 1 / trigrams2Total,
    ost: 1 / trigrams2Total,
    rea: 1 / trigrams2Total,
    eal: 1 / trigrams2Total,
    "al*": 1 / trigrams2Total,
    "h*h": 2 / trigrams2Total,
    "*h*": 2 / trigrams2Total,
    "e*e": 1 / trigrams2Total,
    "*e*": 2 / trigrams2Total,
    how: 1 / trigrams2Total,
  });
});
