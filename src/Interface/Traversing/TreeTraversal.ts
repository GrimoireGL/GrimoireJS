import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";
import Filter from "../Static/Filter";
import isUndefind from "lodash.isundefined";

class TreeTraversal extends J3ObjectBase {
  private static _filtering(nodes: GomlTreeNodeBase[], argu: any, block: (node: GomlTreeNodeBase) => any): GomlTreeNodeBase[] {
    let ret: GomlTreeNodeBase[] = [];
    const targets: GomlTreeNodeBase[] = Array.prototype.concat.apply([], nodes.map(block).filter((v) => v != null));
    switch (true) {
      case isUndefind(argu):
        ret = targets;
        break;
      case isString(argu):
        ret = Filter.filter(targets, argu, ["selector"]);
        break;
      default:
        return null;
    }
    return ret.filter((n, i, self) => {
      return self.indexOf(n) === i;
    });
  }

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

  public children(): J3Object;
  public children(selector: string): J3Object;
  public children(argu?: any): any {
    const nodes = TreeTraversal._filtering(this.__getArray(), argu, (node) => {
      return node.children;
    });
    if (nodes) {
      return new J3Object(nodes);
    } else {
      throw new Error("Argument type is not correct");
    }
  }

  public parent(): J3Object;
  public parent(selector: string): J3Object;
  public parent(argu?: any): any {
    const nodes = TreeTraversal._filtering(this.__getArray(), argu, (node) => {
      return node.parent;
    });
    if (nodes) {
      return new J3Object(nodes);
    } else {
      throw new Error("Argument type is not correct");
    }
  }

  public parents(): J3Object;
  public parents(selector: string): J3Object;
  public parents(argu?: any): any {
    const nodes = TreeTraversal._filtering(this.__getArray(), argu, (node) => {
      const ancestors: GomlTreeNodeBase[] = [];
      let current = node;
      for (; current.parent; ) {
        ancestors.push(<GomlTreeNodeBase>current.parent);
        current = <GomlTreeNodeBase>current.parent;
      }
      return ancestors;
    });
    if (nodes) {
      return new J3Object(nodes);
    } else {
      throw new Error("Argument type is not correct");
    }
  }

  public prev(): J3Object;
  public prev(selector: string): J3Object;
  public prev(argu?: any): any {
    const nodes = TreeTraversal._filtering(this.__getArray(), argu, (node) => {
      return node.parent.children[node.index - 1];
    });
    if (nodes) {
      return new J3Object(nodes);
    } else {
      throw new Error("Argument type is not correct");
    }
  }

  public next(): J3Object;
  public next(selector: string): J3Object;
  public next(argu?: any): any {
    const nodes = TreeTraversal._filtering(this.__getArray(), argu, (node) => {
      return node.parent.children[node.index + 1];
    });
    if (nodes) {
      return new J3Object(nodes);
    } else {
      throw new Error("Argument type is not correct");
    }
  }
}

export default TreeTraversal;
