import NamespacedIdentity from "../Base/NamespacedIdentity";
import Attribute from "./Attribute";
import ComponentDeclaration from "./ComponentDeclaration";

class Component {
  public declaration: ComponentDeclaration;
  public name: NamespacedIdentity;
  public requiredAttributes: Attribute[];
  public optionalAttributes: Attribute[];
  public methods: { [key: string]: any };

  public constructor(declaration: ComponentDeclaration) {
    this.declaration = declaration;
    this.requiredAttributes = declaration.requiredAttributes.map((dec) => dec.generateAttributeInstance());
    this.optionalAttributes = declaration.optionalAttributes.map((dec) => dec.generateAttributeInstance());
  }
}

export default Component;
