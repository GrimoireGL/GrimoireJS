import GomlNode from "./Node/GomlNode";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import Component from "./Node/Component";
import IAttributeDeclaration from "./Node/IAttributeDeclaration";
import AttributeConverter from "./Node/AttributeConverter";
import NamespacedSet from "./Base/NamespacedSet";
import Constants from "./Base/Constants";

import NodeDeclaration from "./Node/NodeDeclaration";
import NamespacedIdentity from "./Base/NamespacedIdentity";
import GomlInterface from "./Node/GomlInterface";
import NamespacedDictionary from "./Base/NamespacedDictionary";
import Ensure from "./Base/Ensure";
import IDOBject from "./Base/IDObject";
import {inherits} from "util";

interface IGrimoireInterfaceBase {
    ns(ns: string): (name: string) => NamespacedIdentity;

}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): GomlInterface;
}

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {
    public nodeDeclarations: NamespacedDictionary<NodeDeclaration> = new NamespacedDictionary<NodeDeclaration>();

    public converters: NamespacedDictionary<AttributeConverter> = new NamespacedDictionary<AttributeConverter>();

    public componentDeclarations: NamespacedDictionary<ComponentDeclaration> = new NamespacedDictionary<ComponentDeclaration>();

    public rootNodes: { [rootNodeId: string]: GomlNode } = {};

    public loadTasks: (() => Promise<void>)[] = [];
    /**
     * Generate namespace helper function
     * @param  {string} ns namespace URI to be used
     * @return {[type]}    the namespaced identity
     */
    public ns(ns: string): (name: string) => NamespacedIdentity {
        return (name: string) => new NamespacedIdentity(ns, name);
    }

    public register(loadTask: () => Promise<void>): void {
        this.loadTasks.push(loadTask);
    }

    // TODO test
    public registerComponent(name: string | NamespacedIdentity, attributes: { [name: string]: IAttributeDeclaration }, obj: Object | (new () => Component)): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        obj = this._ensureTobeComponentConstructor(obj);
        this.componentDeclarations.set(name as NamespacedIdentity, new ComponentDeclaration(name as NamespacedIdentity, attributes, obj as (new () => Component)));
    }
    public registerComponentDec(declaration: ComponentDeclaration): void {
        this.componentDeclarations.set(declaration.name, declaration);
    }

    public registerNode(name: string | NamespacedIdentity,
        requiredComponents: (string | NamespacedIdentity)[],
        defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
        superNode?: string | NamespacedIdentity,
        requiredComponentsForChildren?: (string | NamespacedIdentity)[]): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        requiredComponents = Ensure.ensureTobeNamespacedIdentityArray(requiredComponents);
        defaultValues = Ensure.ensureTobeNamespacedDictionary<any>(defaultValues, (name as NamespacedIdentity).ns);
        superNode = Ensure.ensureTobeNamespacedIdentity(superNode);
        requiredComponentsForChildren = Ensure.ensureTobeNamespacedIdentityArray(requiredComponentsForChildren);
        this.nodeDeclarations.set(name as NamespacedIdentity,
            new NodeDeclaration(name as NamespacedIdentity,
                NamespacedSet.fromArray(requiredComponents as NamespacedIdentity[]),
                defaultValues as NamespacedDictionary<any>,
                superNode as NamespacedIdentity,
                NamespacedSet.fromArray(requiredComponentsForChildren as NamespacedIdentity[])
            )
        );
    }

    public registerNodeDec(declaration: NodeDeclaration): void {
        this.nodeDeclarations.set(declaration.name, declaration);
    }

    public registerConverter(name: string | NamespacedIdentity, converter: (any) => any): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        this.converters.set(name as NamespacedIdentity, { name: name as NamespacedIdentity, convert: converter });
    }

    public addScriptNode(tag: HTMLScriptElement, node: GomlNode): string {
        const id = IDOBject.getUniqueRandom(10);
        tag.setAttributeNS(Constants.defaultNamespace, "rootNodeId", id);
        this.rootNodes[id] = node;
        return id;
    }

    private _ensureTobeComponentConstructor(obj: Object | (new () => Component)): new () => Component {
        if (typeof obj === "function") {
            if (!((obj as Function).prototype instanceof Component)) {
                throw new Error("Component constructor must extends Component class.");
            }
        } else if (typeof obj === "object") {
            const newCtor = () => { return void 0; };
            for (let key in obj) {
                (newCtor as Function).prototype[key] = obj[key];
            }
            inherits(newCtor, Component);
            obj = newCtor;
        } else if (!obj) {
            obj = Component;
        }
        return obj as (new () => Component);
    }
}

// TODO export as IGrimoireInterface
export default new GrimoireInterfaceImpl();
