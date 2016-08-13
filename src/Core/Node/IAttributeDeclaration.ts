import NamespacedIdentity from "../Base/NamespacedIdentity";
interface IAttributeDeclaration {
  converter: string | NamespacedIdentity;
  defaultValue: any;
  readonly?: boolean;
}

export default IAttributeDeclaration;
