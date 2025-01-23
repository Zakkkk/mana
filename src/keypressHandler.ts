import * as readline from "readline";

export function setupKeypressHandling(
  processInput: (input: string) => Promise<void>,
) {
  const history: string[] = [];
  let historyIndex = -1;
  let currentInput = "";

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", async (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.stdout.write("\nExiting...\n");
      process.exit();
    }

    const isMac = process.platform === "darwin";

    switch (key.name) {
      case "return":
        if (currentInput.trim()) {
          history.push(currentInput);
          historyIndex = history.length;
        }

        const input = currentInput;
        currentInput = "";
        process.stdout.write("\n");
        await processInput(input);
        process.stdout.write("> ");
        break;

      case "up":
        if (historyIndex > 0) {
          historyIndex--;
          currentInput = history[historyIndex];
        }
        rewriteLine(currentInput);
        break;

      case "down":
        if (historyIndex < history.length - 1) {
          historyIndex++;
          currentInput = history[historyIndex];
        } else {
          historyIndex = history.length;
          currentInput = "";
        }
        rewriteLine(currentInput);
        break;

      case "backspace":
        if (isMac && key.meta) {
          // Command+Backspace: Delete entire line
          currentInput = "";
        } else if (isMac && key.alt) {
          // Option+Backspace: Delete last word
          currentInput = currentInput.replace(/\s*\S*$/, ""); // Remove the last word
        } else {
          // Regular Backspace: Delete the last character
          currentInput = currentInput.slice(0, -1);
        }
        rewriteLine(currentInput);
        break;

      default:
        if (!key.ctrl && !key.meta) {
          currentInput += str;
          rewriteLine(currentInput);
        }
    }
  });
}

function rewriteLine(input: string) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write("> " + input);
}
