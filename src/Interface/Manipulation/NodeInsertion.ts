import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import J3Object from "../J3Object";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";
import isFunction from "lodash.isfunction";

class NodeInsertion extends J3ObjectBase {
  private _appendOne(content: string): void;
  private _appendOne(content: GomlTreeNodeBase): void;
  private _appendOne(content: J3Object): void;
  private _appendOne(argu: any): void {
    switch (true) {
      case (isString(argu)):
        throw new Error("Not implemented yet");
      case (argu instanceof GomlTreeNodeBase):
        throw new Error("Not implemented yet");
      case (argu instanceof J3Object):
        throw new Error("Not implemented yet");
      default:
        throw new Error("Argument type is not correct");
    }
  }

  public append(...contents: string[]): J3Object;
  public append(...contents: GomlTreeNodeBase[]): J3Object;
  public append(...contents: J3Object[]): J3Object;
  public append(...contents: string[][]): J3Object;
  public append(...contents: GomlTreeNodeBase[][]): J3Object;
  public append(...contents: J3Object[][]): J3Object;
  public append(func: (index: number, goml: string) => string): J3Object;
  public append(func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
  public append(func: (index: number, goml: string) => J3Object): J3Object;
  public append(...argu: any[]): J3Object {
    const thisNodes = this.__getArray()
    let nodes = [];
    argu.forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        if (isArray(argu_)) {
          (<any[]>argu_).forEach((argu__) => {
            this._appendOne(argu__);
          })
        } else {
          this._appendOne(argu_);
        }
      }
    });
    return;
  }
}
