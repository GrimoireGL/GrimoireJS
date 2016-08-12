import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeDeclaration {
    private _requiredComponentsActual: NamespacedSet;
    private _defaultAttributesActual: NamespacedDictionary<any>;

    public get requiredComponents(): NamespacedSet {
        if (!this._requiredComponentsActual) {
            this._resolveInherites();
        }
        return this._requiredComponentsActual;
    }

    public get defaultAttributes(): NamespacedDictionary<any> {
        if (!this._defaultAttributesActual) {
            this._resolveInherites();
        }
        return this._defaultAttributesActual;
    }

    constructor(
        public name: NamespacedIdentity,
        private _requiredComponents: NamespacedSet,
        private _defaultAttributes: NamespacedDictionary<any>,
        public inherits: NamespacedIdentity) {

    }


    public createNode(element: Element): GomlNode {
        let components = this.requiredComponents;
        let componentsArray = components.toArray().map((id) => {
            const declaration = GrimoireInterface.componentDeclarations.get(id);
            if (!declaration) {
                throw new Error(`component '${id.fqn}' is not found.`);
            }
            return declaration.generateInstance(null);
        });

        let requiredAttrs = componentsArray.map((c) => c.attributes.toArray())
            .reduce((pre, current) => pre === undefined ? current : pre.concat(current), []);
        return new GomlNode(this, element, componentsArray, requiredAttrs);
    }



    private _resolveInherites(): void {
        // console.log("resolveInherits");
        if (!this.inherits) {
            // console.log("\tnothing inherits");
            this._requiredComponentsActual = this._requiredComponents;
            this._defaultAttributesActual = this._defaultAttributes;
            return;
        }
        const inherits = GrimoireInterface.nodeDeclarations.get(this.inherits);
        const inheritedRequiredComponents = inherits.requiredComponents;
        const inheritedDefaultAttribute = inherits.defaultAttributes;
        this._requiredComponentsActual = this._requiredComponents.clone().merge(inheritedRequiredComponents);
        this._defaultAttributesActual = this._defaultAttributes.pushDictionary(inheritedDefaultAttribute);
    }

}

export default NodeDeclaration;
