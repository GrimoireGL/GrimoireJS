import Ensure from "../Base/Ensure";
import NSDictionary from "../Base/NSDictionary";
import NSSet from "../Base/NSSet";
import GomlNode from "./GomlNode";
import NSIdentity from "../Base/NSIdentity";
import GrimoireInterface from "../GrimoireInterface";

class NodeDeclaration {
  private _defaultComponentsActual: NSSet;
  private _defaultAttributesActual: NSDictionary<any>;

  public get defaultComponentsActual(): NSSet {
    if (!this._defaultComponentsActual) {
      this._resolveInherites();
    }
    return this._defaultComponentsActual;
  }

  public get defaultAttributesActual(): NSDictionary<any> {
    if (!this._defaultAttributesActual) {
      this._resolveInherites();
    }
    return this._defaultAttributesActual;
  }

  constructor(
    public name: NSIdentity,
    public defaultComponents: NSSet,
    public defaultAttributes: NSDictionary<any>,
    public superNode: NSIdentity,
    public freezeAttributes: string[]) {
    this.freezeAttributes = this.freezeAttributes ? this.freezeAttributes : [];
    if (!this.superNode && this.name.name !== "grimoire-node-base") {
      this.superNode = NSIdentity.createOnDefaultNS("grimoire-node-base");
    }
  }

  public addDefaultComponent(componentName: string | NSIdentity): void {
    const componentId = Ensure.ensureTobeNSIdentity(componentName);
    this.defaultComponents.push(componentId);
    if (this._defaultComponentsActual) {
      this._defaultComponentsActual.push(componentId);
    }
  }


  private _resolveInherites(): void {
    if (!this.superNode) { // not inherit.
      this._defaultComponentsActual = this.defaultComponents;
      this._defaultAttributesActual = this.defaultAttributes;
      return;
    }
    const superNode = GrimoireInterface.nodeDeclarations.get(this.superNode);
    const inheritedDefaultComponents = superNode.defaultComponentsActual;
    const inheritedDefaultAttribute = superNode.defaultAttributesActual;
    this._defaultComponentsActual = inheritedDefaultComponents.clone().merge(this.defaultComponents);
    this._defaultAttributesActual = inheritedDefaultAttribute.clone().pushDictionary(this.defaultAttributes);
  }

}

export default NodeDeclaration;
