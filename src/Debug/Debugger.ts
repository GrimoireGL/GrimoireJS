import DebuggerModuleBase from "./Modules/DebuggerModuleBase";
import SceneStructureDebugger from "./Modules/SceneStructureDebugger";
// import GLSpecDebugger from "./Modules/GLSpecDebugger";
import RendererDebugger from "./Modules/RendererDebugger";
import DebuggerAPI from "./DebuggerAPI";
class Debugger {
    public static instance: Debugger;
    public debuggerAPI: DebuggerAPI;

    private _debuggerModules: DebuggerModuleBase[] = [new SceneStructureDebugger(), /*new GLSpecDebugger(), */ new RendererDebugger()];


    constructor() {
        this.debuggerAPI = (<any>window).j3d;
        if (!this.debuggerAPI) {
            console.warn("Debugger API was not found! Did you surely import j3d.js?\nDebugger will not be attached.");
        }
    }

    public attach(): void {
        if (this.debuggerAPI) {
            this._debuggerModules.forEach(m => m.attach());
            console.info("Debugger API was attached.");
        };
    }

    public setInfo(key: string, val: any): void {
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
Debugger.instance = new Debugger();
export default Debugger.instance;
