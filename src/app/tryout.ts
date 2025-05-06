import fs from "node:fs";
import { Layout } from "../types";

const getX = (layout: Layout, key: string) => {
  for (let i = 0; i < layout.rows.length; i++) {
    if (layout.rows[i].includes(key)) return layout.rows[i].indexOf(key);
  }

  return -1;
};

const getY = (layout: Layout, key: string) => {
  for (let i = 0; i < layout.rows.length; i++) {
    if (layout.rows[i].includes(key)) return i;
  }

  return -1;
};

const tryoutLayout = (
  fileInputPath: string,
  layoutFrom: Layout,
  layoutTo: Layout,
) => {
  let source = fs
    .readFileSync(`corpus/${fileInputPath}`, "utf-8")
    .toLowerCase();

  if (layoutTo.hasMagic)
    layoutTo.magicRules.forEach((rule) => {
      try {
        source = source.replaceAll(
          rule,
          rule[0] +
            layoutFrom.rows[getY(layoutTo, layoutTo.magicIdentifier)][
              getX(layoutTo, layoutTo.magicIdentifier)
            ],
        );
      } catch {
        source = source.replaceAll(rule, rule[0] + "*");
      }
    });

  const letterTransformations: Record<string, string> = {};

  layoutFrom.rows
    .join("")
    .split("")
    .forEach((letter) => {
      try {
        letterTransformations[letter] =
          layoutFrom.rows[getY(layoutTo, letter)][getX(layoutTo, letter)];
      } catch {
        letterTransformations[letter] = "~";
      }
    });

  const newStringArray = [];

  for (let i = 0; i < source.length; i++) {
    // a bit ugly but oh well
    newStringArray.push(
      letterTransformations[source[i]] == undefined
        ? source[i]
        : letterTransformations[source[i]],
    );
  }

  try {
    fs.writeFileSync(`parsed/${fileInputPath}`, newStringArray.join(""), {
      flag: "w",
    });

    console.log("Corpus tryout file written!");
  } catch (err) {
    console.log("There was an error writing the corpus file.");

    console.error(err);
  }
};

export default tryoutLayout;
