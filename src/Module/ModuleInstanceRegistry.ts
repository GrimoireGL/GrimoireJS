import IModule from "./IModule";
import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import isPlainObject from "lodash.isplainobject";
import isFunction from "lodash.isfunction";

/* tslint:disable:public-method-name private-method-name */
class ModuleBuiltinMixin {
  private __registry__: ModuleInstanceRegistry;

  public __init__(registry: ModuleInstanceRegistry): void {
    this.__registry__ = registry;
  }

  public detach(): void {
    this.__registry__.detach();
  }
}
/* tslint:enable:public-method-name */

class ModuleInstanceRegistry {
  private _module: new (...args_: any[]) => IModule;
  private _instance: IModule;
  private _enabled: boolean = false;
  private _node: GomlTreeNodeBase;

  constructor(module: new () => IModule);
  constructor(module: IModule);
  constructor(module: any) {
    let Module: new () => IModule = module;
    if (isPlainObject(module)) {
      Module = <any>function() {
        this.initialize.apply(this, arguments);
      };
      const props = [];
      Object.keys(module).forEach((k) => {
        if (isFunction(module[k]) && k !== "initialize") {
          Module.prototype[k] = module[k];
        } else {
          props.push(k);
        }
      });
      Module.prototype.initialize = function () {
        props.forEach((k) => {
          this[k] = module[k];
        });
        if (module.initialize) {
          module.initialize.apply(this, arguments);
        }
      };
    }
    applyMixins(Module, [ModuleBuiltinMixin]);
    this._module = Module;
  }

  public apply(node: GomlTreeNodeBase, ...args: any[]): IModule {
    this.detach();
    this._instance = new this._module(node, ...args);
    this._instance.__init__(this);
    this._node = node;
    console.log(this._instance);
    return this._instance;
  }

  public detach(): void {
    if (this._instance) {
      if (this._enabled) {
        if (this._instance.terminate) {
          this._instance.terminate(this._node);
        }
      }
      const modules = this._node.props.getProp<IModule[]>("module");
      const index = modules.indexOf(this._instance);
      if (index === -1) {
        throw new Error("detach target module is not found.");
      }
      modules.splice(index, 1);
      this._node.props.setProp("module", modules);
      this._instance = null;
      this._node = null;
      this._enabled = false;
    }
  }

  public update(): void {
    if (!this._instance) {
      return;
    }
    try {
      if (this._instance.enabled && this._node.Mounted) {
        if (!this._enabled) {
          if (this._instance.start) {
            this._instance.start(this._node);
          }
          this._enabled = true;
        }
        if (this._instance.update) {
          this._instance.update(this._node);
        }
      } else {
        if (this._enabled) {
          if (this._instance.terminate) {
            this._instance.terminate(this._node);
          }
          this._enabled = false;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        const descriptor = {
          value: baseCtor.prototype[name],
          enumerable: false,
          configurable: true,
          writable: true,
        };
        Object.defineProperty(derivedCtor.prototype, name, descriptor);
      }
    });
  });
}

export default ModuleInstanceRegistry;
