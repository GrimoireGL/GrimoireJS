import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Attribute from "./Attribute";
import ComponentDeclaration from "./ComponentDeclaration";

class Component {
  public declaration: ComponentDeclaration;
  public name: NamespacedIdentity;
  public attributes: NamespacedDictionary<Attribute>;
  public methods: any;

  public constructor(declaration: ComponentDeclaration) {
    this.declaration = declaration;
    this.attributes = declaration.attributeDeclarations.map((dec) => dec.generateAttributeInstance());
    this.methods = new declaration.ctor();
  }

  public sendMessage(message: string, ...args: any[]): boolean {
    if (typeof this.methods[message] === "function") {
      this.methods[message](args);
      return true;
    }
    return false;
  }
}

export default Component;
