import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import ContextComponents = require("../../ContextComponents");
import JThreeContext = require("../../NJThreeContext");

class SceneStructureDebugger extends DebuggerModuleBase
{
  public attach(debug:Debugger)
  {
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).sceneListChanged.addListener((o,v)=>{
      debug.debuggerAPI.scenes.setScene(v.changedScene.ID);
    });
  }
}

export = SceneStructureDebugger;
