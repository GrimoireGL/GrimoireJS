import NSDictionary from "../Base/NSDictionary";
import NSSet from "../Base/NSSet";
import GomlNode from "./GomlNode";
import NSIdentity from "../Base/NSIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeDeclaration {
  private _defaultComponentsActual: NSSet;
  private _defaultAttributesActual: NSDictionary<any>;

  public get defaultComponents(): NSSet {
    if (!this._defaultComponentsActual) {
      this._resolveInherites();
    }
    return this._defaultComponentsActual;
  }

  public get defaultAttributes(): NSDictionary<any> {
    if (!this._defaultAttributesActual) {
      this._resolveInherites();
    }
    return this._defaultAttributesActual;
  }
  public get treeConstraints(): ((node: GomlNode) => string)[] {
    return this._treeConstraints;
  }

  constructor(
    public name: NSIdentity,
    private _defaultComponents: NSSet,
    private _defaultAttributes: NSDictionary<any>,
    public inherits: NSIdentity,
    private _treeConstraints?: ((node: GomlNode) => string)[]) {

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
