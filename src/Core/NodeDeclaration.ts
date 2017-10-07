import Ensure from "../Tools/Ensure";
import IdentityMap from "./IdentityMap";
import IdentitySet from "./IdentitySet";
import Identity from "./Identity";
import IdResolver from "../Tools/IdResolver";
import GrimoireInterface from "../Core/GrimoireInterface";
import Constants from "./Constants";
import { Name } from "../Tools/Types";

export default class NodeDeclaration {
  public defaultComponents: IdentitySet;
  public defaultAttributes: IdentityMap<any> = new IdentityMap();
  public superNode?: Identity;
  public freezeAttributes: IdentitySet;
  public idResolver = new IdResolver();

  private _defaultComponentsActual: IdentitySet;
  private _defaultAttributesActual: IdentityMap<any>;
  private _resolvedDependency = false;


  public get resolvedDependency() {
    return this._resolvedDependency;
  }

  public get defaultComponentsActual(): IdentitySet {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._defaultComponentsActual;
  }

  public get defaultAttributesActual(): IdentityMap<any> {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._defaultAttributesActual;
  }

  constructor(
    public name: Identity,
    private _defaultComponents: Name[],
    private _defaultAttributes: { [key: string]: any },
    private _superNode?: Name,
    private _freezeAttributes: Name[] = []) {
    if (!this._superNode && this.name.fqn !== Constants.baseNodeName) {
      this._superNode = Identity.fromFQN(Constants.baseNodeName);
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
    this.defaultComponents = new IdentitySet(this._defaultComponents.map(name => Ensure.tobeNSIdentity(name)));

    for (let key in this._defaultAttributes) {
      let value = this._defaultAttributes[key];
      this.defaultAttributes.set(Identity.fromFQN(key), value);
    }
    this.superNode = this._superNode ? Ensure.tobeNSIdentity(this._superNode) : void 0;
    this._resolveInherites();
    this._defaultComponentsActual.forEach(id => {
      const dec = GrimoireInterface.componentDeclarations.get(id);
      dec.idResolver.foreach(fqn => {
        this.idResolver.add(Identity.fromFQN(fqn));
      });
    });
    this.freezeAttributes = new IdentitySet(this._freezeAttributes.map(name => Ensure.tobeNSIdentity(name)));
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
