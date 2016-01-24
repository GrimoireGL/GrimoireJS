import J3Object = require("../J3Object");
import J3ObjectBase = require("../J3ObjectBase");
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import isString = require("lodash.isstring");
import isUndefined = require("lodash.isundefined");
import isPlainObject = require("lodash.isplainobject");
import isFunction = require("lodash.isfunction");

class GeneralAttribute extends J3ObjectBase {
  private static _setAttr(node: GomlTreeNodeBase, attributeName: string, value: any): void {
    if (node.attributes.isDefined(attributeName)) {
      node.attributes.setValue(attributeName, value);
    } else {
      const gomlAttribute = node.attributes.reserveAttribute(attributeName, value);
      gomlAttribute.on("changed", (ga) => {
        node.props.getProp<HTMLElement>("elem").setAttribute(attributeName, ga.Value);
      });
      gomlAttribute.notifyValueChanged();
    }
  }

  public attr(attributeName: string): string;
  public attr(attributeName: string, value: any): J3Object;
  public attr(attributes: Object): J3Object;
  public attr(attributeName: string, func: (number, string) => string): J3Object;
  public attr(attributeName: string, func: (number, string) => number): J3Object;
  public attr(argu0: any, argu1?: any): any {
    if (this.length === 0) {
      throw new Error("No target");
    }
    if (isString(argu0)) {
      switch (true) {
        case (isUndefined(argu1)):
          return (<GomlTreeNodeBase>this[0]).attributes.getValueStr(<string>argu0);
        case (isFunction(argu1)):
          throw new Error("Not implemented yet");
        default:
          J3Object.each(<any>this, (i, node) => {
            GeneralAttribute._setAttr(node, <string>argu0, argu1);
          });
          return this;
      }
    } else if (isPlainObject(argu0)) {
      Object.keys(<Object>argu0).forEach((attributeName) => {
        GeneralAttribute._setAttr(this[0], attributeName, argu0[attributeName]);
      });
      return this;
    } else {
      throw new Error("Argument type is not correct");
    }
  }

  public attrObj(attributeName: string): any;
  public attrObj(attributeName: string, value: any): J3Object;
  public attrObj(attributes: Object): J3Object;
  public attrObj(argu0: any, argu1?: any): any {
    if (this.length === 0) {
      throw new Error("No target");
    }
    if (isString(argu0)) {
      switch (true) {
        case (isUndefined(argu1)):
          return (<GomlTreeNodeBase>this[0]).attributes.getValue(<string>argu0);
        default:
          J3Object.each(<any>this, (i, node) => {
            GeneralAttribute._setAttr(node, <string>argu0, argu1);
          });
          return this;
      }
    } else if (isPlainObject(argu0)) {
      Object.keys(<Object>argu0).forEach((attributeName) => {
        GeneralAttribute._setAttr(this[0], attributeName, argu0[attributeName]);
      });
      return this;
    } else {
      throw new Error("Argument type is not correct");
    }
  }
}

export = GeneralAttribute;
