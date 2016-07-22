import Ensure from "../Base/Ensure";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import Component from "./Component";
import GrimoireInterface from "../GrimoireInterface";

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

  public generateInstance(): Component {
    const instance = new this.ctor();
    instance.name = this.name;
    instance.attributes = this.attributeDeclarations.map((attrDec) => attrDec.generateAttributeInstance());
    return instance;
  }

  // public registerComponent(): void {
  //   const attr: { [key: string]: IAttributeDeclaration } = {};
  //   GrimoireInterface.registerComponent(this.name, attr, this.ctor);
  //   // GrimoireInterface.registerComponent("name",{"attr1":{converter:"",defaultValue:""}},null)
  // }
}

export default ComponentDeclaration;
