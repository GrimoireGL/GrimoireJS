import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeRecipe {
  public name: NamespacedIdentity;
  public inherits: NamespacedIdentity;

  private _requiredComponents: NamespacedSet;
  private _requiredComponentsForChildren: NamespacedSet;
  private _defaultAttributes: NamespacedDictionary<any>;

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

  constructor(name: NamespacedIdentity, requiredComponents: NamespacedIdentity[],
    defaultAttributes: NamespacedDictionary<any>, inherits: NamespacedIdentity, requiredComponentsForChildren: NamespacedIdentity[]) {
    this.name = name;
    this._defaultAttributes = defaultAttributes;
    this.inherits = inherits;
    this._requiredComponents = new NamespacedSet();
    this._requiredComponents.pushArray(requiredComponents);
    this._requiredComponentsForChildren = new NamespacedSet();
    this._requiredComponentsForChildren.pushArray(requiredComponentsForChildren);
    if (!inherits) {
      this._requiredComponentsActual = this._requiredComponents;
      this._requiredComponentsActualForChildren = this._requiredComponentsForChildren;
      this._defaultAttributesActual = this._defaultAttributes;
    }
  }


  public createNode(element: Element, requiredComponentsForChildren: NamespacedIdentity[]): GomlNode {
    let components = this.requiredComponents.clone().pushArray(requiredComponentsForChildren);
    let componentsArray = components.toArray().map((id) => GrimoireInterface.components.get(id).generateInstance());
    let requiredAttrs = componentsArray.map((c) => c.requiredAttributes)
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
    const inherits = GrimoireInterface.objectNodeRecipe.get(this.inherits);
    const inheritedRequiredComponents = inherits.requiredComponents;
    const inheritedRequiredComponentsForChildren = inherits.requiredComponentsForChildren;
    const inheritedDefaultAttribute = inherits.defaultAttributes;
    this._requiredComponentsActual = this._requiredComponents.clone().merge(inheritedRequiredComponents);
    this._requiredComponentsForChildren = this._requiredComponentsForChildren.clone().merge(inheritedRequiredComponentsForChildren);
    this._defaultAttributesActual = this._defaultAttributes.pushDictionary(inheritedDefaultAttribute);
  }

}

export default NodeRecipe;
