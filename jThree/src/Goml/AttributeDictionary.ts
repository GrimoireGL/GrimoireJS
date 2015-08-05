import JThreeObject = require("../Base/JThreeObject");
import JThreeCollection = require("../Base/JThreeCollection");
import GomlAttribute = require("./GomlAttribute");
import Delegates = require("../Base/Delegates");
import GomlLoader = require("./GomlLoader");
import EasingFunctionBase = require("./Easing/EasingFunctionBase");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import AttributeDeclaration = require("./AttributeDeclaration");
/**
 * The class managing attributes of a node.
 */
class AttributeDictionary extends JThreeObject {

  /**
   * @param {node} the node this attribute dictionary has.
   * @param {loader} the loader loaded this node.
   * @param {element} the element bound to this node.
   */
  constructor(node: GomlTreeNodeBase, loader: GomlLoader, element: HTMLElement) {
    super();
    this.loader = loader;
    this.element = element;
    this.node = node;
  }

  private node: GomlTreeNodeBase;

  private loader: GomlLoader;

  private element: HTMLElement;

  private attributes: JThreeCollection<GomlAttribute> = new JThreeCollection<GomlAttribute>();

  public getValue(attrName: string): any {
    var attr = this.attributes.getById(attrName);
    if (attr == null) console.warn(`attribute \"${attrName}\" is not found.`);
    else
      return attr.Converter.FromInterface(attr.Value);
  }

  public setValue(attrName: string, value: any, needUpdate: boolean = true): void {
    var attr = this.attributes.getById(attrName);
    if (attr == null) console.warn(`attribute \"${attrName}\" is not found.`);
    else {
      var cacheNotifyConfigure = attr.NeedNotifyUpdate;
      attr.NeedNotifyUpdate = needUpdate;
      attr.Value = value;
      attr.NeedNotifyUpdate = cacheNotifyConfigure;
    }
  }

  public getAttribute(attrName:string):GomlAttribute
  {
    return this.attributes.getById(attrName);
  }

  public getAnimater(attrName: string, beginTime: number, duration: number, beginVal: any, endVal: any, easing: EasingFunctionBase, onComplete?: Delegates.Action0) {
    var attr = this.attributes.getById(attrName);
    if (attr == null) console.warn(`attribute \"${attrName}\" is not found.`);
    else
      return attr.Converter.GetAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete);
  }
  
  /**
   * Check the attribute passed is defined or not.
   */
  public isDefined(attrName: string): boolean {
    return this.attributes.getById(attrName) != null;
  }
  
  /**
   * Define attributes to the node.
   */
  public defineAttribute(attributes: AttributeDeclaration) {
    for (var key in attributes) {
      var attribute = attributes[key];
      this.attributes.insert(new GomlAttribute(this.node, this.element, key, attribute.value, this.loader.Configurator.getConverter(attribute.converter), attribute.handler));
    }
  }
  
  /**
   * Apply default values to all attributes.
   */
  public applyDefaultValue() {
    this.attributes.each(v=> {
      if (typeof v.Value !== "undefined") v.notifyValueChanged();
    });
  }

  public updateValue(attrName?: string) {
    if (typeof attrName === "undefined") {
      this.attributes.each(v=> {
        v.notifyValueChanged();
      });
    } else {
      var target = this.attributes.getById(attrName);
      target.notifyValueChanged();
    }
  }
}

export =AttributeDictionary;
