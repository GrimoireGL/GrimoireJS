import ComponentDeclaration from "./Node/ComponentDeclaration";
import Component from "./Node/Component";
import IAttributeDeclaration from "./Node/IAttributeDeclaration";
import AttributeConverter from "./Node/AttributeConverter";
import NamespacedSet from "./Base/NamespacedSet";

import NodeDeclaration from "./Node/NodeDeclaration";
import NamespacedIdentity from "./Base/NamespacedIdentity";
import GOMLInterface from "./Node/GOMLInterface";
import NamespacedDictionary from "./Base/NamespacedDictionary";
import Ensure from "./Base/Ensure";
import {inherits} from "util";

interface IGrimoireInterfaceBase {
    ns(ns: string): (name: string) => NamespacedIdentity;

}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): GOMLInterface;
}

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {
    public nodeDeclarations: NamespacedDictionary<NodeDeclaration> = new NamespacedDictionary<NodeDeclaration>();

    public converters: NamespacedDictionary<AttributeConverter> = new NamespacedDictionary<AttributeConverter>();

    public componentDeclarations: NamespacedDictionary<ComponentDeclaration> = new NamespacedDictionary<ComponentDeclaration>();
    /**
     * Generate namespace helper function
     * @param  {string} ns namespace URI to be used
     * @return {[type]}    the namespaced identity
     */
    public ns(ns: string): (name: string) => NamespacedIdentity {
        return (name: string) => new NamespacedIdentity(ns, name);
    }

// TODO test
    public registerComponent(name: string | NamespacedIdentity, attributes: { [name: string]: IAttributeDeclaration }, obj: Object | (new () => Component)): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        if (typeof obj === "function") {
            if (!(obj.prototype instanceof Component)) {
                throw new Error("Component constructor must extends Component class.");
            }
        } else if (typeof obj === "object") {
            const newCtor = () => {
                return this;
            };
            for (let key in obj) {
                newCtor.prototype[key] = obj[key];
            }
            inherits(newCtor, Component);
            obj = newCtor;
        }
        this.componentDeclarations.set(name as NamespacedIdentity, new ComponentDeclaration(name as NamespacedIdentity, attributes, obj as (new () => Component)));
    }

    public registerNode(name: string | NamespacedIdentity,
        requiredComponents: (string | NamespacedIdentity)[],
        defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
        inherits?: string | NamespacedIdentity,
        requiredComponentsForChildren?: (string | NamespacedIdentity)[]): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        requiredComponents = Ensure.ensureTobeNamespacedIdentityArray(requiredComponents);
        defaultValues = Ensure.ensureTobeNamespacedDictionary<any>(defaultValues, (name as NamespacedIdentity).ns);
        inherits = Ensure.ensureTobeNamespacedIdentity(inherits);
        requiredComponentsForChildren = Ensure.ensureTobeNamespacedIdentityArray(requiredComponentsForChildren);
        this.nodeDeclarations.set(name as NamespacedIdentity,
            new NodeDeclaration(name as NamespacedIdentity,
                NamespacedSet.fromArray(requiredComponents as NamespacedIdentity[]),
                defaultValues as NamespacedDictionary<any>,
                inherits as NamespacedIdentity,
                NamespacedSet.fromArray(requiredComponentsForChildren as NamespacedIdentity[])
            )
        );
    }

    public registerConverter(name: string | NamespacedIdentity, converter: (any) => any): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        this.converters.set(name as NamespacedIdentity, { name: name as NamespacedIdentity, convert: converter });
    }

    private _mixinConstructor(): new () => Component {

    }
}

// TODO export as IGrimoireInterface
export default new GrimoireInterfaceImpl();
