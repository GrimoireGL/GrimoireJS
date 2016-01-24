import J3Object = require("../J3Object");
import J3ObjectBase = require("../J3ObjectBase");
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");

class GomlNodeMethods extends J3ObjectBase {
  public get(): GomlTreeNodeBase[];
  public get(index: number): GomlTreeNodeBase;
  public get(argu?: number): any {
    let ret: GomlTreeNodeBase[] | GomlTreeNodeBase = null;
    if (argu) {
      ret = this[argu];
    } else {
      ret = this.getArray();
    }
    return ret;
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
