import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Attribute from "./Attribute";
import ComponentDeclaration from "./ComponentDeclaration";

class Component {
  public declaration: ComponentDeclaration;
  public name: NamespacedIdentity;
  public attributes: NamespacedDictionary<Attribute>;
  public methods: { [key: string]: any };

  public constructor(declaration: ComponentDeclaration) {
    this.declaration = declaration;
    this.attributes = declaration.attributeDeclarations.map((dec) => dec.generateAttributeInstance());
  }
}

export default Component;
