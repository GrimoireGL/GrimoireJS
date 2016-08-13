import Attribute from "./Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import ComponentDeclaration from "./ComponentDeclaration";

class AttributeDeclaration {
  public name: NamespacedIdentity;
  public constructor(
    public componentDeclaration: ComponentDeclaration,
    name: string,
    public defaultValue: any,
    public converter: NamespacedIdentity) {
    this.name = new NamespacedIdentity(componentDeclaration.name.ns, name);
  }
  public generateAttributeInstance(): Attribute {
    return new Attribute(this);
  }
}

export default AttributeDeclaration;
