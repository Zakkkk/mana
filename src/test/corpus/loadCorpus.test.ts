import { expect, test } from "vitest";
import parseCorpus from "../../corpus/parseCorpus";
import { loadCorpus } from "../../corpus/loadCorpus";
import setCorpusPositionByName from "../../corpus/loadCorpus";
import fs from "fs";
import { GlobalSettings } from "../../types";

fs.writeFileSync(
  "corpus/test/loadCorpus1.txt",
  `hello world! This is a corpus`,
  { flag: "w" },
);

fs.writeFileSync(
  "corpus/test/loadCorpus2.txt",
  `hello world! This is another corpus!`,
  { flag: "w" },
);

parseCorpus("test/loadCorpus1.txt", "test/loadCorpus1");
parseCorpus("test/loadCorpus2.txt", "test/loadCorpus2");

test("loadCorpus gives -1 for nonexistant corpus", () => {
  expect(loadCorpus("doesNotExist")).toBe(-1);
});

test("loadCorpus finds existing corpora", () => {
  const loadCorpus1 = loadCorpus("test/loadCorpus1", false);
  const loadCorpus2 = loadCorpus("test/loadCorpus2", false);

  expect(loadCorpus1).not.toBe(-1);
  // @ts-ignore if the value is non-zero then its a valid corpus
  expect(loadCorpus1.name).toBe("test/loadCorpus1");
  expect(loadCorpus2).not.toBe(-1);
  // @ts-ignore
  expect(loadCorpus2.name).toBe("test/loadCorpus2");
});

const gs: GlobalSettings = {
  loadedCorpora: [
    {
      name: "exists",
      extendedMonograms: {},
      extendedBigrams: {},
      extendedTrigrams: {},
      extendedSkip2grams: {},
    },
  ],
  currentCorpora: -1,
  loadedLayouts: [],
};

test("setCorpusPositionByName finds layout that already was found", () => {
  gs.currentCorpora = -1;
  setCorpusPositionByName("exists", gs);

  expect(gs.currentCorpora).toBe(0);
  gs.currentCorpora = -1;
});

test("setCorpusPositionByName finds layout that was not already found", () => {
  gs.currentCorpora = -1;
  setCorpusPositionByName("test/loadCorpus1", gs);

  expect(gs.currentCorpora).toBe(1);
  gs.currentCorpora = -1;
});
