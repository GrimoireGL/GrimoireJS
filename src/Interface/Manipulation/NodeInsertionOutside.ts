import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SomeToNode from "../Static/SomeToNodes";
import NodeOperation from "../Static/NodeOperation";
import isFunction from "lodash.isfunction";

class NodeInsertionInside extends J3ObjectBase {
  public after(...contents: string[]): J3Object;
  public after(...contents: GomlTreeNodeBase[]): J3Object;
  public after(...contents: J3Object[]): J3Object;
  public after(...contents: string[][]): J3Object;
  public after(...contents: GomlTreeNodeBase[][]): J3Object;
  public after(...contents: J3Object[][]): J3Object;
  public after(func: (index: number, goml: string) => string): J3Object;
  public after(func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
  public after(func: (index: number, goml: string) => J3Object): J3Object;
  public after(...argu: any[]): any {
    argu.reverse().forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        const targets = this.__getArray().map((t) => <GomlTreeNodeBase>t.parent);
        const contents = SomeToNode.convert(argu_, ["xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
        if (!contents) {
          throw new Error("Argument type is not correct");
        }
        NodeOperation.insert(targets, contents, (t, j) => this.__getArray()[j].index + 1);
      }
    });
    return this;
  }

  public insertAfter(target: string): J3Object;
  public insertAfter(target: GomlTreeNodeBase): J3Object;
  public insertAfter(target: J3Object): J3Object;
  public insertAfter(targets: GomlTreeNodeBase[]): J3Object;
  public insertAfter(targets: J3Object[]): J3Object;
  public insertAfter(argu: any): any {
    const targetsChildren = SomeToNode.convert(argu, ["selector", "xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
    const targets = targetsChildren.map((t) => <GomlTreeNodeBase>t.parent);
    const contents = this.__getArray();
    if (!targets) {
      throw new Error("Argument type is not correct");
    }
    NodeOperation.insert(targets, contents, (t, j) => targetsChildren[j].index + 1);
    return this;
  }

  public before(...contents: string[]): J3Object;
  public before(...contents: GomlTreeNodeBase[]): J3Object;
  public before(...contents: J3Object[]): J3Object;
  public before(...contents: string[][]): J3Object;
  public before(...contents: GomlTreeNodeBase[][]): J3Object;
  public before(...contents: J3Object[][]): J3Object;
  public before(func: (index: number, goml: string) => string): J3Object;
  public before(func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
  public before(func: (index: number, goml: string) => J3Object): J3Object;
  public before(...argu: any[]): any {
    argu.forEach((argu_, i) => {
      if (i === 0 && isFunction(argu_)) {
        throw new Error("Not implemented yet");
      } else {
        const targets = this.__getArray().map((t) => <GomlTreeNodeBase>t.parent);
        const contents = SomeToNode.convert(argu_, ["xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
        if (!contents) {
          throw new Error("Argument type is not correct");
        }
        NodeOperation.insert(targets, contents, (t, j) => this.__getArray()[j].index);
      }
    });
    return this;
  }

  public insertBefore(target: string): J3Object;
  public insertBefore(target: GomlTreeNodeBase): J3Object;
  public insertBefore(target: J3Object): J3Object;
  public insertBefore(targets: GomlTreeNodeBase[]): J3Object;
  public insertBefore(targets: J3Object[]): J3Object;
  public insertBefore(argu: any): any {
    const targetsChildren = SomeToNode.convert(argu, ["selector", "xmlstring", "node", "node[]", "j3obj", "j3obj[]"]);
    const targets = targetsChildren.map((t) => <GomlTreeNodeBase>t.parent);
    const contents = this.__getArray();
    if (!targets) {
      throw new Error("Argument type is not correct");
    }
    NodeOperation.insert(targets, contents, (t, j) => targetsChildren[j].index);
    return this;
  }
}

export default NodeInsertionInside;
