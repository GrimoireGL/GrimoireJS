import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import J3Object from "../J3Object";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";
import isFunction from "lodash.isfunction";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import NodeManager from "../../Goml/NodeManager";

class NodeInsertion extends J3ObjectBase {
  private static _appendOne(nodes: GomlTreeNodeBase[], content: string): void;
  private static _appendOne(nodes: GomlTreeNodeBase[], content: GomlTreeNodeBase): void;
  private static _appendOne(nodes: GomlTreeNodeBase[], content: J3Object): void;
  private static _appendOne(nodes: GomlTreeNodeBase[], argu: any): void {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    console.log(argu);
    console.log(isString(argu));
    nodes.forEach((node) => {
      switch (true) {
        case (isString(argu)):
          nodeManager.insertNodeByString(<string>argu, node);
          break;
        case (argu instanceof GomlTreeNodeBase):
          throw new Error("Not implemented yet");
        case (argu instanceof J3Object):
          throw new Error("Not implemented yet");
        default:
          throw new Error("Argument type is not correct");
      }
    });
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
            NodeInsertion._appendOne(this.__getArray(), argu__);
          })
        } else {
          NodeInsertion._appendOne(this.__getArray(), argu_);
        }
      }
    });
    return;
  }
}

export default NodeInsertion;
