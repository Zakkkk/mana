# Mana: A Magic Keyboard Analyser 🔮
The first analyser for keyboard layouts that contain magic keys!

The magic rules that work are ones where the magic key maps to one singular letter, and keeps the initial letter the same. This analyser does not consider spacegrams.

For example `d*->do` is acceptable but `d*->dof` or `d*->ao` is not.

Coming soon: magic combos suggestion, layout generation, mutiple magic keys, ability to test out a layout with a corpus transform.

## Installing
To run this program, [node](https://nodejs.org/en/download) is required. Make sure it is installed to path. Run `npm install` in the directory to install required packages.

## Running
Use `node bin/main.js` to begin running the program. After first running the program you need to set a corpus for most stats to be useful. See the section on [Corpora](#Corpora) for more information.

Command `help` lists all commands.
Command `explain [command]` will give a brief explanation for any command.

## Adding Your Own Layouts
Navigate to `/layouts` and create a `layoutname.json` file. Make sure the file name does not have any spaces.

The fingermap numbers range from 0 (left pinky) to 4 and 5 (left and right thumb) and then up to 9.

Layouts may only have one magic key in them (for now), and the magic identifier must be listed. At the moment layouts with magic are not supported, so just keep `hasMagic` to true, and don't list any magic rules.

Example:

```json
{
    "name": "Layout Name",
    "rows": ["abcdmfghij", "kl*nopqrst", "uvwxyz,.'", "e"],
    "fingermap": ["0123366789", "0123366789", "0123366789", "5"],
    "hasMagic": true,
    "magicIdentifier": "*",
    "magicRules": [
        "do",
        "ab"
    ]
}
```

To test this new layout out, load up a corpus and then run `view [layoutname]`

## Modifying the layout through commands
To adjust the layout through the cli program, instead of opening an editor, you can use the following commands.
 - `swap layoutname ab`
 - `swap layoutname ab bc cd`
 - `swap layoutname abcd`
    - this command will have the same effect as example 2
 - `swap! layoutname ab`
    - using the ! after any layout change command will write the changes to the file.
- `rulesadd layoutname do ab`
    - adds the magic rule `d*->do` and `a*->ab`
- `rulesrm layoutname do`
    - removes the rule `d*->do`
-  `ruleschange layoutname da`
    - changes the rule `d*` to output `da`

## Corpora
To see all available corpora run the command `corpora`.

You can select a corpus with the command `corpus [corpusname]`.

If you want to use your own corpus, upload a file into `/corpus` and then run the command `parse filename.txt corpusname`, you can then load that corpus with the command as mentioned before.

## How is the magic calculated?
For any (n)-gram, (n)-grams which are found at the start of a word are saved, as well as (n+1)-grams in every string. The (n+1) is required to see back into the future to find out if the next key will be a magic key. The first letter in the (n+1)-gram will not be counted in any calculation.

## Stats available
```
Vylet | monkeyracer
  w c m p b x l o u j -
  r s t h f y n a e i ,
  q v g d k z * ' ; .

Magic rules: ck ,l gh pt rk sc wr ft mb bt ax ex ix

Heatmap score: 74.502%
Handbalance: 44.475% / 55.525%

Alt: 35.47%
Rolls (Total): 49.81%
  Inroll: 31.924%
  Outroll: 14.886%
  In3roll: 1.176%
  Out3roll: 1.824%
Redirect (+sfs): 6.215%
  Redirect (Weak) (+sfs): 0.561%

┌────────────────┬──────────┬────────────┬─────────────┐
│                │  bigram  │  skipgram  │  skipgram2  │
├────────────────┼──────────┼────────────┼─────────────┤
│  same finger   │  1.011%  │  6.437%    │  8.743%     │
│  repeat        │  2.822%  │  3.122%    │  --         │
│  stretch       │  1.953%  │  1.98%     │  3.084%     │
│  half scissor  │  4.671%  │  5.476%    │  9.898%     │
│  full scissor  │  0.324%  │  0.873%    │  1.284%     │
└────────────────┴──────────┴────────────┴─────────────┘
```

You can see examples of any of these stats with commands like `sfb vylet` or `sfs vylet 30` to see the top 30. Command `help` to see the rest of the commands for examples.

## Thanks
Special thanks to [pine](https://github.com/ClemenPine/) for helping out throughout the process, as well as other [AKL discord](https://discord.com/invite/sxTV2G5Acg) members.

Please message me on discord (name: zak.7) for any reason!
