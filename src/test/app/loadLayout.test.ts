// also test the search of cached layouts
import { expect, test } from "vitest";
import fs from "fs";
import loadLayout from "../../app/loadLayout";
import { GlobalSettings, Layout } from "../../types";

const testLayout: Layout = {
  name: "test/LoadLayout1",
  rows: ["vmlcpxfouj", "strdy.naei*", "kqgwzbh';,"],
  fingermap: ["0123366789", "01233667899", "0123366789"],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: ["ab", "bc", "dc"],
};

const testLayout2: Layout = {
  name: "LoadLayout2",
  rows: ["mvlcpxfouj", "strdy.naei*", "kqgwzbh';,"],
  fingermap: ["0123366789", "01233667899", "0123366789"],
  hasMagic: true,
  magicIdentifier: "*",
  magicRules: ["zn", "bc", "dc"],
};

const gs: GlobalSettings = {
  loadedLayouts: [testLayout2],
  loadedCorpora: [],
  currentCorpora: -1,
};

fs.writeFileSync("layouts/test/loadLayout1.json", JSON.stringify(testLayout), {
  flag: "w",
});

test("LoadLayouts loads a new file", () => {
  const layoutIndex = loadLayout(gs, "test/loadLayout1");
  expect(gs.loadedLayouts[layoutIndex]).toMatchObject(testLayout);
});

test("LoadLayouts loads a file already stored", () => {
  expect(loadLayout(gs, "loadLayout2")).toBe(0);
});
