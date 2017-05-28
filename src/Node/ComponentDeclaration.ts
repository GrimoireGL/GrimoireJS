import Constants from "../Base/Constants";
import GrimoireInterface from "../GrimoireInterface";
import Attribute from "./Attribute";
import NSDictionary from "../Base/NSDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NSIdentity from "../Base/NSIdentity";
import Component from "./Component";
import {Ctor} from "../Base/Types";

export default class ComponentDeclaration {
  public static ctorMap: { ctor: Ctor<Component>, name: NSIdentity }[] = [];

  public constructor(
    public name: NSIdentity,
    public attributes: { [name: string]: IAttributeDeclaration },
    public ctor: Ctor<Component>) {
    ComponentDeclaration.ctorMap.push({ ctor: ctor, name: name });
  }

  public generateInstance(componentElement?: Element): Component { //TODO: obsolete.make all operation on gomlnode
    componentElement = componentElement ? componentElement : document.createElementNS(this.name.ns, this.name.name);
    const component = new this.ctor();
    componentElement.setAttribute(Constants.x_gr_id, component.id);
    GrimoireInterface.componentDictionary[component.id] = component;
    component.name = this.name;
    component.element = componentElement;
    component.attributes = new NSDictionary<Attribute>();
    for (let key in this.attributes) {
      Attribute.generateAttributeForComponent(key, this.attributes[key], component);
    }
    return component;
  }
}
