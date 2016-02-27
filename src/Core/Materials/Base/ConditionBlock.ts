import IConditionRegister from "./IConditionRegister";
import JSON5 from "json5";

class ConditionBlock {
  private type: string;
  private condition: JSON;
  private isPlain: boolean;
  private isRoot: boolean;
  private children: ConditionBlock[];
  private content: string;

  constructor(condition: JSON, children: ConditionBlock[], isPlain: boolean, content: string) {
    this.children = children;
    this.condition = condition;
    if (condition != null) {
      this.type = condition["type"];
    }
    this.isPlain = isPlain;
    this.content = content;
  }
  public static parseCondition(source: string): ConditionBlock {
    let ret = new ConditionBlock(null, ConditionBlock._parseCondition(source), false, null);
    ret.isRoot = true;
    return ret;
  }

  private static _parseCondition(source: string): ConditionBlock[] {
    let ret: ConditionBlock[] = [];
    const found = source.indexOf("@Condition(", 0);
    if (found < 0) {
      ret.push(ConditionBlock.createPlain(source));
      return ret; // When there was no more found
    }

    let beginConditionPoint = found + 10;
    const endConditionPoint: number = ConditionBlock._getEndBracketIndex(source, beginConditionPoint, "(", ")");
    if (endConditionPoint < 1) {
      // error no bracket matching
      console.error("Invalid bracket matching!");
      return null;
    }
    let beginContentPoint = source.indexOf("{", endConditionPoint);
    if (beginContentPoint < 0) {
      // error no bracket matching
      console.error("Invalid bracket matching!");
      return null;
    }
    const endContentPoint = ConditionBlock._getEndBracketIndex(source, beginContentPoint, "{", "}");
    if (endContentPoint < 0) {
      // error no bracket matching
      console.error("Invalid bracket matching!");
      return null;
    }
    let before: string = source.substring(0, found);
    let condition: string = source.substring(beginConditionPoint + 1, endConditionPoint);
    let jsonCondition: JSON = JSON5.parse(condition);
    let content: string = source.substring(beginContentPoint + 1, endContentPoint);
    let after: string = source.substring(endContentPoint + 1, source.length);
    ret.push(ConditionBlock.createPlain(before));
    ret.push(new ConditionBlock(jsonCondition, ConditionBlock._parseCondition(content), false, null));
    ret = ret.concat(ConditionBlock._parseCondition(after));
    return ret;
  }
  private static createPlain(content: string) {
    return new ConditionBlock(null, [], true, content);
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


  public resolve(conditionRegister: IConditionRegister): string {

    if (!this.isRoot) {


      if (this.isPlain) {
        return this.content;
      }

      let cc = conditionRegister.getConditionChecker(this.type);
      if (cc == null) {
        return "";
      }

      if (!cc.checkCondition(this.condition)) {
        return "";
      }

    }
    let ret = "";
    for (let i = 0; i < this.children.length; i++) {
      ret = ret + this.children[i].resolve(conditionRegister);
    }
    return ret;
  }


}
export default ConditionBlock;
