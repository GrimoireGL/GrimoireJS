import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
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
    const thisNodes = this.__getArray()
    let nodes = [];
    switch (true) {
      case (isString(argu)):
        const foundNodes = J3Object.find(<string>argu);
        nodes = thisNodes.filter((node) => {
          return foundNodes.indexOf(node) !== -1;
        });
        break;
      case (isFunction(argu)):
        nodes = thisNodes.filter((node, index) => {
          return (<(index: number, node: GomlTreeNodeBase) => boolean>argu)(index, node);
        });
        break;
      case (isArray(argu) && (argu.every((v) => v instanceof GomlTreeNodeBase))):
        nodes = thisNodes.filter((node) => {
          return (<GomlTreeNodeBase[]>argu).indexOf(node) !== -1;
        });
        break;
      case (argu instanceof GomlTreeNodeBase):
        nodes = thisNodes.filter((node) => {
          return node === (<GomlTreeNodeBase>argu);
        });
        break;
      case (argu instanceof J3Object):
        nodes = thisNodes.filter((node) => {
          return (<J3Object>argu).index(node) !== -1;
        });
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    return new J3Object(nodes);
  }
}

export default Filtering;
