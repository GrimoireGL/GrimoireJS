import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import DebuggerModuleBase = require("./Modules/DebuggerModuleBase");
import SceneStructureDebugger = require("./Modules/SceneStructureDebugger");
import GLSpecDebugger = require("./Modules/GLSpecDebugger");
import RendererDebugger = require("./Modules/RendererDebugger");
import DebuggerAPI = require("./DebuggerAPI");
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

export = Debugger;
