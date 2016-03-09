import ContextComponents from "../ContextComponents";
import SceneStructureDebugger from "./Modules/SceneStructureDebugger";
import RendererDebugger from "./Modules/RendererDebugger";
class Debugger {
    constructor() {
        this._debuggerModules = [new SceneStructureDebugger(), new RendererDebugger()];
        this.debuggerAPI = window.j3d;
        if (!this.debuggerAPI) {
            console.warn("Debugger API was not found! Did you surely import j3d.js?\nDebugger will not be attached.");
        }
    }
    getContextComponentIndex() {
        return ContextComponents.Debugger;
    }
    attach() {
        if (this.debuggerAPI) {
            this._debuggerModules.forEach(m => m.attach(this));
            console.info("Debugger API was attached.");
        }
        ;
    }
    setInfo(key, val) {
        if (!this.debuggerAPI) {
            return;
        }
        if (typeof val === "object") {
            let stringfied = "";
            for (let k in val) {
                const v = val[k];
                stringfied += `${k}:${v}<br/>`;
            }
            val = stringfied;
        }
        this.debuggerAPI.info.setInfo(key, val);
    }
}
export default Debugger;
