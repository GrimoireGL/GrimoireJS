import ContextComponents from "../../ContextComponents";
import CanvasManager from "../Canvas/CanvasManager";
import Context from "../../Context";
import IConditionChecker from "./Base/IConditionChecker";
import Q from "q";

class GLExtensionConditionChecker implements IConditionChecker {
  private _conditionName: string = "gl-extension";
  public checkCondition(condition: JSON): Q.IPromise<boolean> {
    if (condition["type"] === this._conditionName) {
      let extension = condition["extension"];
      let canvasManager = Context.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
      let canvas = canvasManager.canvases[0];
      let extensions = canvas.glExtensionRegistory.extensions;
      if (typeof extensions[extension] === "undefined") {
        throw new Error("undefined glextension");
      }
      if (extensions[extension] !== null) {
        console.log("glex true");
        return Q.when(true);
      }
    }
      console.log("glex false");
    return Q.when(false);
  }



}
export default GLExtensionConditionChecker;
