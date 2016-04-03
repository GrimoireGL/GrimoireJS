import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SomeToNode from "../Static/SomeToNodes";
import NodeOperation from "../Static/NodeOperation";
import isFunction from "lodash.isfunction";

class NodeInsertionInside extends J3ObjectBase {
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
    argu.forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        const targets = this.__getArray();
        const contents = SomeToNode.convert(argu_, ["xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
        if (!contents) {
          throw new Error("Argument type is not correct");
        }
        NodeOperation.insert(targets, contents);
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
    const targets = SomeToNode.convert(argu, ["selector", "xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
    const contents = this.__getArray();
    if (!targets) {
      throw new Error("Argument type is not correct");
    }
    NodeOperation.insert(targets, contents);
    return this;
  }

  public prepend(...contents: string[]): J3Object;
  public prepend(...contents: GomlTreeNodeBase[]): J3Object;
  public prepend(...contents: J3Object[]): J3Object;
  public prepend(...contents: string[][]): J3Object;
  public prepend(...contents: GomlTreeNodeBase[][]): J3Object;
  public prepend(...contents: J3Object[][]): J3Object;
  public prepend(func: (index: number, goml: string) => string): J3Object;
  public prepend(func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
  public prepend(func: (index: number, goml: string) => J3Object): J3Object;
  public prepend(...argu: any[]): any {
    argu.reverse().forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        const targets = this.__getArray();
        const contents = SomeToNode.convert(argu_, ["xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
        if (!contents) {
          throw new Error("Argument type is not correct");
        }
        NodeOperation.insert(targets, contents, () => 0);
      }
    });
    return this;
  }

  public prependTo(target: string): J3Object;
  public prependTo(target: GomlTreeNodeBase): J3Object;
  public prependTo(target: J3Object): J3Object;
  public prependTo(targets: GomlTreeNodeBase[]): J3Object;
  public prependTo(targets: J3Object[]): J3Object;
  public prependTo(argu: any): any {
    const targets = SomeToNode.convert(argu, ["selector", "xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
    const contents = this.__getArray();
    if (!targets) {
      throw new Error("Argument type is not correct");
    }
    NodeOperation.insert(targets, contents, () => 0);
    return this;
  }
}

export default NodeInsertionInside;
