import * as readline from "readline";

export function setupKeypressHandling(
  processInput: (input: string) => Promise<void>,
) {
  const history: string[] = [];
  let historyIndex = -1;
  let currentInput = "";
  let cursorPos = 0;

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", async (str, key) => {
    const isMac = process.platform === "darwin";

    if (key.ctrl && key.name === "c") {
      process.stdout.write("\nExiting...\n");
      process.exit();
    }

    if (key.name === "return") {
      if (currentInput.trim()) {
        history.push(currentInput);
        historyIndex = history.length;
      }
      const input = currentInput;
      currentInput = "";
      cursorPos = 0;
      process.stdout.write("\n");
      await processInput(input);
      process.stdout.write("> ");
      return;
    }

    // Key handling
    switch (key.sequence) {
      case "\x7f": // Backspace
        if (cursorPos > 0) {
          currentInput =
            currentInput.slice(0, cursorPos - 1) +
            currentInput.slice(cursorPos);
          cursorPos -= 1;
        }
        break;

      case "\x1b[3~": // Delete key
        if (cursorPos < currentInput.length) {
          currentInput =
            currentInput.slice(0, cursorPos) +
            currentInput.slice(cursorPos + 1);
        }
        break;

      case "\x1b[D": // Left Arrow
        if (cursorPos > 0) cursorPos -= 1;
        break;

      case "\x1b[C": // Right Arrow
        if (cursorPos < currentInput.length) cursorPos += 1;
        break;

      case "\x1b[H": // Home (Command+Left on macOS)
      case "\x1b[1~": // Home (Linux/Windows)
        cursorPos = 0;
        break;

      case "\x1b[F": // End (Command+Right on macOS)
      case "\x1b[4~": // End (Linux/Windows)
        cursorPos = currentInput.length;
        break;

      case "\x1b\x7f": // Option+Backspace
        const leftOfCursor = currentInput.slice(0, cursorPos);
        const rightOfCursor = currentInput.slice(cursorPos);
        const newLeft = leftOfCursor.replace(/\S+\s*$/, ""); // Remove last word
        cursorPos = newLeft.length;
        currentInput = newLeft + rightOfCursor;
        break;

      case "\x1bb": // Option+Left
        if (isMac) {
          const left = currentInput.slice(0, cursorPos);
          const match = left.match(/(\S+\s*)$/);
          cursorPos -= match ? match[0].length : 0;
          if (cursorPos < 0) cursorPos = 0;
        }
        break;

      case "\x1bf": // Option+Right
        if (isMac) {
          const right = currentInput.slice(cursorPos);
          const match = right.match(/^(\S+\s*)/);
          cursorPos += match ? match[0].length : 0;
          if (cursorPos > currentInput.length) cursorPos = currentInput.length;
        }
        break;

      case "\x1b[A": // Up Arrow
        if (historyIndex > 0) {
          historyIndex -= 1;
          currentInput = history[historyIndex];
          cursorPos = currentInput.length;
        }
        break;

      case "\x1b[B": // Down Arrow
        if (historyIndex < history.length - 1) {
          historyIndex += 1;
          currentInput = history[historyIndex];
          cursorPos = currentInput.length;
        } else {
          historyIndex = history.length;
          currentInput = "";
          cursorPos = 0;
        }
        break;

      default:
        if (!key.ctrl && !key.meta && !key.name.startsWith("escape")) {
          // Add printable characters
          currentInput =
            currentInput.slice(0, cursorPos) +
            str +
            currentInput.slice(cursorPos);
          cursorPos += 1;
        }
        break;
    }

    // Rewrite line
    rewriteLine(currentInput, cursorPos);
  });

  process.stdout.write("> ");

  function rewriteLine(input: string, cursorPos: number) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write("> " + input);
    readline.cursorTo(process.stdout, cursorPos + 2); // Account for prompt "> "
  }
}
