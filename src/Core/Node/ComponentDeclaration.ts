import GrimoireInterface from "../GrimoireInterface";
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

  public generateInstance(componentElement?: Element): Component {
    componentElement = componentElement ? componentElement : document.createElementNS(this.name.ns, this.name.name);
    const component = new this.ctor();
    componentElement.setAttribute("x-gr-id", component.id);
    GrimoireInterface.componentDictionary[component.id] = component;
    component.name = this.name;
    component.element = componentElement;
    component.attributes = new NamespacedDictionary<Attribute>();
    for (let key in this.attributes) {
      const attr = new Attribute(key, this.attributes[key], component);
      component.attributes.set(attr.name, attr);
    }
    return component;
  }
}

export default ComponentDeclaration;
