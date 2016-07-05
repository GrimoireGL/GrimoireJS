import SourceTransformer from "./Base/SourceTransformer";
class RemoveCommentTransformer extends SourceTransformer {

  constructor() {
    super((source) => {
      source = RemoveCommentTransformer._removeMultiLineComment(source);
      return RemoveCommentTransformer._removeLineComment(source);
    });
  }

  private static _removeLineComment(source: string): string {
    let text: string = source;
    const regex = /(\/\/.*)/g;
    while (true) {
      const found = regex.exec(text);
      if (!found) {
        break;
      }
      let beginPoint = found.index;
      text = text.substr(0, beginPoint) + text.substring(beginPoint + found[0].length, text.length);
    }
    return text;
  }
  private static _removeMultiLineComment(source: string): string {
    while (true) {
      const found = source.indexOf("/*", 0);
      if (found < 0) {
        break; // When there was no more found
      }
      let beginPoint = found;
      const endPoint: number = source.indexOf("*/", beginPoint);
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }

      source = source.substr(0, beginPoint) + source.substring(endPoint + 2, source.length);
    }
    return source;
  }
}

export default RemoveCommentTransformer;
