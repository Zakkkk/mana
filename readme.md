# Mana: A Magic Keyboard Analyser
The first analyser for keyboard layouts that contain magic keys!

The magic rules that work are ones where the magic key maps to one singular letter, and keeps the initial letter the same. This analyser does not consider spacegrams.

For example `d*->do` is acceptable but `d*->dof` or `d*->ao` is not.

Coming soon: magic combos suggestion, layout generation, mutiple magic keys

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

## Corpora
To see all available corpora run the command `corpora`.

You can select a corpus with the command `corpus [corpusname]`.

If you want to use your own corpus, upload a file into `/corpus` and then run the command `parse filename.txt corpusname`, you can then load that corpus with the command as mentioned before.

## How is the magic calculated?
For any (n)-gram, (n)-grams which are found at the start of a word are saved, as well as (n+1)-grams in every string. The (n+1) is required to see back into the future to find out if the next key will be a magic key. The first letter in the (n+1)-gram will not be counted in any calculation.

## Thanks
Special thanks to [pine](https://github.com/ClemenPine/) for helping out throughout the process, as well as other [AKL discord](https://discord.com/invite/sxTV2G5Acg) members.

Please message me on discord (name: zak.7) for any reason!
