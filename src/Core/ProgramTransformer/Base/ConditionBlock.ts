import IConditionRegister from "./IConditionRegister";
import JSON5 from "json5";
import Q from "q";

class ConditionBlock {
  private _type: string;
  private _condition: JSON;
  private _isPlain: boolean;
  private _isRoot: boolean;
  private _children: ConditionBlock[];
  private _content: string;

  constructor(condition: JSON, children: ConditionBlock[], isPlain: boolean, content: string) {
    this._children = children;
    this._condition = condition;
    if (condition != null) {
      this._type = condition["type"];
    }
    this._isPlain = isPlain;
    this._content = content;
  }
  public static parseCondition(source: string): ConditionBlock {
    let ret = new ConditionBlock(null, ConditionBlock._parseCondition(source), false, null);
    ret._isRoot = true;
    return ret;
  }

  private static _parseCondition(source: string): ConditionBlock[] {
    let ret: ConditionBlock[] = [];
    const found = source.indexOf("@condition(", 0);
    if (found < 0) {
      ret.push(ConditionBlock._createPlain(source));
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
    ret.push(ConditionBlock._createPlain(before));
    ret.push(new ConditionBlock(jsonCondition, ConditionBlock._parseCondition(content), false, null));
    ret = ret.concat(ConditionBlock._parseCondition(after));
    return ret;
  }
  private static _createPlain(content: string): ConditionBlock {
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


  public resolve(conditionRegister: IConditionRegister): Q.IPromise<string> {

    if (!this._isRoot) {


      if (this._isPlain) {
        return Q.when(this._content);
      }

      let cc = conditionRegister.getConditionChecker(this._type);
      if (cc == null) {
        return Q.when("");
      }

      return cc.checkCondition(this._condition).then(flag => {
        if (!flag) {
          return Q.when("");
        } else {
          let rett: Q.IPromise<string>[] = [];
          for (let i = 0; i < this._children.length; i++) {
            rett.push(this._children[i].resolve(conditionRegister));
          }
          return Q.all(rett).then(data => {
            let ret = "";
            for (let i = 0; i < data.length; i++) {
              ret += data[i];
            }
            return ret;
          });
        }
      });

    } else {
      let rett: Q.IPromise<string>[] = [];
      for (let i = 0; i < this._children.length; i++) {
        rett.push(this._children[i].resolve(conditionRegister));
      }
      return Q.all(rett).then(data => {
        let ret = "";
        for (let i = 0; i < data.length; i++) {
          ret += data[i];
        }
        return ret;
      });
    }
  }


}
export default ConditionBlock;
