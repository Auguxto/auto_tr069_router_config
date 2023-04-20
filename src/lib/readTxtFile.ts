import fs from "node:fs";

export default function readTxtFile(path: string): string[] {
  const data = fs.readFileSync(path, "utf8");
  return data.replaceAll("\r", "").split("\n");
}
