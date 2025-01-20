# What is Typingscript?
This is a keyboard layout analyser that collects stats on any layout. This analyser also works with magic. The magic rules that work are ones where the magic key maps to one singular letter, and keeps the letter right before the same. This analyser does not consider spacegrams.

For example `d*->do` is acceptable but `d*->dof` or `d*->ao` is not.

## Installing
To run this program, [node](https://nodejs.org/en/download) is required. Run `npm install` to install required packages.

## Running
Use `node bin/main.js` to begin running the program. Command `help` lists all commands.

## Adding Your Own Layouts
Navigate to `/layouts` and create a `layoutname.json` file. Make sure the file name does not have any spaces.

The fingermap numbers range from 0 (left pinky) to 4 and 5 (left and right thumb) and then up to 9.

Layouts may only have one magic key in them, and the magic identifier must be listed.

Example:

```json
{
    "name": "Layout Name",
    "rows": ["abcdmfghij", "kl*nopqrst", "uvwxyz,.'", "e"],
    "fingermap": ["0123366789", "0123366789", "0123366789", "5"],
    "hasMagic": true,
    "magicIdentifier": "*",
    "magicRules": [
        {
            "activator": "n",
            "transformTo": "o"
        },
        {
            "activator": "c",
            "transformTo": "s"
        }
    ]
}
```

To test this new layout out, load up a corpus and then run `view [layoutname]`

## Corpora
To see all available corpora run the command `corpora`. You can select a corpus with the command `corpus [corpusname]`. If you want to use your own corpus, upload a file into `/corpus` and then run the command `parse filename.txt corpusname`, you can then load that corpus with the command `corpus [mycorpusname]`.
