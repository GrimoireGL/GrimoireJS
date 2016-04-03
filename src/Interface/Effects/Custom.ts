import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import EffectUtilities from "./EffectUtilities";
import IOptionUser from "./IOptionUser";
import isPlainObject from "lodash.isplainobject";
// import IModule from "../../Module/IModule";
// import EffectModule from "./EffectModule";
// import JThreeContext from "../../JThreeContext";
// import ModuleManager from "../../Module/ModuleManager";
// import ContextComponents from "../../ContextComponents";
import EffectExecutor from "./EffectExecutor";

class Custom extends J3ObjectBase {
  public animate(properties: {[key: string]: string}): J3Object;
  public animate(properties: {[key: string]: string}, option: IOptionUser): J3Object;
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
    const option = EffectUtilities.toOption(argu0, argu1, argu2);
    if (isPlainObject(properties)) {
      // const moduleManager = JThreeContext.getContextComponent<ModuleManager>(ContextComponents.ModuleManager);
      // const Module: new () => IModule = <any>EffectModule;
      this.__getArray().forEach((node) => {
        // const moduleRegistry = moduleManager.addModule(Module);
        // const moduleInstance = moduleRegistry.apply(node, properties, option);
        // moduleInstance.enabled = true;
        let effectExecutor = node.props.getProp<EffectExecutor>("ee");
        if (!effectExecutor) {
          effectExecutor = new EffectExecutor(node);
          node.props.setProp("ee", effectExecutor);
        }
        effectExecutor.add(properties, option);
      });
    } else {
      throw new Error("Argument type is not correct");
    }
    return this;
  }
}

export default Custom;
