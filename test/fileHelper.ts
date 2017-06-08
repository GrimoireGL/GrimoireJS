const fs = require("fs");
const pathaa = require("path");

export default class FileHelper {
  public static readFile(path: string): string {
    return fs.readFileSync(pathaa.join(__dirname, path), "utf8");
  }
}
