import { expect, test } from "vitest";
import { swapLettersInArray, edits } from "../../app/edit.ts";
import { GlobalSettings, Layout } from "../../types.ts";

const rows = [".lswkzvuog", "ijncy*teah", "fxbpqdm;',", "r"];

const testLayout1: Layout = {
  name: "testLayout1",
  rows: rows,
  fingermap: [],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: [],
};

const gs: GlobalSettings = {
  loadedCorpora: [],
  currentCorpora: -1,
  loadedLayouts: [testLayout1],
};

test("single swaps work with swapLettersInArray", () => {
  expect(swapLettersInArray(rows, "l", "s")).toEqual([
    ".slwkzvuog",
    "ijncy*teah",
    "fxbpqdm;',",
    "r",
  ]);

  expect(swapLettersInArray(rows, "g", "h")).toEqual([
    ".lswkzvuoh",
    "ijncy*teag",
    "fxbpqdm;',",
    "r",
  ]);

  expect(swapLettersInArray(rows, "*", "r")).toEqual([
    ".lswkzvuog",
    "ijncyrteah",
    "fxbpqdm;',",
    "*",
  ]);

  expect(swapLettersInArray(rows, "a", "e")).toEqual([
    ".lswkzvuog",
    "ijncy*taeh",
    "fxbpqdm;',",
    "r",
  ]);
});

test("single swaps work with swap command", () => {
  expect(edits[0].action(gs, ["testLayout1", "ls"]).rows).toEqual([
    ".slwkzvuog",
    "ijncy*teah",
    "fxbpqdm;',",
    "r",
  ]);

  expect(edits[0].action(gs, ["testLayout1", "gh"]).rows).toEqual([
    ".lswkzvuoh",
    "ijncy*teag",
    "fxbpqdm;',",
    "r",
  ]);

  expect(edits[0].action(gs, ["testLayout1", "*r"]).rows).toEqual([
    ".lswkzvuog",
    "ijncyrteah",
    "fxbpqdm;',",
    "*",
  ]);

  expect(
    edits[0].action(gs, ["testLayout1", "*r", "ha", "he", "gf"]).rows,
  ).toEqual([".lswkzvuof", "ijncyrthea", "gxbpqdm;',", "*"]);
});

test("multi swaps work with swap command", () => {
  expect(edits[0].action(gs, ["testLayout1", "gouv"]).rows).toEqual([
    ".lswkzuogv",
    "ijncy*teah",
    "fxbpqdm;',",
    "r",
  ]);

  expect(edits[0].action(gs, ["testLayout1", "drn", "tbrk"]).rows).toEqual([
    ".lswrzvuog",
    "ijbcy*keah",
    "fxtpqnm;',",
    "d",
  ]);
});
