import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import J3Object from "../J3Object";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";
import isFunction from "lodash.isfunction";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import NodeManager from "../../Goml/NodeManager";
import XMLParser from "../../Goml/XMLParser";

class NodeInsertionInside extends J3ObjectBase {
  private static _appendSomeToNode(targetNode: GomlTreeNodeBase, content: string): void;
  private static _appendSomeToNode(targetNode: GomlTreeNodeBase, content: GomlTreeNodeBase): void;
  private static _appendSomeToNode(targetNode: GomlTreeNodeBase, content: J3Object): void;
  private static _appendSomeToNode(argu0: GomlTreeNodeBase, argu1: any): void {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    switch (true) {
      case (isString(argu1)):
        nodeManager.insertNodeByString(<string>argu1, argu0);
        break;
      case (argu1 instanceof GomlTreeNodeBase):
        throw new Error("Not implemented yet");
      case (argu1 instanceof J3Object):
        throw new Error("Not implemented yet");
      default:
        throw new Error("Argument type is not correct");
    }
  }

  private static _appendSomeToNodes(targetNodes: GomlTreeNodeBase[], content: string): void;
  private static _appendSomeToNodes(targetNodes: GomlTreeNodeBase[], content: GomlTreeNodeBase): void;
  private static _appendSomeToNodes(targetNodes: GomlTreeNodeBase[], content: J3Object): void;
  private static _appendSomeToNodes(argu0: GomlTreeNodeBase[], argu1: any): void {
    argu0.forEach((target) => {
      NodeInsertionInside._appendSomeToNode(target, argu1);
    });
  }

  private static _appendNodeToSome(target: string, content: GomlTreeNodeBase): void;
  private static _appendNodeToSome(target: GomlTreeNodeBase, content: GomlTreeNodeBase): void;
  private static _appendNodeToSome(target: J3Object, content: GomlTreeNodeBase): void;
  private static _appendNodeToSome(argu0: any, argu1: GomlTreeNodeBase): void {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    switch (true) {
      case isString(argu0):
        const xml = new XMLParser(<string>argu0);
        if (xml.isValid) {
          // argu0 is xml
          throw new Error("Not implemented yet");
        } else {
          // argu0 is selector
          const targetsNodes = J3Object.find(argu0);
          targetsNodes.forEach((targetNode) => {
            nodeManager.moveNode(argu1, targetNode);
          });
        }
        break;
      case (argu0 instanceof GomlTreeNodeBase):
        throw new Error("Not implemented yet");
      case (argu0 instanceof J3Object):
        throw new Error("Not implemented yet");
      default:
        throw new Error("Argument type is not correct");
    }
  }

  private static _appendNodesToSome(target: string, contents: GomlTreeNodeBase[]): void;
  private static _appendNodesToSome(target: GomlTreeNodeBase, contents: GomlTreeNodeBase[]): void;
  private static _appendNodesToSome(target: J3Object, contents: GomlTreeNodeBase[]): void;
  private static _appendNodesToSome(argu0: any, argu1: GomlTreeNodeBase[]): void {
    argu1.forEach((content) => {
      NodeInsertionInside._appendNodeToSome(argu0, content)
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
  public append(...argu: any[]): any {
    const thisNodes = this.__getArray()
    let nodes = [];
    argu.forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        if (isArray(argu_)) {
          (<any[]>argu_).forEach((argu__) => {
            NodeInsertionInside._appendSomeToNodes(this.__getArray(), argu__);
          })
        } else {
          NodeInsertionInside._appendSomeToNodes(this.__getArray(), argu_);
        }
      }
    });
    return this;
  }

  public appendTo(target: string): J3Object;
  public appendTo(target: GomlTreeNodeBase): J3Object;
  public appendTo(target: J3Object): J3Object;
  public appendTo(targets: GomlTreeNodeBase[]): J3Object;
  public appendTo(targets: J3Object[]): J3Object;
  public appendTo(argu: any): any {
    if (isArray(argu)) {
      if ((<any[]>argu).some((v) => isString(v))) {
        throw new Error("Argument type is not correct");
      }
      (<any[]>argu).forEach((target) => {
        NodeInsertionInside._appendNodesToSome(target, this.__getArray());
      });
    } else {
      NodeInsertionInside._appendNodesToSome(argu, this.__getArray());
    }
    return this;
  }
}

export default NodeInsertionInside;
