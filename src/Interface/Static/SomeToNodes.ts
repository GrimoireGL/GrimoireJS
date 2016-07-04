import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import XMLParser from "../../Goml/XMLParser";
import NodeManager from "../../Goml/NodeManager";
import GomlParser from "../../Goml/GomlParser";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";

class SomeToNode {
  public static convert(targets: any[], filterType: string[]): GomlTreeNodeBase[];
  public static convert(target: any, filterType: string[]): GomlTreeNodeBase[];
  public static convert(target: any, filterType: string[]): GomlTreeNodeBase[] {
    let targets = [];
    let isArrayFlag = false;
    if (isArray(target)) {
      isArrayFlag = true;
      if (filterType.map((v) => { return v.substr(-2, 2) === "[]"; }).some((v) => v)) {
        targets = target;
      } else {
        return null;
      }
    } else {
      targets = [target];
    }
    const converted_nested: GomlTreeNodeBase[][] = targets.map<GomlTreeNodeBase[]>((t) => {
      let ret: GomlTreeNodeBase[] = null;
      switch (true) {
        case isString(t):
          let isXml = false;
          if (isArrayFlag ? filterType.indexOf("xmlstring[]") !== -1 : filterType.indexOf("xmlstring") !== -1) {
            isXml = (<string>t).charAt(0) === "<";
          }
          if (isXml) {
            // t is xml
            const parseObj = new XMLParser(<string>t);
            ret = parseObj.elements.map((elem, i) => {
              return GomlParser.parse(elem, NodeManager.configurator);
            });
          } else if (isArrayFlag ? filterType.indexOf("selector[]") !== -1 : filterType.indexOf("selector") !== -1) {
            // t is selector
            ret = J3Object.find(t);
          } else {
            ret = null;
          }
          break;
        case (t instanceof GomlTreeNodeBase && (isArrayFlag ? filterType.indexOf("node[]") !== -1 : filterType.indexOf("node") !== -1)):
          ret = [t];
          break;
        case (t instanceof J3Object && (isArrayFlag ? filterType.indexOf("j3obj[]") !== -1 : filterType.indexOf("j3obj") !== -1)):
          ret = [];
          J3Object.each(<J3ObjectBase>t, (i, node) => {
            ret.push(node);
          });
          break;
        default:
          ret = null;
      }
      return ret;
    });
    const converted: GomlTreeNodeBase[] = Array.prototype.concat.apply([], converted_nested);
    if (converted.some((v) => { return v === null; })) {
      return null;
    } else {
      return converted;
    }
  }
}

export default SomeToNode;
