import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import JThreeContext = require("../../NJThreeContext");
import ContextComponents = require("../../ContextComponents");
import Scene = require("../../Core/Scene");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Q = require('q');
import Delegate = require('../../Base/Delegates');
import Canvas = require("../../Core/Canvas");
import IRequestBufferTexture = require("./Renderer/IRequestBufferTexture");
import IRequestShadowMapTexture = require('./Renderer/IRequestShadowMapTexture');
class RendererDebugger extends DebuggerModuleBase
{
  private bufferTextureRequest:IRequestBufferTexture;

  private shadowMapRequest:IRequestShadowMapTexture;

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
      if(this.bufferTextureRequest && v.completedChain.stage.ID === this.bufferTextureRequest.stageID)
      {
        if(v.bufferTextures[this.bufferTextureRequest.bufferTextureID] == null)
        {
          var canvas = <Canvas>v.owner.renderer.ContextManager;
          var img = new Image(canvas.canvasElement.width,canvas.canvasElement.height);
          img.src = canvas.canvasElement.toDataURL();
          this.bufferTextureRequest.deffered.resolve(img);
          this.bufferTextureRequest = null;
          return;
        }
        this.bufferTextureRequest.deffered.resolve(v.bufferTextures[this.bufferTextureRequest.bufferTextureID].wrappers[0].generateHtmlImage(this.bufferTextureRequest.generator));
        this.bufferTextureRequest = null;
      }
    });
    renderer.RenderPathExecutor.renderPathCompleted.addListener((o,v)=>
    {
      if(this.shadowMapRequest && v.owner.renderer.ID === this.shadowMapRequest.rendererID)
      {
        this.shadowMapRequest.deffered.resolve(v.scene.LightRegister.shadowMapResourceManager.shadowMapTileTexture.wrappers[0].generateHtmlImage(this.shadowMapRequest.generator));
        this.shadowMapRequest = null;
      }
    });
  }

  public getShadowMapImage(rendererID:string,generator?:any):Q.IPromise<HTMLImageElement>
  {
    var d = Q.defer<HTMLImageElement>();
    this.shadowMapRequest =
    {
      deffered:d,
      rendererID:rendererID,
      generator:generator
    };
    return d.promise;
  }

  public getTextureHtmlImage(stageID:string,bufferTextureID:string,generator?:any):Q.IPromise<HTMLImageElement>
  {
    var d = Q.defer<HTMLImageElement>();
    this.bufferTextureRequest =
    {
        deffered:d,
        stageID:stageID,
        bufferTextureID:bufferTextureID,
        generator:generator
    };
    return d.promise;
  }
}

export = RendererDebugger;
