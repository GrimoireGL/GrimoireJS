import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";
class NodeRecipe {
    private static _resolveRequiredComponents(node: NodeRecipe): NamespacedSet {
        let set = node.inherits ? NodeRecipe._resolveRequiredComponents(GrimoireInterface.objectNodeRecipe.get(node.inherits)) : new NamespacedSet();
        set.pushArray(node.requiredComponents);
        return set;
    }

    private static _resolveDefaultAttributes(node: NodeRecipe): NamespacedDictionary<any> {
        let dict = node.inherits ? NodeRecipe._resolveDefaultAttributes(GrimoireInterface.objectNodeRecipe.get(node.inherits)) : new NamespacedDictionary<any>();
        // TODO
        return dict;
    }

    private _requiredComponentsActual: NamespacedSet;

    constructor(public name: NamespacedIdentity, public requiredComponents: NamespacedIdentity[],
        public defaultAttributes: NamespacedDictionary<any>, public inherits: NamespacedIdentity, public requiredComponentsForChildren: NamespacedIdentity[]) {
    }

    public createNode(requiredComponentsForChildren: NamespacedIdentity[]): GomlNode {
        if (!this._requiredComponentsActual) {
            this._requiredComponentsActual = NodeRecipe._resolveRequiredComponents(this);
        }
        let components = this._requiredComponentsActual.clone().pushArray(requiredComponentsForChildren);
        //let components = requiredComponents.map((name) => configurator.getComponent(name));
        // let requiredAttrs = components.map((c) => c.RequiredAttributes);
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
        // return new GomlNode(this, components, attributesDict);
        return null;
    }
}

export default NodeRecipe;
