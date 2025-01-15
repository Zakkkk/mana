import * as fs from "fs";
import * as readline from "readline";

async function readFileByStream(
  filePath: string,
  onLine: (line: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (err) => {
      console.error("Error with file stream:", err);
      reject(err);
    });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Handles CRLF and LF endings
    });

    rl.on("line", (line) => {
      try {
        onLine(line); // Invoke the callback for each line
      } catch (err) {
        console.error("Error in line callback:", err);
        rl.close(); // Close the readline interface on error
        reject(err);
      }
    });

    rl.on("close", () => {
      resolve(); // Resolve the promise when done
    });

    rl.on("error", (err) => {
      reject(err);
    });
  });
}

export default readFileByStream;
