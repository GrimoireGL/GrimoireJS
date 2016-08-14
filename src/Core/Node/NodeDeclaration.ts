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


  public createNode(element: Element, isRoot: boolean): GomlNode {
    return new GomlNode(this, element, this.requiredComponents, isRoot);
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