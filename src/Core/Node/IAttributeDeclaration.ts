import NamespacedIdentity from "../Base/NamespacedIdentity";
interface IAttributeDeclaration {
  converter: string | NamespacedIdentity;
  defaultValue: any;
  readonly?: boolean;
  [parameters: string]: any;
}

export default IAttributeDeclaration;
