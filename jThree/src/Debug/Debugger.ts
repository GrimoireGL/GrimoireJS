import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import DebuggerModuleBase = require("./Modules/DebuggerModuleBase");
import SceneStructureDebugger = require("./Modules/SceneStructureDebugger");
import GLSpecDebugger = require("./Modules/GLSpecDebugger");
import RendererDebugger = require("./Modules/RendererDebugger");
import DebuggerAPI = require("./DebuggerAPI");
class Debugger implements IContextComponent {
  public getContextComponentIndex() {
    return ContextComponents.Debugger;
  }

  private debuggerModules: DebuggerModuleBase[] = [new SceneStructureDebugger(), new GLSpecDebugger(), new RendererDebugger()];

  public debuggerAPI: DebuggerAPI;

  constructor() {
    this.debuggerAPI = (<any>window).j3d;
    if (!this.debuggerAPI) {
      console.warn("Debugger API was not found! Did you surely import j3d.js?\nDebugger will not be attached.")
    }
  }

  public attach(): void {
    if (this.debuggerAPI) {
      this.debuggerModules.forEach(m=> m.attach(this))
      console.warn("Debugger API was attached.");
    };
  }

  public setInfo(key: string, val: any) {
    if (typeof val === 'object') {
      var stringfied = "";
      for (var k in val) {
        var v = val[k];
        stringfied += `${k}:${v}<br/>`;
      }
      val = stringfied;
    }
    this.debuggerAPI.info.setInfo(key, val);
  }
}

export = Debugger;
