import J3Object = require("../J3Object");
import J3ObjectBase = require("../J3ObjectBase");
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import isNumber = require("lodash.isnumber");
import isUndefiend = require("lodash.isundefined");

class GomlNodeMethods extends J3ObjectBase {
  public get(): GomlTreeNodeBase[];
  public get(index: number): GomlTreeNodeBase;
  public get(argu?: number): any {
    switch (true) {
      case (isNumber(argu)):
        return this[argu];
      case (isUndefiend(argu)):
        return this.getArray();
      default:
        throw new Error("Argument type is not correct");
    }
  }

  public index(): number;
  public index(selector: string): number;
  public index(node: GomlTreeNodeBase): number;
  public index(j3obj: J3Object): number;
  public index(argu?: any): number {
    throw new Error("Not implemented yet");
  }
}

export = GomlNodeMethods;
