import Constants from "../Tools/Constants";
import GrimoireInterface from "../Core/GrimoireInterface";
import Attribute from "./Attribute";
import NSDictionary from "../Tools/NSDictionary";
import IAttributeDeclaration from "../Interface/IAttributeDeclaration";
import NSIdentity from "../Core/NSIdentity";
import IdResolver from "../Tools/IdResolver";
import Component from "./Component";
import Ensure from "../Tools/Ensure";
import {Ctor, Name, ComponentRegistering} from "../Tools/Types";
import Environment from "./Environment";

export default class ComponentDeclaration {
  public static ctorMap: { ctor: ComponentRegistering<Object | Ctor<Component>>, name: NSIdentity }[] = [];

  public superComponent: Ctor<Component>;
  public ctor: Ctor<Component>;
  public idResolver: IdResolver = new IdResolver();
  public attributes: { [name: string]: IAttributeDeclaration }; // undefined until resolve dependency.

  private _resolvedDependency = false;
  private _super?: Name;

  public get isDependenyResolved() {
    return this._resolvedDependency;
  }

  public constructor(
    public name: NSIdentity,
    private _ctorOrObj: ComponentRegistering<Object | Ctor<Component>>,
    _super?: Name | Ctor<Component>) {
    if (!_super) {// no inherits.
      this.resolveDependency();
      return;
    }
    if (_super instanceof NSIdentity || typeof _super === "string") {
      this._super = _super;
    } else {
      this.superComponent = _super;
    }
  }

  public generateInstance(componentElement?: Element): Component { // TODO: obsolete.make all operation on gomlnode
    if (!this.isDependenyResolved) {
      this.resolveDependency();
    }
    componentElement = componentElement ? componentElement : Environment.document.createElementNS(this.name.ns.qualifiedName, this.name.name);
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
    const attr: { [name: string]: IAttributeDeclaration } = {};
    let dec;
    if (this._super || this.superComponent) { // inherits
      const id = this._super ? Ensure.tobeNSIdentity(this._super) : this.superComponent["name"];
      dec = GrimoireInterface.componentDeclarations.get(id);
      dec.resolveDependency();
      for (let key in dec.attributes) {
        attr[key] = dec.attributes[key];
        this.idResolver.add(NSIdentity.fromFQN(this.name.fqn + "." + key));
      }
      this.superComponent = dec.ctor;
    }
    this.ctor = this._ensureTobeComponentConstructor(this.name, this._ctorOrObj, dec ? dec.ctor : void 0);
    for (let key in (this.ctor as any).attributes) {
      attr[key] = (this.ctor as any).attributes[key];
      this.idResolver.add(NSIdentity.fromFQN(this.name.fqn + "." + key));
    }
    this.attributes = attr;

    ComponentDeclaration.ctorMap.push({ ctor: this._ctorOrObj, name: this.name });
    return this._resolvedDependency = true;
  }


  /**
   * Ensure the given object or constructor to be an constructor inherits Component;
   * @param  {Object | (new ()=> Component} obj [The variable need to be ensured.]
   * @return {[type]}      [The constructor inherits Component]
   */
  private _ensureTobeComponentConstructor(id: NSIdentity, obj: ComponentRegistering<Object> | ComponentRegistering<Ctor<Component>>, baseConstructor?: Ctor<Component>): Ctor<Component> {
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
      for (let key in attrs[i]) {
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
