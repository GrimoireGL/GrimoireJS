import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Component from "./Component";

class ComponentDeclaration {

  public attributes: { [key: string]: IAttributeDeclaration };

  public constructor(
    public name: NamespacedIdentity,
    attributes: { [name: string]: IAttributeDeclaration },
    public ctor: new () => Component) {
    this.attributes = attributes;
  }

  public generateInstance(element: Element, node: GomlNode): Component {
    const instance = new this.ctor();
    instance.name = this.name;
    instance.element = element;
    instance.attributes = new NamespacedDictionary<Attribute>();
    instance.tree = node.treeInterface;
    for (let key in this.attributes) {
      const attr = new Attribute(key, this.attributes[key], instance);
      instance.attributes.set(attr.name, attr);
    }
    instance.node = node;
    if (typeof instance["awake"] === "function") {
      instance["awake"]();
    }
    return instance;
  }
}

export default ComponentDeclaration;
