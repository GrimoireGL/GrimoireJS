import IContextComponent from "../IContextComponent";
import ContextComponents from "../ContextComponents";
import DebuggerModuleBase from "./Modules/DebuggerModuleBase";
import SceneStructureDebugger from "./Modules/SceneStructureDebugger";
import GLSpecDebugger from "./Modules/GLSpecDebugger";
import RendererDebugger from "./Modules/RendererDebugger";
import DebuggerAPI from "./DebuggerAPI";
class Debugger implements IContextComponent {
  public debuggerAPI: DebuggerAPI;

  private debuggerModules: DebuggerModuleBase[] = [new SceneStructureDebugger(), new GLSpecDebugger(), new RendererDebugger()];


  constructor() {
    this.debuggerAPI = (<any>window).j3d;
    if (!this.debuggerAPI) {
      console.warn("Debugger API was not found! Did you surely import j3d.js?\nDebugger will not be attached.");
    }
  }

  public getContextComponentIndex() {
    return ContextComponents.Debugger;
  }

  public attach(): void {
    if (this.debuggerAPI) {
      this.debuggerModules.forEach(m => m.attach(this));
      console.info("Debugger API was attached.");
    };
  }

  public setInfo(key: string, val: any) {
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
