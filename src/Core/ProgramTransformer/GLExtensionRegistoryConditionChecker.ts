import CanvasManager from "../Canvas/CanvasManager";
import IConditionChecker from "./Base/IConditionChecker";

class GLExtensionConditionChecker implements IConditionChecker {
  private _conditionName: string = "gl-extension";
  public async checkCondition(condition: JSON): Promise<boolean> {
    if (condition["type"] === this._conditionName) {
      let extension = condition["extension"];
      let canvas = CanvasManager.canvases[0];
      let extensions = canvas.glExtensionRegistory.extensions;
      if (typeof extensions[extension] === "undefined") {
        throw new Error("undefined glextension");
      }
      if (extensions[extension] !== null) {
        console.log("glex true");
        return true;
      }
    }
      console.log("glex false");
    return false;
  }



}
export default GLExtensionConditionChecker;
