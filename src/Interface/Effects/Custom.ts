import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import EffectArgumentFormatter from "./EffectArgumentFormatter";
import IOption from "./IOption";
import isPlainObject from "lodash.isplainobject";
import IModule from "../../Module/IModule";
import EffectModule from "./EffectModule";
import JThreeContext from "../../JThreeContext";
import ModuleManager from "../../Module/ModuleManager";
import ContextComponents from "../../ContextComponents";
import isUndefined from "lodash.isundefined";

class Custom extends J3ObjectBase {
  public animate(properties: {[key: string]: string}): J3Object;
  public animate(properties: {[key: string]: string}, option: IOption): J3Object;
  public animate(properties: {[key: string]: string}, duration: number): J3Object;
  public animate(properties: {[key: string]: string}, duration: string): J3Object;
  public animate(properties: {[key: string]: string}, complete: () => void): J3Object;
  public animate(properties: {[key: string]: string}, duration: number, complete: () => void): J3Object;
  public animate(properties: {[key: string]: string}, duration: string, complete: () => void): J3Object;
  public animate(properties: {[key: string]: string}, duration: number, easing: string): J3Object;
  public animate(properties: {[key: string]: string}, duration: string, easing: string): J3Object;
  public animate(properties: {[key: string]: string}, duration: number, easing: string, complete: () => void): J3Object;
  public animate(properties: {[key: string]: string}, duration: string, easing: string, complete: () => void): J3Object;
  public animate(properties: {[key: string]: string}, argu0?: any, argu1?: any, argu2?: any): any {
    const option = EffectArgumentFormatter.toOption(argu0, argu1, argu2);
    if (isPlainObject(properties)) {
      const moduleManager = JThreeContext.getContextComponent<ModuleManager>(ContextComponents.ModuleManager);
      const Module: new () => IModule = <any>EffectModule;
      this.__getArray().forEach((node) => {
        const moduleRegistry = moduleManager.addModule(Module);
        const moduleInstance = moduleRegistry.apply(node, properties, option);
        let modules = node.props.getProp<IModule[]>("module");
        if (isUndefined(modules)) {
          modules = [];
        }
        modules.push(moduleInstance);
        node.props.setProp("module", modules);
        moduleInstance.enabled = true;
      });
    } else {
      throw new Error("Argument type is not correct");
    }
  }
}

export default Custom;
