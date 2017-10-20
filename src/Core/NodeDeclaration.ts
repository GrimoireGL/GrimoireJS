import GrimoireInterface from "../Core/GrimoireInterface";
import Ensure from "../Tools/Ensure";
import IdResolver from "../Tools/IdResolver";
import { Ctor, Name } from "../Tools/Types";
import Component from "./Component";
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
  public requiredComponents: IdentitySet;

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

  private _requiredComponentsActual: IdentitySet;
  private _defaultAttributesActual: IdentityMap<any>;
  private _resolvedDependency = false;

  /**
   * Whether the dependency has already been resolved.
   */
  public get resolvedDependency() {
    return this._resolvedDependency;
  }

  /**
   * get required components with inheritance in mind.
   */
  public get requiredComponentsActual(): IdentitySet {
    if (!this._resolvedDependency) {
      throw new Error(`${this.name.fqn} is not resolved dependency!`);
    }
    return this._requiredComponentsActual;
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
    private _requiredComponents: (Name | Ctor<Component>)[],
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
    this.requiredComponents.push(componentId);
    if (this._requiredComponentsActual) {
      this._requiredComponentsActual.push(componentId);
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
    this.requiredComponents = new IdentitySet(this._requiredComponents.map(name => Ensure.tobeComponentIdentity(name)));

    for (const key in this._defaultAttributes) {
      const value = this._defaultAttributes[key];
      this.defaultAttributes.set(Identity.fromFQN(key), value);
    }
    this.superNode = this._superNode ? Ensure.tobeNSIdentity(this._superNode) : undefined;
    this._resolveInherites();
    this._requiredComponentsActual.forEach(id => {
      const dec = GrimoireInterface.componentDeclarations.get(id);
      if (!dec) {
        throw new Error(`require component ${id} has not registerd. this node is ${this.name}.`);
      }
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
      this._requiredComponentsActual = this.requiredComponents;
      this._defaultAttributesActual = this.defaultAttributes;
      return;
    }
    const superNode = GrimoireInterface.nodeDeclarations.get(this.superNode);
    if (!superNode) {
      throw new Error(`In node '${this.name.fqn}': super node ${this.superNode.fqn} is not found when resolving inherits, it has registerd correctry?`);
    }
    superNode.resolveDependency();
    const inheritedDefaultComponents = superNode.requiredComponentsActual;
    const inheritedDefaultAttribute = superNode.defaultAttributesActual;
    this._requiredComponentsActual = inheritedDefaultComponents.clone().merge(this.requiredComponents);
    this._defaultAttributesActual = inheritedDefaultAttribute.clone().pushDictionary(this.defaultAttributes);
  }
}
