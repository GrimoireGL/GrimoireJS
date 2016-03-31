import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Filter from "../Static/Filter";
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
}

export default Filtering;
