import DescriptionTransformer from "./Base/DescriptionTransformer";
class SourceSeparateTransformer extends DescriptionTransformer {
  constructor() {
    super((transform) => {
     let fragment = SourceSeparateTransformer._removeSelfOnlyTag(SourceSeparateTransformer._removeOtherPart(transform.transformSource, "vert"), "frag");
     let vertex = SourceSeparateTransformer._removeSelfOnlyTag(SourceSeparateTransformer._removeOtherPart(transform.transformSource, "frag"), "vert");
     return {
       fragment: fragment,
       vertex: vertex,
       uniforms: transform.description.uniforms,
       attributes: transform.description.attributes,
       fragmentPrecisions: transform.description.fragmentPrecisions,
       vertexPrecisions: transform.description.vertexPrecisions,
       functions: transform.description.functions
     };
    });
  }

  private static _removeOtherPart(source: string, partFlag: string): string {
    const regex = new RegExp(`\s*(?:\/\/+)?\s*@${partFlag}`, "g");
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break; // When there was no more found
      }
      let beginPoint = found.index;
      let index = source.indexOf("{", beginPoint); // ignore next {
      const endPoint: number = this._getEndBracketIndex(source, index, "{", "}") + 1;
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }

      source = source.substr(0, beginPoint) + source.substring(endPoint, source.length);
    }
    return source;
  }

  private static _removeSelfOnlyTag(source: string, partFlag: string): string {
    const regex = new RegExp(`(\s*(?:\/\/+)?\s*@${partFlag})`, "g");
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break; // When there was no more found
      }
      let index = source.indexOf("{", found.index); // ignore next {
      let beginPoint = index;
      const endPoint: number = this._getEndBracketIndex(source, index, "{", "}") + 1;
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }
      source = source.substr(0, found.index) + source.substring(beginPoint + 1, endPoint - 1) + source.substring(endPoint + 1, source.length);
    }
    return source;
  }

  private static _getEndBracketIndex(source: string, startIndex: number, beginBracket: string, endBracket: string): number {
    // get index of matching endBracket
    let index = startIndex;

    let bracketCount = 1;
    while (true) { // find matching bracket
      if (bracketCount === 0) {
        break;
      }
      index++;
      const nextEndBlacket = source.indexOf(endBracket, index);
      const nextBeginBlacket = source.indexOf(beginBracket, index);
      if (nextEndBlacket < 0) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return -1;
      }
      if (nextBeginBlacket < 0) {
        index = nextEndBlacket;
        bracketCount--;
        continue;
      }
      if (nextEndBlacket < nextBeginBlacket) {
        index = nextEndBlacket;
        bracketCount--;
        continue;
      } else {
        index = nextBeginBlacket;
        bracketCount++;
        continue;
      }
    }
    return index;
  }
}

export default SourceSeparateTransformer;
