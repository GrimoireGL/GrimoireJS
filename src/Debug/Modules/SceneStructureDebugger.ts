import DebuggerModuleBase from "./DebuggerModuleBase";
import Debugger from "../Debugger";
import SceneManager from "../../Core/SceneManager";

class SceneStructureDebugger extends DebuggerModuleBase {
  public attach(): void {
    SceneManager.on("change", (v) => {
      if (v.isAdditionalChange) {
        // If scene was added
        v.changedScene.on("structure-changed", () => {
          Debugger.debuggerAPI.scenes.setScene(v.changedScene.ID, v.changedScene);
        });
      } else {
        // If scene was deleted
      }
    });
  }
}

export default SceneStructureDebugger;
