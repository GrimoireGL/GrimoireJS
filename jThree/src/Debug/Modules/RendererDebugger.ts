import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import JThreeContext = require("../../NJThreeContext");
import ContextComponents = require("../../ContextComponents");
import Scene = require("../../Core/Scene");
class RendererDebugger extends DebuggerModuleBase
{
  public attach(debug:Debugger)
  {
    var sm = JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager);
    sm.Scenes.forEach(s=>
    {
      this.attachToScene(s,debug);
    });
    sm.sceneListChanged.addListener((o,h)=>
    {
      if(h.isAdditionalChange)
      {
        this.attachToScene(h.changedScene,debug);
      }else
      {
        //TODO add code for delete
      }
    });
  }

  private attachToScene(scene:Scene,debug:Debugger)
  {
    scene.rendererListChanged.addListener((o,h)=>
    {
      if(h.isAdditionalChange)
      {

      }else
      {
        //TODO add code for delete
      }
    });
  }
}

export = RendererDebugger;
