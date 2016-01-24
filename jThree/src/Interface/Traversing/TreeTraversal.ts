import J3Object = require("../J3Object");
import J3ObjectBase = require("../J3ObjectBase");
import InterfaceSelector = require("../InterfaceSelector");
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import isString = require("lodash.isstring");

class TreeTraversal extends J3ObjectBase {
  public find(selector: string): J3Object;
  public find(node: GomlTreeNodeBase): J3Object;
  public find(j3obj: J3Object): J3Object;
  public find(argu: any): J3Object {
    switch (true) {
      case (isString(argu)):
        let ret_node: GomlTreeNodeBase[] = [];
        this.getArray().forEach((node) => {
          ret_node = ret_node.concat(InterfaceSelector.find(<string>argu, node));
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

export = TreeTraversal;
