import { Command, Layout, TokenFreq } from "../types";
import * as fs from "fs";

import parse from "../corpus/parseCorpus";
import viewLayout from "./viewLayout";
import tryoutLayout from "./tryout";
import setCorpusPositionByName from "../corpus/loadCorpus";
import { allRuleExamples } from "./ruleExamples";
import loadLayout from "./loadLayout";
import { noCorpusLoaded } from "./messages";
import {
  getBigrams,
  getMonograms,
  getSkip2grams,
  getTrigrams,
} from "../corpus/corpusUtil";
import { edits } from "./edit";
import getStats from "../analyse/getStats";
import readFileByStream from "../util/readFile";

const commands: Command[] = [
  {
    token: "parse",
    explain:
      "[filename] [corpus name]:\nTransforms a file with text into a file with information about the frequencies of bigrams/trigrams/fourgrams. Looks for files inside of the folder /corpus and writes the output to /parsed",
    minArgs: 2,
    maxArgs: 2,
    action: async (_, args) => {
      console.log(`Parsing corpus with filename of ${args[0]}`);
      await parse(args[0], args[1]);
    },
  },
  {
    token: "tryout",
    explain:
      "[file input] [layout from] [layout out]:\nYou can try out a layout by converting a corpus from one layout to another. Looks for a file inside of corpus/ and outputs to parsed/",
    minArgs: 3,
    maxArgs: 3,
    action: (gs, args) => {
      tryoutLayout(
        args[0],
        gs.loadedLayouts[loadLayout(gs, args[1])],
        gs.loadedLayouts[loadLayout(gs, args[2])],
      );
    },
  },
  {
    token: "layouts",
    explain: "Lists all json files inside of /layouts",
    maxArgs: 0,
    action: async () => {
      fs.readdirSync("layouts").forEach((file) => {
        if (file.includes(".json")) console.log(file.replace(/\.[^/.]+$/, ""));
      });
    },
  },
  {
    token: "view",
    explain: "[layout name]:\nViews a layout and all the stats associated.",
    minArgs: 1,
    maxArgs: 1,
    action: async (gs, args) => {
      viewLayout(gs, args[0]);
    },
  },
  {
    token: "corpora",
    explain: "Lists all json files inside of /parsed",
    maxArgs: 0,
    action: async () => {
      fs.readdirSync("parsed").forEach((file) => {
        if (file.includes(".json")) console.log(file.replace(/\.[^/.]+$/, ""));
      });
    },
  },
  {
    token: "corpus",
    explain:
      "[corpus name]:\nSwitches the current corpus to one of the ones that can be listed.",
    minArgs: 1,
    maxArgs: 1,
    action: async (gs, args) => {
      await setCorpusPositionByName(args[0], gs);
      if (gs.currentCorpora == -1)
        console.log(`Corpus ${args[0]} could not be loaded`);
    },
  },
  {
    token: "corpnow",
    explain:
      "Outputs the current corpus being used, as well as the corpus position.",
    maxArgs: 0,
    action: async (gs) => {
      console.log(
        `${gs.currentCorpora}: ${gs.currentCorpora == -1 ? "No corpus is currently loaded." : gs.loadedCorpora[gs.currentCorpora].name}`,
      );
    },
  },
  {
    token: "examples",
    explain:
      "[corpus file in `corpus/`] [regex] [optional amount of examples to show]\n finds all the examples in a corpus and shows the top 20.",
    minArgs: 2,
    maxArgs: 3,
    action: async (_, args) => {
      const examplesAndFrequency: Record<string, number> = {};
      let totalWords = 0;
      let totalWordsMatch = 0;

      await readFileByStream(`corpus/${args[0]}`, (line) => {
        const words = line.split(" ");
        totalWords += words.length;

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (new RegExp(args[1]).test(word)) {
            totalWordsMatch += 1;

            if (examplesAndFrequency[word] == undefined)
              examplesAndFrequency[word] = 1;
            else examplesAndFrequency[word]++;
          }
        }
      });

      const sorted = Object.fromEntries(
        Object.entries(examplesAndFrequency).sort(([, a], [, b]) => b - a),
      );

      const topSorted: TokenFreq = {};
      let loopCount = 0;
      for (const word in sorted) {
        topSorted[word] = sorted[word];

        loopCount++;
        if (loopCount >= (args[2] == undefined ? 20 : parseInt(args[2]))) break;
      }

      const r = (n: number): number => Math.round(n * 10 ** 5) / 10 ** 3;

      console.log(
        `${totalWordsMatch.toLocaleString()} / ${totalWords.toLocaleString()} words (${r(totalWordsMatch / totalWords)}%)`,
      );

      let i = 1;
      for (const word in topSorted) {
        console.log(`${i}: ${word}\t\t\t(${topSorted[word]})`);
        i++;
      }
    },
  },
  {
    token: "freq",
    explain:
      "[layout] [ngrams]\nFind the frequency for any monogram, bigram, trigram, skipgram, or skip2gram. For a skipgram do `a_b` and for a skip2gram do 'a__b'",
    minArgs: 2,
    action: async (gs, args) => {
      if (gs.currentCorpora == -1) {
        console.log("A corpus must be loaded.");
        return;
      }

      if (loadLayout(gs, args[0]) == -1) {
        console.log(`Layout ${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[loadLayout(gs, args[0])];

      args.splice(0, 1);

      const foundNgrams: Record<string, number>[] = [{}, {}, {}, {}, {}];
      // mono, bi, tri, skip, skip2

      const getFreqs = (
        ngramDatasetIndex: number,
        requestedNgram: string,
        ngramsFromCorpus: TokenFreq,
      ) => {
        foundNgrams[ngramDatasetIndex][requestedNgram] =
          ngramsFromCorpus[requestedNgram] == undefined
            ? 0
            : ngramsFromCorpus[requestedNgram] /
              Object.values(ngramsFromCorpus).reduce(
                (acc, val) => acc + val,
                0,
              );
      };

      args.forEach((ngram) => {
        switch (ngram.length) {
          case 1:
            getFreqs(
              0,
              ngram,
              getMonograms(gs.loadedCorpora[gs.currentCorpora], layout),
            );

            break;
          case 2:
            getFreqs(
              1,
              ngram,
              getBigrams(gs.loadedCorpora[gs.currentCorpora], layout),
            );

            break;
          case 3:
            const numberOfUnderScores = ngram.split("_").length - 1;
            if (numberOfUnderScores == 0) {
              getFreqs(
                2,
                ngram,
                getTrigrams(gs.loadedCorpora[gs.currentCorpora], layout),
              );
            } else if (numberOfUnderScores == 1) {
              const skipgrams: Record<string, number> = {};
              const trigrams = getTrigrams(
                gs.loadedCorpora[gs.currentCorpora],
                layout,
              );

              Object.keys(trigrams).forEach((ngram) => {
                const newKey = ngram[0] + "_" + ngram[2];
                if (skipgrams[newKey] == undefined)
                  skipgrams[newKey] = trigrams[ngram];
                else skipgrams[newKey] += trigrams[ngram];
              });

              getFreqs(3, ngram, skipgrams);
            } else {
              console.log(
                "In a trigram you can only have 0 or 1 `_` as this symbolises skipgrams.",
              );
            }
            break;
          case 4:
            getFreqs(
              4,
              ngram[0] + ngram[3],
              getSkip2grams(gs.loadedCorpora[gs.currentCorpora], layout),
            );

            break;
          default:
            console.log(
              `The length was not correct for argument '${ngram}'. Must be a monogram, bigram, trigram, skipgram, or skip2gram.`,
            );
        }
      });

      const r = (n: number): number => Math.round(n * 10 ** 5) / 10 ** 3;

      const ngramFoundAtThisIndex: any[] = [];

      foundNgrams.forEach((ngrams, index) => {
        ngramFoundAtThisIndex[index] = Object.keys(ngrams).length > 0;
      });

      if (ngramFoundAtThisIndex.reduce((a, c) => a + c, 0) == 0) return;

      const printNgrams = (
        message: string,
        freqRecord: Record<string, number>,
      ) => {
        console.log(
          `${message} frequencies in ${gs.loadedCorpora[gs.currentCorpora].name}:`,
        );
        let total = 0;

        Object.keys(freqRecord).forEach((ngram) => {
          console.log(`  ${ngram}: ${r(freqRecord[ngram])}%`);
          total += freqRecord[ngram];
        });

        console.log(`Total: ${r(total)}%`);
      };

      const ngramNames = [
        "Monograms",
        "Bigrams",
        "Trigrams",
        "Skipgrams",
        "Skip2grams",
      ];

      ngramFoundAtThisIndex.forEach((ngramFound, i) => {
        if (ngramFound) printNgrams(ngramNames[i], foundNgrams[i]);
      });
    },
  },
  {
    token: "clear",
    explain: "Clears the terminal.",
    maxArgs: 0,
    action: () => {
      console.clear();
    },
  },
  {
    token: "end",
    explain: "Ends the program.",
    maxArgs: 0,
    action: () => {
      process.exit();
    },
  },
  {
    token: "help",
    explain: "[optional command]\nLists all the commands available.",
    maxArgs: 1,
    action: (_, args) => {
      if (args.length == 1) {
        for (let i = 0; i < commands.length; i++) {
          if (args[0] == commands[i].token) {
            console.log(commands[i].explain);
            return;
          }
        }

        console.log(`Command ${args[0]} not found.`);
        return;
      }

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        const minArgsCount =
          commands[i].minArgs == undefined ? 0 : commands[i].minArgs;
        const hasMaxArgs = commands[i].maxArgs != undefined;

        console.log(
          `${command.token}: requires ${minArgsCount}-${hasMaxArgs ? commands[i].maxArgs! : "∞"} args`,
        );
      }
    },
  },
  {
    token: "bigrams",
    explain: "[layoutname]\nShows bigrams",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      console.log(getBigrams(gs.loadedCorpora[gs.currentCorpora], layout));
    },
  },
  {
    token: "trigrams",
    explain: "[layoutname]\nShows trigrams",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      console.log(getTrigrams(gs.loadedCorpora[gs.currentCorpora], layout));
    },
  },
  {
    token: "time",
    explain: "[command]\n Times a command",
    minArgs: 1,
    action: (gs, args) => {
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].token == args[0]) {
          const time = new Date().getTime();

          commands[i].action(gs, [...args].slice(1));

          console.log(
            `Took ${(new Date().getTime() - time) / 1000}s to complete.`,
          );

          break;
        }
      }
    },
  },
  {
    token: "timen",
    explain: "[amount of times to run] [command]\n Times a command",
    minArgs: 2,
    action: (gs, args) => {
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].token == args[1]) {
          const time = new Date().getTime();

          for (let j = 0; j < parseInt(args[0]); j++)
            commands[i].action(gs, [...args].slice(2));

          console.log(
            `Took ${(new Date().getTime() - time) / 1000}s to complete.`,
          );

          break;
        }
      }
    },
  },
  {
    token: "rules",
    explain: "[layoutname]:\n lists the magic rules for a layout",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      if (!layout.hasMagic) {
        console.log("This is not a magic layout.");
        return;
      }

      console.log(layout.magicRules.join(" "));
    },
  },
  {
    token: "fingers",
    explain: "[layoutname]\nShows finger usage for a layout.",
    minArgs: 1,
    maxArgs: 1,
    action: (gs, args) => {
      const layoutPos = loadLayout(gs, args[0]);
      if (layoutPos == -1) {
        console.log(`${args[0]} was not found.`);
        return;
      }

      const layout = gs.loadedLayouts[layoutPos];

      if (gs.currentCorpora == -1) {
        noCorpusLoaded();
        return;
      }

      const fingers = getStats(layout, gs.loadedCorpora[gs.currentCorpora], {
        fingerFreq: true,
      }).fingerFreq;

      fingers?.forEach((amount, finger) => {
        let x = Math.round(amount * 10 ** 5) / 10 ** 3;

        console.log(`${finger}: ${x}%`);
      });
    },
  },
  ...edits,
  ...allRuleExamples,
];

export default commands;
