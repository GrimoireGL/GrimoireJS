import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import JThreeContext = require("../../NJThreeContext");
import ContextComponents = require("../../ContextComponents");
import Scene = require("../../Core/Scene");
import RendererBase = require("../../Core/Renderers/RendererBase");
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
    scene.Renderers.forEach(r=>
    {
      this.attachToRenderer(r,debug);
    });
    scene.rendererListChanged.addListener((o,h)=>
    {
      if(h.isAdditionalChange)
      {
        this.attachToRenderer(h.renderer,debug);
      }else
      {
        //TODO add code for delete
      }
    });
  }

  private attachToRenderer(renderer:RendererBase,debug:Debugger)
  {
    debug.debuggerAPI.renderers.addRenderer(renderer);
    renderer.RenderPathExecutor.renderStageCompleted.addListener((o,v)=>
    {
      
    });
  }
}

export = RendererDebugger;
