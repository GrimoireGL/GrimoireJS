import GrimoireInterface from "../Core/GrimoireInterface";
import Ensure from "../Tools/Ensure";
import IdResolver from "../Tools/IdResolver";
import { Name } from "../Tools/Types";
import Constants from "./Constants";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";
import IdentitySet from "./IdentitySet";

/**
 * node declaration for create GomlNode Instance.
 */
export default class NodeDeclaration {

  /**
   * Components attached to this node by default.
   * this property is not consider inheritance.
   */
  public defaultComponents: IdentitySet;

  /**
   * attributes set to this node by default.
   * this property is not consider inheritance.
   */
  public defaultAttributes: IdentityMap<any> = new IdentityMap();

  /**
   * super node id if exists.
   * undefined if this node is not inherits any node.
   */
  public superNode?: Identity;

  /**
   * identity set of freeze attributes.
   */
  public freezeAttributes: IdentitySet;

  /**
   * Internal use!
   */
  public idResolver = new IdResolver();

  private _defaultComponentsActual: IdentitySet;
  private _defaultAttributesActual: IdentityMap<any>;
  private _resolvedDependency = false;

  /**
   * Whether the dependency has already been resolved.
   */
  public get resolvedDependency() {
    return this._resolvedDependency;
  }

  /**
   * get default components with inheritance in mind.
   */
  public get defaultComponentsActual(): IdentitySet {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._defaultComponentsActual;
  }

  /**
   * get default attributes with inheritance in mind.
   */
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

  /**
   * add optional default component.
   * @param componentName
   */
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

    for (const key in this._defaultAttributes) {
      const value = this._defaultAttributes[key];
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
