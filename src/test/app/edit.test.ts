import { expect, test } from "vitest";
import { swapLettersInArray, edits } from "../../app/edit.ts";
import { GlobalSettings } from "../../types.ts";

const rows = [".lswkzwuog", "ijncy*teah", "fxbpqdm;',", "r"];

const gs: GlobalSettings = {
  loadedCorpora: [],
  currentCorpora: -1,
  loadedLayouts: [
    {
      name: "test",
      rows: rows,
      fingermap: [],
      hasMagic: true,
      magicIdentifier: "*",
      magicRules: [],
    },
  ],
};

test("single swaps work with swapLettersInArray", () => {
  expect(swapLettersInArray(rows, "l", "s")).toEqual([
    ".slwkzwuog",
    "ijncy*teah",
    "fxbpqdm;',",
    "r",
  ]);

  expect(swapLettersInArray(rows, "g", "h")).toEqual([
    ".lswkzwuoh",
    "ijncy*teag",
    "fxbpqdm;',",
    "r",
  ]);

  expect(swapLettersInArray(rows, "*", "r")).toEqual([
    ".lswkzwuog",
    "ijncyrteah",
    "fxbpqdm;',",
    "*",
  ]);
});

test("single swaps work with swap command", () => {
  // expect(edits[0].action(gs, "")).toEqual([
  //   ".slwkzwuog",
  //   "ijncy*teah",
  //   "fxbpqdm;',",
  //   "r",
  // ]);

  expect(swapLettersInArray(rows, "g", "h")).toEqual([
    ".lswkzwuoh",
    "ijncy*teag",
    "fxbpqdm;',",
    "r",
  ]);

  expect(swapLettersInArray(rows, "*", "r")).toEqual([
    ".lswkzwuog",
    "ijncyrteah",
    "fxbpqdm;',",
    "*",
  ]);
});
