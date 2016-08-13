import NamespacedIdentity from "../Base/NamespacedIdentity";
interface IAttributeDeclaration {
    converter: string | NamespacedIdentity;
    defaultValue: any;
}

export default IAttributeDeclaration;
