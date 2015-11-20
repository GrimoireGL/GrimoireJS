import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import JThreeContext = require("../../NJThreeContext");
import ContextComponents = require("../../ContextComponents");
import Scene = require("../../Core/Scene");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Q = require('q');
import Delegate = require('../../Base/Delegates');
class RendererDebugger extends DebuggerModuleBase
{
  private captureStageID:string;

  private captureTexture:string;

  private deffer;

  private generator;

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
    debug.debuggerAPI.renderers.addRenderer(renderer,this);
    renderer.RenderPathExecutor.renderStageCompleted.addListener((o,v)=>
    {
      if(v.completedChain.stage.ID === this.captureStageID)
      {
        if(v.bufferTextures[this.captureTexture] == null)
        {
          console.error('It is not supported to fetch default buffer data.');
          return;
        }
        this.deffer.resolve(v.bufferTextures[this.captureTexture].wrappers[0].generateHtmlImage(this.generator));
        this.captureStageID = null;
      }
    });
  }

  public getTextureHtmlImage(stageID:string,textureArgName:string,generator?:any):Q.IPromise<HTMLImageElement>
  {
    var d = Q.defer<HTMLImageElement>();
    this.captureStageID = stageID;
    this.captureTexture = textureArgName;
    this.deffer = d;
    this.generator = generator;
    return d.promise;
  }
}

export = RendererDebugger;
