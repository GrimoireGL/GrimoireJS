import GomlNode from "./GomlNode";
import Ensure from "../Base/Ensure";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import Component from "./Component";

class ComponentDeclaration {

  public attributeDeclarations: NamespacedDictionary<AttributeDeclaration> = new NamespacedDictionary<AttributeDeclaration>();

  public constructor(
    public name: NamespacedIdentity,
    attributes: { [name: string]: IAttributeDeclaration },
    public ctor: new () => Component) {
    for (let key in attributes) {
      const val = attributes[key];
      const converter = Ensure.ensureTobeNamespacedIdentity(val.converter);
      const attr = new AttributeDeclaration(this, key, val.defaultValue, converter as NamespacedIdentity);
      this.attributeDeclarations.set(attr.name, attr);
    }
  }

  public generateInstance(element: Element, node: GomlNode): Component {
    const instance = new this.ctor();
    instance.name = this.name;
    instance.element = element;
    instance.attributes = this.attributeDeclarations.map((attrDec) => attrDec.generateAttributeInstance());
    instance.node = node;
    if (typeof instance["awake"] === "function") {
      instance["awake"]();
    }
    return instance;
  }
}

export default ComponentDeclaration;
