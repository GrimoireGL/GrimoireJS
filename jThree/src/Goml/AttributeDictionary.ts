import JThreeObject = require("../Base/JThreeObject");
import JThreeCollection = require("../Base/JThreeCollection");
import GomlAttribute = require("./GomlAttribute");
import Delegates = require("../Base/Delegates");
import EasingFunctionBase = require("./Easing/EasingFunctionBase");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import AttributeDeclaration = require('./AttributeDeclaration');

/**
 * The class managing attributes of a node.
 */
class AttributeDictionary extends JThreeObject {

  /**
   * @param {node} the node this attribute dictionary has.
   */
  constructor(node: GomlTreeNodeBase) {
    super();
    this.node = node;
  }

  private node: GomlTreeNodeBase;

  private attributes: { [key: string]: GomlAttribute } = {};

  public forEachAttr(callbackfn: (value: GomlAttribute, key: string, attributes: { [key: string]: GomlAttribute }) => void): AttributeDictionary {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      callbackfn(v, k, this.attributes);
    }, this);
    return this;
  }

  public getValue(attrName: string): any {
    var attr = this.attributes[attrName];
    if (attr === undefined) console.warn(`attribute "${attrName}" is not found.`);
    else
      return attr.Converter.FromInterface(attr.Value);
  }

  public setValue(attrName: string, value: any): void {
    var attr = this.attributes[attrName];
    if (attr === undefined) console.warn(`attribute "${attrName}" is not found.`);
    else {
      if (attr.Constant) {
        console.error(`attribute: ${attrName} is constant attribute`);
        return;
      }
      attr.Value = value;
    }
  }

  public getAttribute(attrName: string): GomlAttribute {
    return this.attributes[attrName];
  }

  public getAnimater(attrName: string, beginTime: number, duration: number, beginVal: any, endVal: any, easing: EasingFunctionBase, onComplete?: Delegates.Action0) {
    var attr = this.attributes[attrName];
    if (attr === undefined) console.warn(`attribute \"${attrName}\" is not found.`);
    else
      return attr.Converter.GetAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete);
  }

  /**
   * Check the attribute passed is defined or not.
   */
  public isDefined(attrName: string): boolean {
    return this.attributes[attrName] != null;
  }

  /**
   * Define attributes to the node.
   *
   * If you define already defined attribute, it will be replaced.
   */
  public defineAttribute(attributes: AttributeDeclaration) {
    for (let key in attributes) {
      const attribute = attributes[key];
      const gomlAttribute = new GomlAttribute(key, attribute.value, this.node.nodeManager.configurator.getConverter(attribute.converter), attribute.constant);
      if (attribute.onchanged) {
        gomlAttribute.on('changed', attribute.onchanged);
      } else {
        console.warn(`attribute "${key}" does not have onchange event handler. this causes lack of attribute's consistency.`);
      }
      this.attributes[key] = gomlAttribute;
    }
  }

  /**
   * Apply default values to all attributes.
   */
  public applyDefaultValue() {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      if (typeof v.Value !== 'undefined') v.notifyValueChanged();
    });
  }

  public updateValue(attrName?: string) {
    if (typeof attrName === 'undefined') {
      Object.keys(this.attributes).forEach((k) => {
        let v = this.attributes[k]
        v.notifyValueChanged();
      });
    } else {
      var target = this.attributes[attrName];
      target.notifyValueChanged();
    }
  }
}

export = AttributeDictionary;
