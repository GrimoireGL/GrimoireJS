import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";

class Filtering extends J3ObjectBase {
  public filter(selector: string): void;
  public filter(func: (index: number, node: GomlTreeNodeBase) => boolean): void;
  public filter(node: GomlTreeNodeBase): void;
  public filter(nodes: GomlTreeNodeBase[]): void;
  public filter(nodes: J3Object): void;
  public filter(argu: any): void {
    switch (true) {
      case (isString(argu)):
        return;
      case (isArray(argu) && (argu.every((v) => v instanceof GomlTreeNodeBase))):
        throw new Error("Not implemented yet");
      case (argu instanceof GomlTreeNodeBase):
        throw new Error("Not implemented yet");
      case (argu instanceof J3Object):
        throw new Error("Not implemented yet");
      default:
        throw new Error("Argument type is not correct");
    }
  }
}
