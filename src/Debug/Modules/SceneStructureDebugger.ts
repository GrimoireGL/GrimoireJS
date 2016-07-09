import DebuggerModuleBase from "./DebuggerModuleBase";
import Debugger from "../Debugger";
import SceneManager from "../../Core/SceneManager";
import ContextComponents from "../../ContextComponents";
import Context from "../../Context";

class SceneStructureDebugger extends DebuggerModuleBase {
  public attach(debug: Debugger): void {
    Context.getContextComponent<SceneManager>(ContextComponents.SceneManager).on("change", (v) => {
      if (v.isAdditionalChange) {
        // If scene was added
        v.changedScene.on("structure-changed", () => {
          debug.debuggerAPI.scenes.setScene(v.changedScene.ID, v.changedScene);
        });
      } else {
        // If scene was deleted
      }
    });
  }
}

export default SceneStructureDebugger;
