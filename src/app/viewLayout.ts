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

    const r = (n: number): number => Math.round(n * 10 ** 5) / 10 ** 3;

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

export default viewLayout;
