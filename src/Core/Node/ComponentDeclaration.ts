import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import Component from "./Component";

class ComponentDeclaration {
  public name: NamespacedIdentity;
  public requiredAttributes: AttributeDeclaration[];
  public optionalAttributes: AttributeDeclaration[];
  public methods: { [key: string]: any };

  public constructor(name: NamespacedIdentity, requiredAttributes: AttributeDeclaration[], optionalAttributes: AttributeDeclaration[]) {
    this.name = name;
    this.requiredAttributes = requiredAttributes ? requiredAttributes : [];
    this.requiredAttributes.forEach((attr) => {
      attr.setComponent(this);
    });
    this.optionalAttributes = optionalAttributes ? optionalAttributes : [];
    this.optionalAttributes.forEach((attr) => {
      attr.setComponent(this);
    });
  }

  public generateInstance():Component {
    return new Component(this);
  }
}

export default ComponentDeclaration;
