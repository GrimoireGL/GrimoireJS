import Ensure from "../Base/Ensure";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import Component from "./Component";

class ComponentDeclaration {

    public attributeDeclarations: NamespacedDictionary<AttributeDeclaration> = new NamespacedDictionary<AttributeDeclaration>();

    public constructor(public name: NamespacedIdentity, attributes: { [name: string]: IAttributeDeclaration }, public ctor: new () => Component) {
        for (let key in attributes) {
            const val = attributes[key];
            const identity = new NamespacedIdentity(this.name.ns, key);
            const converter = Ensure.ensureTobeNamespacedIdentity(val.converter);
            this.attributeDeclarations.set(identity, new AttributeDeclaration(identity, val.defaultValue, converter as NamespacedIdentity));
        }
    }

    public generateInstance(): Component {
        const instance = new this.ctor();
        return instance;
    }
}

export default ComponentDeclaration;
