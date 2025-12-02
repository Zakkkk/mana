import loadLayout from "./loadLayout";
import { GlobalSettings, Layout, LayoutStats } from "../types";
import getStats from "../analyse/getStats";
import { noCorpusLoaded } from "./messages";

const printGrid = (rows: string[][]): void => {
  let longestWidths: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      rows[i][j] = `${rows[i][j]}`;

      const width = rows[i][j].length;
      if (longestWidths[j] == undefined) {
        longestWidths[j] = width;
        continue;
      } else if (width >= longestWidths[j]) longestWidths[j] = width;
    }
  }

  let printingRows: string[] = [];

  const s = (amount: number): string => (amount < 0 ? "" : " ".repeat(amount));

  for (let i = 0; i < rows.length; i++) printingRows.push("│");
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++)
      printingRows[i] +=
        `  ${rows[i][j]}${s(longestWidths[j] - rows[i][j].length)}  │`;
  }

  let sepString = `├`;
  for (let j = 0; j < rows[0].length; j++)
    sepString += `${"─".repeat(4 + longestWidths[j])}${j == rows[0].length - 1 ? `┤` : `┼`}`;

  let start = "┌";
  for (let j = 0; j < rows[0].length; j++)
    start += `${"─".repeat(4 + longestWidths[j])}${j == rows[0].length - 1 ? `┐` : `┬`}`;

  let end = "└";
  for (let j = 0; j < rows[0].length; j++)
    end += `${"─".repeat(4 + longestWidths[j])}${j == rows[0].length - 1 ? `┘` : `┴`}`;

  const startRow = printingRows[0];
  printingRows.shift();

  printingRows = [start, startRow, sepString, ...printingRows, end];

  for (const line of printingRows) console.log(line);
};

const r = (n: number): number => Math.round(n * 10 ** 5) / 10 ** 3;

const viewLayout = (
  gs: GlobalSettings,
  layoutName: string,
  layout?: Layout,
) => {
  if (layout == undefined) {
    const layoutPosition = loadLayout(gs, layoutName);

    if (layoutPosition == -1) {
      console.log(`Layout ${layoutName} was not found.`);
      return;
    }

    layout = gs.loadedLayouts[layoutPosition];
  }

  console.log(
    layout.name +
      (gs.currentCorpora != -1
        ? ` | ${gs.loadedCorpora[gs.currentCorpora].name}`
        : ""),
  );

  layout.rows.forEach((row) => {
    console.log(`  ${row.split(" ").join("~").split("").join(" ")}`);
  });

  if (layout.hasMagic) {
    let magicRules = "";

    layout.magicRules.forEach((magicRule) => {
      magicRules += magicRule + " ";
    });

    if (layout.willRepeatUnlessOverridden) magicRules += "else repeat";

    console.log("\nMagic rules: " + magicRules);
  }

  console.log("");

  if (gs.currentCorpora != -1) {
    const stats: LayoutStats = getStats(
      layout,
      gs.loadedCorpora[gs.currentCorpora],
      {
        heatmapScore: true,
        handbalanceScore: true,
        sfb: true,
        lsb: true,
        lss: true,
        lss2: true,
        halfScissors: true,
        fullScissors: true,
        skipHalfScissors: true,
        skipFullScissors: true,
        skip2HalfScissors: true,
        skip2FullScissors: true,
        sfr: true,
        sfs: true,
        sfs2: true,
        sfsr: true,
        alternate: true,
        redirect: true,
        redirectWeak: true,
        inroll: true,
        outroll: true,
        in3roll: true,
        out3roll: true,
      },
    );

    console.log(`Heatmap score: ${r(stats.heatmapScore!)}%`);
    console.log(
      `Handbalance: ${r(stats.handbalanceScore!)}% / ${100 - r(stats.handbalanceScore!)}%\n`,
    );

    console.log(`Alt: ${r(stats.alternate!)}%`);
    console.log(
      `Rolls (Total): ${r(stats.out3roll! + stats.in3roll! + stats.inroll! + stats.outroll!)}%\n`,
      ` Inroll: ${r(stats.inroll!)}%\n`,
      ` Outroll: ${r(stats.outroll!)}%\n`,
      ` In3roll: ${r(stats.in3roll!)}%\n`,
      ` Out3roll: ${r(stats.out3roll!)}%`,
    );

    console.log(
      `Redirect (+sfs): ${r(stats.redirect!)}%\n`,
      ` Redirect (Weak) (+sfs): ${r(stats.redirectWeak!)}%\n`,
    );

    const t = (n: number | undefined): string =>
      `${Math.round(n! * 10 ** 5) / 10 ** 3}%`;

    const grid: string[][] = [
      ["", "bigram", "skipgram", "skipgram2"],
      ["same finger", t(stats.sfb), t(stats.sfs), t(stats.sfs2)],
      ["repeat", t(stats.sfr), t(stats.sfsr), "--"],
      ["stretch", t(stats.lsb), t(stats.lss), t(stats.lss2)],
      [
        "half scissor",
        t(stats.halfScissors),
        t(stats.skipHalfScissors),
        t(stats.skip2HalfScissors),
      ],
      [
        "full scissor",
        t(stats.fullScissors),
        t(stats.skipFullScissors),
        t(stats.skip2FullScissors),
      ],
    ];

    printGrid(grid);
  } else {
    noCorpusLoaded();
  }
};

function diffLayouts(layout1: Layout, layout2: Layout): string[] {
  const result: string[] = [];
  const rowCount = Math.max(layout1.rows.length, layout2.rows.length);

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const r1 = layout1.rows[rowIndex] ?? "";
    const r2 = layout2.rows[rowIndex] ?? "";
    const maxLen = Math.max(r1.length, r2.length);

    let row = "";
    for (let i = 0; i < maxLen; i++) {
      const c1 = r1[i];
      const c2 = r2[i];

      row += c1 !== undefined && c1 === c2 ? c1 : "~";
      row += " "; // space between each printed item
    }

    result.push(row.trimEnd()); // remove trailing space if you prefer
  }

  return result;
}

const compareLayout = (gs: GlobalSettings, layouts: string[]) => {
  if (layouts.length != 2) {
    console.log("Compare layouts should only take 2 layouts.");
    return;
  }

  const layout1Position = loadLayout(gs, layouts[0]);
  const layout2Position = loadLayout(gs, layouts[1]);

  if (layout1Position == -1) {
    console.log(`Layout ${layouts[0]} was not found.`);
    return;
  }
  if (layout2Position == -1) {
    console.log(`Layout ${layouts[1]} was not found.`);
    return;
  }

  const layout1 = gs.loadedLayouts[layout1Position];
  const layout2 = gs.loadedLayouts[layout2Position];

  console.log(
    layout1.name +
      " vs " +
      layout2.name +
      (gs.currentCorpora != -1
        ? ` | ${gs.loadedCorpora[gs.currentCorpora].name}`
        : ""),
  );

  console.log(diffLayouts(layout1, layout2).join("\n"));
  console.log("");

  if (gs.currentCorpora != -1) {
    // yes okay i know this code is bad but its a quick fix
    const stats1: LayoutStats = getStats(
      layout1,
      gs.loadedCorpora[gs.currentCorpora],
      {
        heatmapScore: true,
        handbalanceScore: true,
        sfb: true,
        lsb: true,
        lss: true,
        lss2: true,
        halfScissors: true,
        fullScissors: true,
        skipHalfScissors: true,
        skipFullScissors: true,
        skip2HalfScissors: true,
        skip2FullScissors: true,
        sfr: true,
        sfs: true,
        sfs2: true,
        sfsr: true,
        alternate: true,
        redirect: true,
        redirectWeak: true,
        inroll: true,
        outroll: true,
        in3roll: true,
        out3roll: true,
      },
    );

    const stats2: LayoutStats = getStats(
      layout2,
      gs.loadedCorpora[gs.currentCorpora],
      {
        heatmapScore: true,
        handbalanceScore: true,
        sfb: true,
        lsb: true,
        lss: true,
        lss2: true,
        halfScissors: true,
        fullScissors: true,
        skipHalfScissors: true,
        skipFullScissors: true,
        skip2HalfScissors: true,
        skip2FullScissors: true,
        sfr: true,
        sfs: true,
        sfs2: true,
        sfsr: true,
        alternate: true,
        redirect: true,
        redirectWeak: true,
        inroll: true,
        outroll: true,
        in3roll: true,
        out3roll: true,
      },
    );

    console.log(
      `Heatmap score: ${r(stats1.heatmapScore! - stats2.heatmapScore!)}%`,
    );
    console.log(
      `Handbalance: ${r(stats1.handbalanceScore! - stats2.handbalanceScore!)}% / ${r(-stats1.handbalanceScore! + stats2.handbalanceScore!)}%\n`,
    );

    console.log(`Alt: ${r(stats1.alternate! - stats2.alternate!)}%`);
    console.log(
      `Rolls (Total): ${r(stats1.out3roll! + stats1.in3roll! + stats1.inroll! + stats1.outroll! - (stats2.out3roll! + stats2.in3roll! + stats2.inroll! + stats2.outroll!))}%\n`,
      ` Inroll: ${r(stats1.inroll! - stats2.inroll!)}%\n`,
      ` Outroll: ${r(stats1.outroll! - stats2.outroll!)}%\n`,
      ` In3roll: ${r(stats1.in3roll! - stats2.in3roll!)}%\n`,
      ` Out3roll: ${r(stats1.out3roll! - stats2.out3roll!)}%`,
    );

    console.log(
      `Redirect (+sfs): ${r(stats1.redirect! - stats2.redirect!)}%\n`,
      ` Redirect (Weak) (+sfs): ${r(stats1.redirectWeak! - stats2.redirectWeak!)}%\n`,
    );

    const t = (n: number | undefined): string =>
      `${Math.round(n! * 10 ** 5) / 10 ** 3}%`;

    const grid: string[][] = [
      ["", "bigram", "skipgram", "skipgram2"],
      [
        "same finger",
        t(stats1.sfb! - stats2.sfb!),
        t(stats1.sfs! - stats2.sfs!),
        t(stats1.sfs2! - stats2.sfs2!),
      ],
      [
        "repeat",
        t(stats1.sfr - stats2.sfr),
        t(stats1.sfsr - stats2.sfsr),
        "--",
      ],
      [
        "stretch",
        t(stats1.lsb - stats2.lsb),
        t(stats1.lss - stats2.lss),
        t(stats1.lss2 - stats2.lss2),
      ],
      [
        "half scissor",
        t(stats1.halfScissors - stats2.halfScissors),
        t(stats1.skipHalfScissors - stats2.skipHalfScissors),
        t(stats1.skip2HalfScissors - stats2.skip2HalfScissors),
      ],
      [
        "full scissor",
        t(stats1.fullScissors - stats2.fullScissors),
        t(stats1.skipFullScissors - stats2.skipFullScissors),
        t(stats1.skip2FullScissors - stats2.skip2FullScissors),
      ],
    ];

    printGrid(grid);
  } else {
    noCorpusLoaded();
  }
};

export { viewLayout, compareLayout };
