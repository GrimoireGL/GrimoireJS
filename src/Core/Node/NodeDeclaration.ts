import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeDeclaration {
    private _requiredComponentsActual: NamespacedSet;
    private _requiredComponentsActualForChildren: NamespacedSet;
    private _defaultAttributesActual: NamespacedDictionary<any>;

    public get requiredComponents(): NamespacedSet {
        if (!this._requiredComponentsActual) {
            this._resolveInherites();
        }
        return this._requiredComponentsActual;
    }
    public get requiredComponentsForChildren(): NamespacedSet {
        if (!this._requiredComponentsActualForChildren) {
            this._resolveInherites();
        }
        return this._requiredComponentsActualForChildren;
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
        public inherits: NamespacedIdentity,
        private _requiredComponentsForChildren: NamespacedSet) {

    }


    public createNode(element: Element, requiredComponentsForChildren: NamespacedIdentity[]): GomlNode {
        let components = this.requiredComponents.clone().pushArray(requiredComponentsForChildren);
        let componentsArray = components.toArray().map((id) => GrimoireInterface.componentDeclarations.get(id).generateInstance());
        let requiredAttrs = componentsArray.map((c) => c.attributes.toArray())
            .reduce((pre, current) => pre === undefined ? current : pre.concat(current));
        // let attributes = requiredAttrs.reduce((pre, current) => pre === undefined ? current : pre.concat(current));
        // let attributesDict = {};
        // attributes.forEach((attr) => {
        //   if (attributesDict[attr.Name]) {
        //     attributesDict[attr.Name].push(attr);
        //   } else {
        //     attributesDict[attr.Name] = [attr];
        //   }
        // });
        //
        return new GomlNode(this, element, componentsArray, requiredAttrs);
    }



    private _resolveInherites(): void {
        if (!this.inherits) {
            this._requiredComponentsActual = this._requiredComponents;
            this._requiredComponentsActualForChildren = this._requiredComponentsForChildren;
            this._defaultAttributesActual = this._defaultAttributes;
        }
        const inherits = GrimoireInterface.nodeDeclarations.get(this.inherits);
        const inheritedRequiredComponents = inherits.requiredComponents;
        const inheritedRequiredComponentsForChildren = inherits.requiredComponentsForChildren;
        const inheritedDefaultAttribute = inherits.defaultAttributes;
        this._requiredComponentsActual = this._requiredComponents.clone().merge(inheritedRequiredComponents);
        this._requiredComponentsForChildren = this._requiredComponentsForChildren.clone().merge(inheritedRequiredComponentsForChildren);
        this._defaultAttributesActual = this._defaultAttributes.pushDictionary(inheritedDefaultAttribute);
    }

}

export default NodeDeclaration;
