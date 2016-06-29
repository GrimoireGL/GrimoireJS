import J3ObjectBase from "../J3ObjectBase";
import IModule from "../../Module/IModule";
import ModuleManager from "../../Module/ModuleManager";
import isUndefined from "lodash.isundefined";
import isPlainObject from "lodash.isplainobject";
import isFunction from "lodash.isfunction";

class Module extends J3ObjectBase {
  public module(): IModule[];
  public module(module: IModule): IModule[];
  public module(module: new () => IModule): IModule[];
  public module(argu?: any): any {
    switch (true) {
      case isUndefined(argu):
        return this.__getArray().map((node) => {
          node.props.getProp<IModule>("module");
        });
      case (isPlainObject(argu) || isFunction(argu)):
        return this.__getArray().map((node) => {
          const moduleRegistry = ModuleManager.addModule(argu);
          const moduleInstance = moduleRegistry.apply(node);
          moduleInstance.enabled = true;
          return moduleInstance;
        });
      default:
        throw new Error("Argument type is not correct");
    }
  }
}

export default Module;
