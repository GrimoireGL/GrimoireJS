import Attribute from "./Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";

class ComponentBase {
  public Name: NamespacedIdentity;
  public RequiredAttributes: Attribute[];
  public OptionalAttributes: Attribute[];

  public constructor(name: NamespacedIdentity, requiredAttributes: Attribute[], optionalAttributes: Attribute[]) {
    this.Name = name;
    this.RequiredAttributes = requiredAttributes;
    this.OptionalAttributes = optionalAttributes;
  }
}

export default ComponentBase;
