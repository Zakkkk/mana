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
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      try {
        onLine(line);
      } catch (err) {
        console.error("Error in line callback:", err);
        rl.close();
        reject(err);
      }
    });

    rl.on("close", () => {
      resolve();
    });

    rl.on("error", (err) => {
      reject(err);
    });
  });
}

export default readFileByStream;
