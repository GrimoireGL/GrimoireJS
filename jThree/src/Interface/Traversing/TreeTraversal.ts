import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";

class TreeTraversal extends J3ObjectBase {
  public find(selector: string): J3Object;
  public find(node: GomlTreeNodeBase): J3Object;
  public find(j3obj: J3Object): J3Object;
  public find(argu: any): J3Object {
    switch (true) {
      case (isString(argu)):
        let ret_node: GomlTreeNodeBase[] = [];
        this.getArray().forEach((node) => {
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
}

export default TreeTraversal;
