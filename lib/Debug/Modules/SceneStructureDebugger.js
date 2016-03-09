import DebuggerModuleBase from "./DebuggerModuleBase";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class SceneStructureDebugger extends DebuggerModuleBase {
    attach(debug) {
        JThreeContext.getContextComponent(ContextComponents.SceneManager).on("change", (v) => {
            if (v.isAdditionalChange) {
                // If scene was added
                v.changedScene.sceneObjectStructureChanged.addListener((o2, v2) => {
                    debug.debuggerAPI.scenes.setScene(v.changedScene.ID, v.changedScene);
                });
            }
            else {
            }
        });
    }
}
export default SceneStructureDebugger;
