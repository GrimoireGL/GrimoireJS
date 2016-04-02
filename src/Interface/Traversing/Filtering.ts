import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Filter from "../Static/Filter";
import Find from "../Static/Find";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";
import isFunction from "lodash.isfunction";

class Filtering extends J3ObjectBase {
  public filter(selector: string): J3Object;
  public filter(func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
  public filter(node: GomlTreeNodeBase): J3Object;
  public filter(nodes: GomlTreeNodeBase[]): J3Object;
  public filter(j3obj: J3Object): J3Object;
  public filter(argu: any): J3Object {
    const thisNodes = this.__getArray();
    let nodes = [];
    switch (true) {
      case (isString(argu)
        || (isArray(argu) && (argu.every((v) => v instanceof GomlTreeNodeBase)))
        || (argu instanceof GomlTreeNodeBase)
        || (argu instanceof J3Object)):
        nodes = Filter.filter(thisNodes, argu, ["selector", "node", "node[]", "j3obj"]);
        break;
      case (isFunction(argu)):
        nodes = thisNodes.filter((node, index) => {
          return (<(index: number, node: GomlTreeNodeBase) => boolean>argu)(index, node);
        });
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    return new J3Object(nodes);
  }

  public eq(index: number): J3Object {
    return new J3Object(this.__getArray()[index >= 0 ? index : this.length + index]);
  }

  public first(): J3Object {
    return new J3Object(this.__getArray()[0]);
  }

  public last(): J3Object {
    return new J3Object(this.__getArray()[this.length - 1]);
  }

  public has(selector: string): J3Object;
  public has(contained: GomlTreeNodeBase): J3Object;
  public has(argu: any): J3Object {
    let cred = [];
    switch (true) {
      case (isString(argu)):
        cred = Find.find(argu);
        break;
      case (argu instanceof GomlTreeNodeBase):
        cred = [argu];
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    return new J3Object(this.__getArray().filter((node) => {
      return node.callRecursiveWithReturn((n) => {
        return cred.indexOf(n) !== -1 && n !== node;
      }).some((v) => v);
    }));
  }

  public is(selector: string): boolean;
  public is(func: (index: number, node: GomlTreeNodeBase) => boolean): boolean;
  public is(selection: J3Object): boolean;
  public is(node: GomlTreeNodeBase): boolean;
  public is(argu: any): boolean {
    switch (true) {
      case isFunction(argu):
        return this.__getArray().map((node, i) => {
          return <boolean>argu.call(node, i, node);
        }).some((v) => v);
      case (isString(argu) || (argu instanceof J3Object) || (argu instanceof GomlTreeNodeBase)):
        return Filter.filter(this.__getArray(), argu, ["selector", "node", "j3obj"]).length !== 0;
      default:
        break;
    }
    return;
  }

  public not(selector: string): J3Object;
  public not(node: GomlTreeNodeBase): J3Object;
  public not(nodes: GomlTreeNodeBase[]): J3Object;
  public not(func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
  public not(selection: J3Object): J3Object;
  public not(argu: any): J3Object {
    switch (true) {
      case isFunction(argu):
        return new J3Object(this.__getArray().filter((node, i) => {
          return !argu.call(node, i, node);
        }));
      case (isString(argu)
        || (isArray(argu) && (argu.every((v) => v instanceof GomlTreeNodeBase)))
        || (argu instanceof GomlTreeNodeBase)
        || (argu instanceof J3Object)):
        return new J3Object(Filter.filter(this.__getArray(), argu, ["selector", "node", "node[]", "j3obj"], (node, i, filterNodes) => {
          return filterNodes.indexOf(node) === -1;
        }));
      default:
        break;
    }
    return;
  }

  public slice(start: number, end: number): J3Object {
    return new J3Object(this.__getArray().slice(start, end));
  }
}

export default Filtering;
