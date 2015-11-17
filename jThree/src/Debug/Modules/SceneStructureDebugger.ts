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
      if(v.isAdditionalChange){
        //If scene was added
        var scenesAPI = debug.debuggerAPI.scenes.setScene(v.changedScene.ID,v.changedScene);
        v.changedScene.sceneObjectStructureChanged.addListener((o2,v2)=>
        {

        });
      }else
      {
        //If scene was deleted
      }
    });
  }
}

export = SceneStructureDebugger;
