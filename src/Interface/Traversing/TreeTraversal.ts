import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";
import Filter from "../Static/Filter";
import isUndefind from "lodash.isundefined";

class TreeTraversal extends J3ObjectBase {
  public find(selector: string): J3Object;
  public find(node: GomlTreeNodeBase): J3Object;
  public find(j3obj: J3Object): J3Object;
  public find(argu: any): J3Object {
    switch (true) {
      case (isString(argu)):
        let ret_node: GomlTreeNodeBase[] = [];
        this.__getArray().forEach((node) => {
          ret_node = ret_node.concat(J3Object.find(<string>argu, node));
        });
        return new J3Object(ret_node);
      case (argu instanceof GomlTreeNodeBase):
        throw new Error("Not implemented yet");
      case (argu instanceof J3Object):
        throw new Error("Not implemented yet");
      default:
        throw new Error("Argument type is not correct");
    }
  }

  public children(selector: string): J3Object;
  public children(argu: any): any {
    switch (true) {
      case isUndefind(argu):
        return new J3Object(Array.prototype.concat.apply([], this.__getArray().map((node) => {
          return node.children;
        })));
      case isString(argu):
        return new J3Object(Filter.filter(Array.prototype.concat.apply([], this.__getArray().map((node) => {
          return node.children;
        })), argu, ["selector"]));
      default:
        throw new Error("Argument type is not correct");
    }
  }
}

export default TreeTraversal;
