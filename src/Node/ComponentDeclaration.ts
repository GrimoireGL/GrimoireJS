import Constants from "../Base/Constants";
import GrimoireInterface from "../Interface/GrimoireInterface";
import Attribute from "./Attribute";
import NSDictionary from "../Base/NSDictionary";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NSIdentity from "../Base/NSIdentity";
import IdResolver from "../Base/IdResolver";
import Component from "./Component";
import Ensure from "../Base/Ensure";
import {Ctor, Name} from "../Base/Types";

export default class ComponentDeclaration {
  public static ctorMap: { ctor: Ctor<Component>, name: NSIdentity }[] = [];

  public superComponent: Ctor<Component>;
  public ctor: Ctor<Component>;
  public idResolver: IdResolver = new IdResolver();

  private _resolvedDependency = false;
  private _super?: Name;

  public get resolvedDependency() {
    return this._resolvedDependency;
  }

  public constructor(
    public name: NSIdentity,
    public attributes: { [name: string]: IAttributeDeclaration },
    private _ctorOrObj: Object | Ctor<Component>,
    _super?: Name | Ctor<Component>) {
    if (!_super) {// no inherits.
      this.ctor = this._ensureTobeComponentConstructor(this.name, _ctorOrObj);
      ComponentDeclaration.ctorMap.push({ ctor: this.ctor, name: name });
      for (let key in this.attributes) {
        this.idResolver.add(NSIdentity.fromFQN(this.name.fqn + "." + key));
      }
      this._resolvedDependency = true;
      return;
    }
    if (_super instanceof NSIdentity || typeof _super === "string") {
      this._super = _super;
    } else {
      this.superComponent = _super;
    }

  }

  public generateInstance(componentElement?: Element): Component { // TODO: obsolete.make all operation on gomlnode
    if (!this.resolvedDependency) {
      this.resolveDependency();
    }
    componentElement = componentElement ? componentElement : document.createElementNS(this.name.ns.qualifiedName, this.name.name);
    const component = new this.ctor();
    componentElement.setAttribute(Constants.x_gr_id, component.id);
    GrimoireInterface.componentDictionary[component.id] = component;
    component.name = this.name;
    component.element = componentElement;
    component.attributes = new NSDictionary<Attribute>();
    for (let key in this.attributes) {
      Attribute.generateAttributeForComponent(key, this.attributes[key], component);
    }
    return component;
  }

  public resolveDependency(): boolean {
    if (this._resolvedDependency) {
      return false;
    }
    if (!this._super && !this.superComponent) { // no inherits.
      return this._resolvedDependency = true;
    }
    const id = this._super ? Ensure.tobeNSIdentity(this._super) : this.superComponent["name"];
    const dec = GrimoireInterface.componentDeclarations.get(id);
    dec.resolveDependency();
    const attr: { [name: string]: IAttributeDeclaration } = {};
    for (let key in dec.attributes) {
      attr[key] = dec.attributes[key];
      this.idResolver.add(NSIdentity.fromFQN(this.name.fqn + "." + key));
    }
    for (let key in this.attributes) {
      attr[key] = this.attributes[key];
      this.idResolver.add(NSIdentity.fromFQN(this.name.fqn + "." + key));
    }
    this.attributes = attr;
    this.superComponent = dec.ctor;
    this.ctor = this._ensureTobeComponentConstructor(this.name, this._ctorOrObj, dec.ctor);
    return this._resolvedDependency = true;
  }


  /**
   * Ensure the given object or constructor to be an constructor inherits Component;
   * @param  {Object | (new ()=> Component} obj [The variable need to be ensured.]
   * @return {[type]}      [The constructor inherits Component]
   */
  private _ensureTobeComponentConstructor(id: NSIdentity, obj: Object | Ctor<Component>, baseConstructor?: Ctor<Component>): Ctor<Component> {
    if (typeof obj === "function") {
      if (baseConstructor) { // inherits
        (obj as Function).prototype = Object.create((baseConstructor as Function).prototype, { value: { constructor: obj } });
      }
      if (!((obj as Function).prototype instanceof Component) && (obj as Function) !== Component) {
        throw new Error("Component constructor must extends Component class.");
      }
      obj.prototype["name"] = id;
      return obj;
    } else {
      if (baseConstructor && !((baseConstructor as Function).prototype instanceof Component) && (baseConstructor as Function) !== Component) {
        throw new Error("Base component comstructor must extends Compoent class.");
      }
      const ctor = baseConstructor || Component;
      const newCtor = function(this: any) {
        ctor.call(this);
      };
      (obj as any).__proto__ = ctor.prototype;

      newCtor.prototype = obj;
      Object.defineProperty(newCtor.prototype, "attributes", {
        value: this.attributes
      });

      newCtor.prototype["name"] = id;
      return newCtor as any as Ctor<Component>;
    }
  }
}
