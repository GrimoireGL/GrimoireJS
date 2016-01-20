import DebuggerModuleBase = require("./DebuggerModuleBase");
import Debugger = require("../Debugger");
import SceneManager = require("../../Core/SceneManager");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import Scene = require("../../Core/Scene");
import BasicRenderer = require("../../Core/Renderers/BasicRenderer");
import Q = require("q");
import Canvas = require("../../Core/Canvas");
import IRequestBufferTexture = require("./Renderer/IRequestBufferTexture");
import IRequestShadowMapTexture = require("./Renderer/IRequestShadowMapTexture");
import IRequestBufferTextureProgress = require("./Renderer/IRequestBufferTextureProgress");
import IRequestShadowMapProgress = require("./Renderer/IRequestShadowMapProgress");
class RendererDebugger extends DebuggerModuleBase {
  private bufferTextureRequest: IRequestBufferTexture;

  private shadowMapRequest: IRequestShadowMapTexture;

  private bufferTextureProgressRequest: IRequestBufferTextureProgress;

  private shadowMapProgressRequest: IRequestShadowMapProgress;

  public attach(debug: Debugger) {
    const sm = JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager);
    sm.Scenes.forEach(s => {
      this.attachToScene(s, debug);
    });
    sm.sceneListChanged.addListener((o, h) => {
      if (h.isAdditionalChange) {
        this.attachToScene(h.changedScene, debug);
      } else {
        // TODO add code for delete
      }
    });
  }

  private attachToScene(scene: Scene, debug: Debugger) {
    scene.Renderers.forEach(r => {
      this.attachToRenderer(r, debug);
    });
    scene.rendererListChanged.addListener((o, h) => {
      if (h.isAdditionalChange) {
        this.attachToRenderer(h.renderer, debug);
      } else {
        // TODO add code for delete
      }
    });
  }

  private canvasToimg(renderer: BasicRenderer) {
    const canvas = <Canvas>renderer.Canvas;
    const img = new Image(canvas.canvasElement.width, canvas.canvasElement.height);
    img.src = canvas.canvasElement.toDataURL();
    return img;
  }

  private attachToRenderer(renderer: BasicRenderer, debug: Debugger) {
    debug.debuggerAPI.renderers.addRenderer(renderer, this);
    renderer.RenderPathExecutor.renderStageCompleted.addListener((o, v) => {
      if (this.bufferTextureRequest && v.completedChain.stage.ID === this.bufferTextureRequest.stageID) {
        if (v.bufferTextures[this.bufferTextureRequest.bufferTextureID] == null) {
          this.bufferTextureRequest.deffered.resolve(this.canvasToimg(v.owner.renderer));
          this.bufferTextureRequest = null;
          return;
        }
        this.bufferTextureRequest.deffered.resolve(v.bufferTextures[this.bufferTextureRequest.bufferTextureID].wrappers[0].generateHtmlImage(this.bufferTextureRequest.generator));
        this.bufferTextureRequest = null;
      }
    });
    renderer.RenderPathExecutor.renderPathCompleted.addListener((o, v) => {
      if (this.shadowMapRequest && v.owner.renderer.ID === this.shadowMapRequest.rendererID) {
        // this.shadowMapRequest.deffered.resolve(v.scene.LightRegister.shadowMapResourceManager.shadowMapTileTexture.wrappers[0].generateHtmlImage(this.shadowMapRequest.generator));
        this.shadowMapRequest = null;
      }
      if (this.bufferTextureProgressRequest && this.bufferTextureProgressRequest.begin) {
        this.bufferTextureProgressRequest.deffered.resolve(null);
        this.bufferTextureProgressRequest = null;
      }
      if (this.shadowMapProgressRequest && this.shadowMapProgressRequest.begin) {
        this.shadowMapProgressRequest.deffered.resolve(null);
        this.shadowMapProgressRequest = null;
      }
    });
    renderer.RenderPathExecutor.renderObjectCompleted.addListener((o, v) => {
      let img;
      if (this.bufferTextureProgressRequest && v.stage.ID === this.bufferTextureProgressRequest.stageID) {
        this.bufferTextureProgressRequest.begin = true;
        v.owner.renderer.GL.flush();
        if (v.bufferTextures[this.bufferTextureProgressRequest.bufferTextureID] == null) {
          // for default buffer
          img = this.canvasToimg(v.owner.renderer);
        } else {
          img = v.bufferTextures[this.bufferTextureProgressRequest.bufferTextureID].wrappers[0].generateHtmlImage(this.bufferTextureProgressRequest.generator);
        }
        img.title = `object:${v.renderedObject.name} technique:${v.technique}`;
        this.bufferTextureProgressRequest.deffered.notify(
          {
            image: img,
            object: v.renderedObject,
            technique: v.technique
          }
          );
      }
      if (this.shadowMapProgressRequest && v.stage.getTypeName() === "ShadowMapGenerationStage" && v.stage.Renderer.ID === this.shadowMapProgressRequest.rendererID) {
        this.shadowMapProgressRequest.begin = true;
        v.owner.renderer.GL.flush();
        img = undefined; // v.renderedObject.ParentScene.LightRegister.shadowMapResourceManager.shadowMapTileTexture.wrappers[0].generateHtmlImage(this.shadowMapProgressRequest.generator);
        img.title = `object:${v.renderedObject.name} technique:${v.technique}`;
        this.shadowMapProgressRequest.deffered.notify(
          {
            image: img,
            object: v.renderedObject,
            technique: v.technique
          }
         );
      }
    });
  }

  public getShadowMapImage(rendererID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this.shadowMapRequest = {
      deffered: d,
      rendererID: rendererID,
      generator: generator
    };
    return d.promise;
  }

  public getShadowMapProgressImage(rendererID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this.shadowMapProgressRequest = {
      deffered: d,
      rendererID: rendererID,
      generator: generator,
      begin: false
    };
    return d.promise;
  }

  public getTextureHtmlImage(stageID: string, bufferTextureID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this.bufferTextureRequest = {
      deffered: d,
      stageID: stageID,
      bufferTextureID: bufferTextureID,
      generator: generator
    };
    return d.promise;
  }

  public getTextureProgressHtmlImage(stageID: string, bufferTextureID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this.bufferTextureProgressRequest = {
      deffered: d,
      stageID: stageID,
      bufferTextureID: bufferTextureID,
      generator: generator,
      begin: false
    };
    return d.promise;
  }
}

export = RendererDebugger;
