import { expect, test } from "vitest";
import parseCorpus from "../../corpus/parseCorpus";
import fs from "fs";

fs.writeFileSync("corpus/test/twoWord.txt", `the brown`, { flag: "w" });
parseCorpus("test/twoWord.txt", "test/twoWord");

test("nonempty corpus is generated with the correct name", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  const corpus = JSON.parse(fileValue);

  expect(fileValue).not.toBe("");
  expect(corpus.name).toBe("test/twoWord");
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

test("extended bigram creation", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  const corpus = JSON.parse(fileValue);

  expect(corpus.extendedBigrams).toMatchObject({
    th: 1,
    the: 1,
    br: 1,
    row: 1,
    own: 1,
  });
});

test("extended trigram creation", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  const corpus = JSON.parse(fileValue);

  expect(corpus.extendedTrigrams).toMatchObject({
    the: 1,
    bro: 1,
    brow: 1,
    rown: 1,
  });
});

test("extended skip2gram creation", () => {
  const fileValue = fs.readFileSync("parsed/test/twoWord.json", "utf8");

  const corpus = JSON.parse(fileValue);

  expect(corpus.extendedSkip2grams).toMatchObject({
    bow: 1,
    brwn: 1,
  });
});
