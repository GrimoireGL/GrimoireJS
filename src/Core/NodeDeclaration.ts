import Ensure from "../Tools/Ensure";
import NSDictionary from "../Tools/NSDictionary";
import NSSet from "../Tools/NSSet";
import NSIdentity from "../Core/NSIdentity";
import IdResolver from "../Tools/IdResolver";
import GrimoireInterface from "../Core/GrimoireInterface";
import Constants from "../Tools/Constants";
import { Name } from "../Tools/Types";

export default class NodeDeclaration {
  public defaultComponents: NSSet;
  public defaultAttributes: NSDictionary<any> = new NSDictionary();
  public superNode?: NSIdentity;
  public freezeAttributes: NSSet;
  public idResolver = new IdResolver();

  private _defaultComponentsActual: NSSet;
  private _defaultAttributesActual: NSDictionary<any>;
  private _resolvedDependency = false;


  public get resolvedDependency() {
    return this._resolvedDependency;
  }

  public get defaultComponentsActual(): NSSet {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._defaultComponentsActual;
  }

  public get defaultAttributesActual(): NSDictionary<any> {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._defaultAttributesActual;
  }

  constructor(
    public name: NSIdentity,
    private _defaultComponents: Name[],
    private _defaultAttributes: { [key: string]: any },
    private _superNode?: Name,
    private _freezeAttributes: Name[] = []) {
    if (!this._superNode && this.name.fqn !== Constants.baseNodeName) {
      this._superNode = NSIdentity.fromFQN(Constants.baseNodeName);
    }
    this._freezeAttributes = this._freezeAttributes || [];
  }

  public addDefaultComponent(componentName: Name): void {
    const componentId = Ensure.tobeNSIdentity(componentName);
    this.defaultComponents.push(componentId);
    if (this._defaultComponentsActual) {
      this._defaultComponentsActual.push(componentId);
    }
  }

  /**
   * resolve requiredComponents,superNode,defaults and freezeAttributes,
   * throw error if they have any ambiguity.
   * デフォルトコンポーネント、スーパノード、デフォルト値、フリーズ値の名前解決。曖昧は例外
   */
  public resolveDependency(): boolean {
    if (this._resolvedDependency) {
      return false;
    }
    this.defaultComponents = new NSSet(this._defaultComponents.map(name => Ensure.tobeNSIdentity(name)));

    for (let key in this._defaultAttributes) {
      let value = this._defaultAttributes[key];
      this.defaultAttributes.set(NSIdentity.fromFQN(key), value);
    }
    this.superNode = this._superNode ? Ensure.tobeNSIdentity(this._superNode) : void 0;
    this._resolveInherites();
    this._defaultComponentsActual.forEach(id => {
      const dec = GrimoireInterface.componentDeclarations.get(id);
      dec.idResolver.foreach(fqn => {
        this.idResolver.add(NSIdentity.fromFQN(fqn));
      });
    });
    this.freezeAttributes = new NSSet(this._freezeAttributes.map(name => Ensure.tobeNSIdentity(name)));
    this._resolvedDependency = true;
    return true;
  }


  private _resolveInherites(): void {
    if (!this.superNode) { // not inherit.
      this._defaultComponentsActual = this.defaultComponents;
      this._defaultAttributesActual = this.defaultAttributes;
      return;
    }
    const superNode = GrimoireInterface.nodeDeclarations.get(this.superNode);
    superNode.resolveDependency();
    const inheritedDefaultComponents = superNode.defaultComponentsActual;
    const inheritedDefaultAttribute = superNode.defaultAttributesActual;
    this._defaultComponentsActual = inheritedDefaultComponents.clone().merge(this.defaultComponents);
    this._defaultAttributesActual = inheritedDefaultAttribute.clone().pushDictionary(this.defaultAttributes);
  }
}
