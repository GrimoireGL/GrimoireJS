import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import SceneUtilities from "../Static/SceneUtilities";
// import EffectArgumentFormatter from "./EffectArgumentFormatter";
import IOption from "./IOption";
import isUndefined from "lodash.isundefined";

class Basic extends J3ObjectBase {
  public show(): J3Object;
  public show(option: IOption): J3Object;
  public show(duration: number): J3Object;
  public show(duration: string): J3Object;
  public show(complete: () => void): J3Object;
  public show(duration: number, complete: () => void): J3Object;
  public show(duration: string, complete: () => void): J3Object;
  public show(duration: number, easing: string): J3Object;
  public show(duration: string, easing: string): J3Object;
  public show(duration: number, easing: string, complete: () => void): J3Object;
  public show(duration: string, easing: string, complete: () => void): J3Object;
  public show(argu0?: any, argu1?: any, argu2?: any): any {
    // const option = EffectArgumentFormatter.toOption(argu0, argu1, argu2);
    if (isUndefined(argu0)) {
      SceneUtilities.filterSceneObjectNode(this.__getArray()).forEach((node) => {
        if (node.target) {
          node.target.isVisible = true;
        }
      });
    } else {
      throw new Error("Not implemented yet");
    }
  }

  public hide(): J3Object;
  public hide(option: IOption): J3Object;
  public hide(duration: number): J3Object;
  public hide(duration: string): J3Object;
  public hide(complete: () => void): J3Object;
  public hide(duration: number, complete: () => void): J3Object;
  public hide(duration: string, complete: () => void): J3Object;
  public hide(duration: number, easing: string): J3Object;
  public hide(duration: string, easing: string): J3Object;
  public hide(duration: number, easing: string, complete: () => void): J3Object;
  public hide(duration: string, easing: string, complete: () => void): J3Object;
  public hide(argu0?: any, argu1?: any, argu2?: any): any {
    // const option = EffectArgumentFormatter.toOption(argu0, argu1, argu2);
    if (isUndefined(argu0)) {
      SceneUtilities.filterSceneObjectNode(this.__getArray()).forEach((node) => {
        if (node.target) {
          node.target.isVisible = false;
        }
      });
    } else {
      throw new Error("Not implemented yet");
    }
  }
}

export default Basic;
