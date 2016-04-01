import IConditionChecker from "./Base/IConditionChecker";

class GLExtensionConditionChecker implements IConditionChecker {
  private _glExtensions: string[];
  private _conditionName: string = "GLExtenstion";
  constructor(glExtensions: string[]) {
    this._glExtensions = glExtensions;
  }
  public checkCondition(condition: JSON): Q.IPromise<boolean> {
    if (condition["type"] === this._conditionName) {
      let extension = condition["extension"];
      if (this._glExtensions.some((elem) => extension === elem)) {
        return Q.when(true);
      }
    }
    return Q.when(false);
  }



}
export default GLExtensionConditionChecker;
