import { expect, test } from "vitest";
import parseCorpus from "../../corpus/parseCorpus";
import fs from "fs";

fs.writeFileSync("corpus/test/twoWord.txt", `the brown`, { flag: "w" });

parseCorpus("test/twoWord.txt", "test/twoWord");

test("nonempty corpus is generated", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  expect(fileValue).not.toBe("");
});

test("extended monogram creation", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  const corpus = JSON.parse(fileValue);

  expect(corpus.extendedMonograms).toMatchObject({
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
