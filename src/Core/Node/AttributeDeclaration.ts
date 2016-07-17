import Attribute from "./Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import ComponentDeclaration from "./ComponentDeclaration";

class AttributeDeclaration {
  /**
   * Converter name, jThree will interpret the value using this class.
   */
  public converter: string;

  /**
   * default value of this attribute.
   */
  public defaultValue: any;

  /**
   * Whether this attribute accept change by interface or not.
   * default: false
   */
  public constant: boolean;

  public name: NamespacedIdentity;
  public componentDeclaration: ComponentDeclaration;

  public constructor(name: string, defaultValue: any, converter?: string, constant?: boolean) {
    this.converter = converter;
    this.defaultValue = defaultValue;
    this.constant = !!constant;
  }
  public setComponent(componentDeclaration: ComponentDeclaration): void {
    this.componentDeclaration = componentDeclaration;
    this.name = new NamespacedIdentity(componentDeclaration.name.ns, name);
  }
  public generateAttributeInstance(): Attribute {
    return new Attribute(this);
  }
}

export default AttributeDeclaration;
