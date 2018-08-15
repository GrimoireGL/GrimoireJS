import Environment from "../Core/Environment";
import { IAttributeDeclaration } from "../Interface/IAttributeDeclaration";
import Ensure from "../Tool/Ensure";
import IdResolver from "../Tool/IdResolver";
import { ComponentIdentifier, ComponentRegistering, Ctor } from "../Tool/Types";
import {StandardAttribute} from "./Attribute";
import Component from "./Component";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";

/**
 * Declaration of component.
 * manage inherits, dependency resolving.
 */
export default class ComponentDeclaration {

  /**
   * Internal use!
   */
  public static ctorMap: { ctor: ComponentRegistering<Object | Ctor<Component>>, name: Identity }[] = [];

  /**
   * clear constructor map
   */
  public static clear() {
    ComponentDeclaration.ctorMap = [];
  }

  /**
   * super component constructor.
   */
  public superComponent!: Ctor<Component>;

  /**
   * generated constructor considering inheritance.
   */
  public ctor!: Ctor<Component>;

  /**
   * Internal use!
   */
  public idResolver: IdResolver = new IdResolver();

  /**
   * default attributes.
   */
  public attributes!: { [name: string]: IAttributeDeclaration }; // undefined until resolve dependency.

  private _resolvedDependency = false;

  /**
   * whether dependencies has already resolved.
   */
  public get isDependenyResolved() {
    return this._resolvedDependency;
  }

  public constructor(
    public name: Identity,
    private _ctorOrObj: ComponentRegistering<Object | Ctor<Component>>,
    private _super?: ComponentIdentifier) {
    if (!_super) {// if no inherits, then resolve immediately.
      this.resolveDependency();
    }
  }

  /**
   * Internal use!
   * generate component instance.
   * @param componentElement
   */
  public generateInstance(): Component {
    if (!this.isDependenyResolved) {
      this.resolveDependency();
    }
    const component = new this.ctor();
    Environment.GrimoireInterface.componentDictionary[component.id] = component;
    component.name = this.name;
    component.attributes = new IdentityMap<StandardAttribute>();
    component.declaration = this;
    for (const key in this.attributes) {
      StandardAttribute.generateAttributeForComponent<any>(key, this.attributes[key], component);
    }

    // bind this for message reciever.
    let propNames: string[] = [];
    let o = component;
    while (o) {
      propNames = propNames.concat(Object.getOwnPropertyNames(o));
      o = Object.getPrototypeOf(o);
    }
    propNames.filter(name => name.startsWith("$") && typeof (component as any)[name] === "function").forEach(method => {
      (component as any)["$" + method] = (component as any)[method].bind(component);
    });
    return component;
  }

  /**
   * resolve dependency: inherits and default attributes.
   */
  public resolveDependency(): boolean {
    if (this._resolvedDependency) {
      return false;
    }
    const attr: { [name: string]: IAttributeDeclaration } = {};
    let superDec;
    if (this._super && !this.superComponent) { // unresolve inherits
      const id = Ensure.tobeComponentIdentity(this._super);
      superDec = Environment.GrimoireInterface.componentDeclarations.get(id);
      superDec.resolveDependency();
      for (const key in superDec.attributes) {
        attr[key] = superDec.attributes[key];
        this.idResolver.add(Identity.fromFQN(`${this.name.fqn}.${key}`));
      }
      this.superComponent = superDec.ctor;
    }
    this.ctor = this._ensureTobeComponentConstructor(this.name, this._ctorOrObj, superDec ? superDec.ctor : undefined);
    for (const key in (this.ctor as any).attributes) {
      attr[key] = (this.ctor as any).attributes[key];
      this.idResolver.add(Identity.fromFQN(`${this.name.fqn}.${key}`));
    }
    this.attributes = attr;

    ComponentDeclaration.ctorMap.push({ ctor: this._ctorOrObj, name: this.name });
    return this._resolvedDependency = true;
  }

  /**
   * Ensure the given object or constructor to be an constructor inherits Component;
   * @param id
   * @param obj
   * @param baseConstructor
   */
  private _ensureTobeComponentConstructor(
    id: Identity,
    obj: ComponentRegistering<Object | Ctor<Component>>,
    baseConstructor?: Ctor<Component>,
  ): Ctor<Component> {
    if (typeof obj === "function") { // obj is constructor
      const inheritsAttr = this._extractInheritsAttributes(obj);
      if (baseConstructor) { // inherits
        const newCtor = function(this: any) {
          baseConstructor.call(this);
          obj.call(this);
        };
        const proto = this._clonePrototypeChain(obj.prototype, baseConstructor.prototype);
        newCtor.prototype = proto;
        newCtor.prototype["name"] = id;
        (newCtor as any).attributes = inheritsAttr;
        return newCtor as any as Ctor<Component>;
      } else {
        obj.prototype["name"] = id;
        obj.attributes = inheritsAttr;
        return obj;
      }
    } else {
      if (baseConstructor && !(baseConstructor.prototype instanceof Component) && baseConstructor !== Component) {
        throw new Error("Base component comstructor must extends Compoent class.");
      }
      const ctor = baseConstructor || Component;
      const newCtor = function(this: any) {
        ctor.call(this);
      };
      (obj as any).__proto__ = ctor.prototype;

      newCtor.prototype = obj;
      (newCtor as any).attributes = obj.attributes;

      newCtor.prototype["name"] = id;
      return newCtor as any as Ctor<Component>;
    }
  }

  private _extractInheritsAttributes(ctor: Ctor<Component>): { [key: string]: IAttributeDeclaration } {
    type D = { [key: string]: IAttributeDeclaration };
    const attrs: D[] = [];
    while (ctor) {
      if (ctor === Component) {
        break;
      }
      attrs.push((ctor as any).attributes as D);
      ctor = ctor.prototype.__proto__.constructor;
    }
    const atr: D = {};
    for (let i = attrs.length - 1; i >= 0; i--) {
      for (const key in attrs[i]) {
        atr[key] = attrs[i][key];
      }
    }
    return atr;
  }

  private _clonePrototypeChain(obj: Object, base: Object): any {
    const chain = [];
    let c = obj;
    while (true) {
      if (c.constructor === Component) {
        break;
      }
      chain.push(c);
      c = Object.getPrototypeOf(c);
    }
    chain.reverse();
    chain.pop();

    let ret = base;
    for (let i = 0; i < chain.length; i++) {
      const props = (Object as any).getOwnPropertyDescriptors(chain[0]);
      ret = Object.create(ret, props);
    }
    (obj as any).__proto__ = ret;
    return obj;
  }
}
