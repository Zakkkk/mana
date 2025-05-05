import { expect, test } from "vitest";
import fs from "fs";
import { swapLettersInArray, edits } from "../../app/edit.ts";
import { GlobalSettings, Layout } from "../../types.ts";
import loadLayout from "../../app/loadLayout.ts";

const rows = [".lswkzvuog", "ijncy*teah", "fxbpqdm;',", "r"];

const testLayout1: Layout = {
  name: "testLayout1",
  rows: rows,
  fingermap: [],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: [],
};

const testLayout2: Layout = {
  name: "test/testLayout2",
  rows: rows,
  fingermap: [],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: ["ab"],
};

const gs: GlobalSettings = {
  loadedCorpora: [],
  currentCorpora: -1,
  loadedLayouts: [testLayout1],
};

const resetTestLayout2 = () => {
  gs.loadedLayouts.splice(loadLayout(gs, "test/testLayout2"), 1);

  fs.writeFileSync(
    "layouts/test/testLayout2.json",
    JSON.stringify(testLayout2),
    {
      flag: "w",
    },
  );
};

resetTestLayout2();

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

test("combination of multi swaps and single swaps with swap command", () => {
  expect(edits[0].action(gs, ["testLayout1", "abc", "fr", ".g"]).rows).toEqual([
    "glswkzvuo.",
    "ijnby*tech",
    "rxapqdm;',",
    "f",
  ]);

  expect(gs.loadedLayouts[loadLayout(gs, "testLayout1")]).toMatchObject(
    testLayout1,
  );
});

test("swap! command saves all swaps and edits current saved layouts", () => {
  resetTestLayout2();
  edits[1].action(gs, ["test/testLayout2", "abc", "fr", ".g"]);
  gs.loadedLayouts.splice(loadLayout(gs, "test/testLayout2"), 1);
  const layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.rows).toEqual(["glswkzvuo.", "ijnby*tech", "rxapqdm;',", "f"]);
});

test("can add more magic rules", () => {
  resetTestLayout2();
  const layoutModified = edits[2].action(gs, ["test/testLayout2", "za", "ka"]);

  expect(layoutModified.magicRules).toEqual(["ab", "za", "ka"]);
  expect(gs.loadedLayouts[loadLayout(gs, "test/testLayout2")]).toMatchObject(
    testLayout2,
  );
});

test("invalid magic rules are not added", () => {
  resetTestLayout2();
  const layout = edits[2].action(gs, ["test/testLayout2", "dab", "fab", "zz"]);
  expect(layout.magicRules).toEqual(["ab", "zz"]);

  expect(gs.loadedLayouts[loadLayout(gs, "test/testLayout2")]).toMatchObject(
    testLayout2,
  );
});

test("magic rules can be saved to file", () => {
  resetTestLayout2();
  edits[3].action(gs, ["test/testLayout2", "op", "in"]);
  let layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual(["ab", "op", "in"]);

  gs.loadedLayouts.splice(loadLayout(gs, "test/testLayout2"), 1);
  layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual(["ab", "op", "in"]);
});

test("magic rules can be deleted", () => {
  resetTestLayout2();
  const layout = edits[4].action(gs, ["test/testLayout2", "ab"]);
  expect(layout.magicRules).toEqual([]);

  expect(gs.loadedLayouts[loadLayout(gs, "test/testLayout2")]).toMatchObject(
    testLayout2,
  );
});

test("deleted magic rules are saved to file", () => {
  resetTestLayout2();
  edits[5].action(gs, ["test/testLayout2", "ab"]);
  let layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual([]);

  gs.loadedLayouts.splice(loadLayout(gs, "test/testLayout2"), 1);
  layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual([]);
});

test("can change present magic rules", () => {
  resetTestLayout2();
  const layout = edits[6].action(gs, ["test/testLayout2", "ao"]);
  expect(layout.magicRules).toEqual(["ao"]);

  expect(gs.loadedLayouts[loadLayout(gs, "test/testLayout2")]).toMatchObject(
    testLayout2,
  );
});

test("changed magic rules are saved to file", () => {
  resetTestLayout2();
  edits[7].action(gs, ["test/testLayout2", "ao"]);
  let layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual(["ao"]);

  gs.loadedLayouts.splice(loadLayout(gs, "test/testLayout2"), 1);
  layout = gs.loadedLayouts[loadLayout(gs, "test/testLayout2")];
  expect(layout.magicRules).toEqual(["ao"]);
});
