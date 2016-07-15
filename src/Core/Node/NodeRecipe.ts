import GomlNode from "./GomlNode";
import GomlConfigurator from "./GomlConfigurator";
import NamespacedIdentity from "../Base/NamespacedIdentity";

abstract class NodeRecipe {
    private _name: NamespacedIdentity;
    private _requiredComponents: string[];
    private _requiredComponentsForChildren: string[];
    public DefaultAttributes: { [key: string]: any };

    public constructor(name: NamespacedIdentity, requiredComponents: string[],
        requiredComponentsForChildren: string[], defaultAttributes: { [key: string]: any }) {
        this._name = name;
        this._requiredComponents = requiredComponents;
        this._requiredComponentsForChildren = requiredComponentsForChildren;
        this.DefaultAttributes = defaultAttributes;
    }
    public createNode(inheritedRequiredConponents?: string[]): GomlNode {
        const configurator = GomlConfigurator.Instance;
        let requiredComponents = this._requiredComponents;
        if (inheritedRequiredConponents) {
            requiredComponents = requiredComponents.concat(inheritedRequiredConponents);
            requiredComponents = requiredComponents.filter((x, i, self) => self.indexOf(x) === i); // remove overLap
        }
        let components = requiredComponents.map((name) => configurator.getComponent(name));
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
