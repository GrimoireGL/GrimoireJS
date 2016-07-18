import Attribute from "./Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import ComponentDeclaration from "./ComponentDeclaration";

class AttributeDeclaration {
    public componentDeclaration: ComponentDeclaration;

    public constructor(
        public name: NamespacedIdentity,
        public defaultValue: any,
        public converter: NamespacedIdentity) {
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
