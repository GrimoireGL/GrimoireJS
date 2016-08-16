import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeDeclaration {
  private _defaultComponentsActual: NamespacedSet;
  private _defaultAttributesActual: NamespacedDictionary<any>;

  public get defaultComponents(): NamespacedSet {
    if (!this._defaultComponentsActual) {
      this._resolveInherites();
    }
    return this._defaultComponentsActual;
  }

  public get defaultAttributes(): NamespacedDictionary<any> {
    if (!this._defaultAttributesActual) {
      this._resolveInherites();
    }
    return this._defaultAttributesActual;
  }

  constructor(
    public name: NamespacedIdentity,
    private _defaultComponents: NamespacedSet,
    private _defaultAttributes: NamespacedDictionary<any>,
    public inherits: NamespacedIdentity) {

  }


  private _resolveInherites(): void {
    if (!this.inherits) { // not inherit.
      this._defaultComponentsActual = this._defaultComponents;
      this._defaultAttributesActual = this._defaultAttributes;
      return;
    }
    const inherits = GrimoireInterface.nodeDeclarations.get(this.inherits);
    const inheritedDefaultComponents = inherits.defaultComponents;
    const inheritedDefaultAttribute = inherits.defaultAttributes;
    this._defaultComponentsActual = this._defaultComponents.clone().merge(inheritedDefaultComponents);
    this._defaultAttributesActual = this._defaultAttributes.pushDictionary(inheritedDefaultAttribute);
  }

}

export default NodeDeclaration;
