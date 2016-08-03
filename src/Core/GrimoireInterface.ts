import IGomlInterface from "./Interface/IGomlInterface";
import GomlNode from "./Node/GomlNode";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import Component from "./Node/Component";
import IAttributeDeclaration from "./Node/IAttributeDeclaration";
import AttributeConverter from "./Node/AttributeConverter";
import NamespacedSet from "./Base/NamespacedSet";
import Constants from "./Base/Constants";

import NodeDeclaration from "./Node/NodeDeclaration";
import NamespacedIdentity from "./Base/NamespacedIdentity";
import GomlInterface from "./Interface/GomlInterface";
import NamespacedDictionary from "./Base/NamespacedDictionary";
import Ensure from "./Base/Ensure";
import IDOBject from "./Base/IDObject";
import {inherits} from "util";

interface IGrimoireInterfaceBase {
    nodeDeclarations: NamespacedDictionary<NodeDeclaration>;
    converters: NamespacedDictionary<AttributeConverter>;
    loadTasks: (() => Promise<void>)[];
    componentDeclarations: NamespacedDictionary<ComponentDeclaration>;
    ns(ns: string): (name: string) => NamespacedIdentity;
    register(loadTask: () => Promise<void>): void;
    resolvePlugins(): Promise<void>;
    addRootNode(tag: HTMLScriptElement, node: GomlNode): string;
    registerConverter(name: string | NamespacedIdentity, converter: (any) => any): void;
    registerComponent(name: string | NamespacedIdentity, attributes: { [name: string]: IAttributeDeclaration }, obj: Object | (new () => Component)): void;
    registerNode(name: string | NamespacedIdentity,
        requiredComponents: (string | NamespacedIdentity)[],
        defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
        superNode?: string | NamespacedIdentity): void;
}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): IGomlInterface;
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

    /**
     * Register plugins
     * @param  {(}      loadTask [description]
     * @return {[type]}          [description]
     */
    public register(loadTask: () => Promise<void>): void {
        this.loadTasks.push(loadTask);
    }

    public async resolvePlugins(): Promise<void> {
        for (let i = 0; i < this.loadTasks.length; i++) {
            await this.loadTasks[i]();
        }
    }

    // TODO test
    /**
     * register custom component
     * @param  {string                |   NamespacedIdentity} name          [description]
     * @param  {IAttributeDeclaration }} attributes           [description]
     * @param  {Object                |   (new                 (}           obj           [description]
     * @return {[type]}                       [description]
     */
    public registerComponent(name: string | NamespacedIdentity, attributes: { [name: string]: IAttributeDeclaration }, obj: Object | (new () => Component)): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        obj = this._ensureTobeComponentConstructor(obj);
        this.componentDeclarations.set(name as NamespacedIdentity, new ComponentDeclaration(name as NamespacedIdentity, attributes, obj as (new () => Component)));
    }

    public registerNode(name: string | NamespacedIdentity,
        requiredComponents: (string | NamespacedIdentity)[],
        defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
        superNode?: string | NamespacedIdentity): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        requiredComponents = Ensure.ensureTobeNamespacedIdentityArray(requiredComponents);
        defaultValues = Ensure.ensureTobeNamespacedDictionary<any>(defaultValues, (name as NamespacedIdentity).ns);
        superNode = Ensure.ensureTobeNamespacedIdentity(superNode);
        this.nodeDeclarations.set(name as NamespacedIdentity,
            new NodeDeclaration(name as NamespacedIdentity,
                NamespacedSet.fromArray(requiredComponents as NamespacedIdentity[]),
                defaultValues as NamespacedDictionary<any>,
                superNode as NamespacedIdentity)
        );
    }

    public registerConverter(name: string | NamespacedIdentity, converter: (any) => any): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        this.converters.set(name as NamespacedIdentity, { name: name as NamespacedIdentity, convert: converter });
    }

    public addRootNode(tag: HTMLScriptElement, node: GomlNode): string {
        const id = IDOBject.getUniqueRandom(10);
        tag.setAttributeNS(Constants.defaultNamespace, "rootNodeId", id);
        this.rootNodes[id] = node;
        return id;
    }

    public getRootNode(scriptTag: Element): GomlNode {
        const id = scriptTag.getAttributeNS(Constants.defaultNamespace, "rootNodeId");
        return this.rootNodes[id];
    }

    public queryRootNodes(query: string): GomlNode[] {
        const scriptTags = document.querySelectorAll(query);
        const nodes: GomlNode[] = [];
        for (let i = 0; i < scriptTags.length; i++) {
            const node = this.getRootNode(scriptTags.item(i));
            if (node) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    /**
     * This method is not for users.
     * Just for unit testing.
     *
     * Clear all configuration that GrimoireInterface contain.
     */
    public clear(): void {
        this.nodeDeclarations = new NamespacedDictionary<NodeDeclaration>();
        this.componentDeclarations = new NamespacedDictionary<ComponentDeclaration>();
        this.converters = new NamespacedDictionary<AttributeConverter>();
        this.rootNodes = {};
        this.loadTasks = [];
    }

    /**
     * Ensure the given object or constructor to be an constructor inherits Component;
     * @param  {Object | (new ()=> Component} obj [The variable need to be ensured.]
     * @return {[type]}      [The constructor inherits Component]
     */
    private _ensureTobeComponentConstructor(obj: Object | (new () => Component)): new () => Component {
        if (typeof obj === "function") {
            if (!((obj as Function).prototype instanceof Component) && (obj as Function) !== Component) {
                throw new Error("Component constructor must extends Component class.");
            }
        } else if (typeof obj === "object") {
            const newCtor = () => { return; };
            inherits(newCtor, Component);
            for (let key in obj) {
                (newCtor as Function).prototype[key] = obj[key];
            }
            obj = newCtor;
        } else if (!obj) {
            obj = Component;
        }
        return obj as (new () => Component);
    }
}

const obtainGomlInterface = function(query: string): IGomlInterface {
    const context = new GomlInterface(this.queryRootNodes(query));
    const queryFunc = (query: string) => {
    };
    Object.setPrototypeOf(queryFunc, context);
    return (queryFunc.bind(context)) as IGomlInterface;
};
const context = new GrimoireInterfaceImpl();
const bindedFunction = obtainGomlInterface.bind(context);
Object.setPrototypeOf(bindedFunction, context);
// TODO export as IGrimoireInterface
export default bindedFunction as IGrimoireInterface;
