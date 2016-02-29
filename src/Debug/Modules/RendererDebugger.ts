import DebuggerModuleBase from "./DebuggerModuleBase";
import Debugger from "../Debugger";
import SceneManager from "../../Core/SceneManager";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import Scene from "../../Core/Scene";
import BasicRenderer from "../../Core/Renderers/BasicRenderer";
import Q from "q";
import Canvas from "../../Core/Canvas/Canvas";
import IRequestBufferTexture from "./Renderer/IRequestBufferTexture";
import IRequestShadowMapTexture from "./Renderer/IRequestShadowMapTexture";
import IRequestBufferTextureProgress from "./Renderer/IRequestBufferTextureProgress";
import IRequestShadowMapProgress from "./Renderer/IRequestShadowMapProgress";
class RendererDebugger extends DebuggerModuleBase {
  private _bufferTextureRequest: IRequestBufferTexture;

  private _shadowMapRequest: IRequestShadowMapTexture;

  private _bufferTextureProgressRequest: IRequestBufferTextureProgress;

  private _shadowMapProgressRequest: IRequestShadowMapProgress;

  public attach(debug: Debugger): void {
    const sm = JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager);
    sm.Scenes.forEach(s => {
      this._attachToScene(s, debug);
    });
    sm.on("change", (h) => {
      if (h.isAdditionalChange) {
        this._attachToScene(h.changedScene, debug);
      } else {
        // TODO add code for delete
      }
    });
  }

  public getShadowMapImage(rendererID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this._shadowMapRequest = {
      deffered: d,
      rendererID: rendererID,
      generator: generator
    };
    return d.promise;
  }

  public getShadowMapProgressImage(rendererID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this._shadowMapProgressRequest = {
      deffered: d,
      rendererID: rendererID,
      generator: generator,
      begin: false
    };
    return d.promise;
  }

  public getTextureHtmlImage(stageID: string, bufferTextureID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this._bufferTextureRequest = {
      deffered: d,
      stageID: stageID,
      bufferTextureID: bufferTextureID,
      generator: generator
    };
    return d.promise;
  }

  public getTextureProgressHtmlImage(stageID: string, bufferTextureID: string, generator?: any): Q.IPromise<HTMLImageElement> {
    const d = Q.defer<HTMLImageElement>();
    this._bufferTextureProgressRequest = {
      deffered: d,
      stageID: stageID,
      bufferTextureID: bufferTextureID,
      generator: generator,
      begin: false
    };
    return d.promise;
  }

  private _attachToScene(scene: Scene, debug: Debugger): void {
    scene.Renderers.forEach(r => {
      this._attachToRenderer(r, debug);
    });
    scene.on("changed-renderer", (h) => {
      if (h.isAdditionalChange) {
        this._attachToRenderer(h.renderer, debug);
      } else {
        // TODO add code for delete
      }
    });
  }

  private _canvasToimg(renderer: BasicRenderer): HTMLImageElement {
    const canvas = <Canvas>renderer.Canvas;
    const img = new Image(canvas.canvasElement.width, canvas.canvasElement.height);
    img.src = canvas.canvasElement.toDataURL();
    return img;
  }

  private _attachToRenderer(renderer: BasicRenderer, debug: Debugger): void {
    debug.debuggerAPI.renderers.addRenderer(renderer, this);
    renderer.RenderPathExecutor.on("rendered-stage", (v) => {
      if (this._bufferTextureRequest && v.completedChain.stage.ID === this._bufferTextureRequest.stageID) {
        if (v.bufferTextures[this._bufferTextureRequest.bufferTextureID] == null) {
          this._bufferTextureRequest.deffered.resolve(this._canvasToimg(v.owner.renderer));
          this._bufferTextureRequest = null;
          return;
        }
        this._bufferTextureRequest.deffered.resolve(v.bufferTextures[this._bufferTextureRequest.bufferTextureID].wrappers[0].generateHtmlImage(this._bufferTextureRequest.generator));
        this._bufferTextureRequest = null;
      }
    });
    renderer.RenderPathExecutor.on("rendered-path", (v) => {
      if (this._shadowMapRequest && v.owner.renderer.ID === this._shadowMapRequest.rendererID) {
        // this.shadowMapRequest.deffered.resolve(v.scene.LightRegister.shadowMapResourceManager.shadowMapTileTexture.wrappers[0].generateHtmlImage(this.shadowMapRequest.generator));
        this._shadowMapRequest = null;
      }
      if (this._bufferTextureProgressRequest && this._bufferTextureProgressRequest.begin) {
        this._bufferTextureProgressRequest.deffered.resolve(null);
        this._bufferTextureProgressRequest = null;
      }
      if (this._shadowMapProgressRequest && this._shadowMapProgressRequest.begin) {
        this._shadowMapProgressRequest.deffered.resolve(null);
        this._shadowMapProgressRequest = null;
      }
    });
    renderer.RenderPathExecutor.on("rendered-object", (v) => {
      let img;
      if (this._bufferTextureProgressRequest && v.stage.ID === this._bufferTextureProgressRequest.stageID) {
        this._bufferTextureProgressRequest.begin = true;
        v.owner.renderer.GL.flush();
        if (v.bufferTextures[this._bufferTextureProgressRequest.bufferTextureID] == null) {
          // for default buffer
          img = this._canvasToimg(v.owner.renderer);
        } else {
          img = v.bufferTextures[this._bufferTextureProgressRequest.bufferTextureID].wrappers[0].generateHtmlImage(this._bufferTextureProgressRequest.generator);
        }
        img.title = `object:${v.renderedObject.name} technique:${v.technique}`;
        this._bufferTextureProgressRequest.deffered.notify(
          {
            image: img,
            object: v.renderedObject,
            technique: v.technique
          }
          );
      }
      if (this._shadowMapProgressRequest && v.stage.getTypeName() === "ShadowMapGenerationStage" && v.stage.Renderer.ID === this._shadowMapProgressRequest.rendererID) {
        this._shadowMapProgressRequest.begin = true;
        v.owner.renderer.GL.flush();
        img = undefined; // v.renderedObject.ParentScene.LightRegister.shadowMapResourceManager.shadowMapTileTexture.wrappers[0].generateHtmlImage(this.shadowMapProgressRequest.generator);
        img.title = `object:${v.renderedObject.name} technique:${v.technique}`;
        this._shadowMapProgressRequest.deffered.notify(
          {
            image: img,
            object: v.renderedObject,
            technique: v.technique
          }
          );
      }
    });
  }

}

export default RendererDebugger;
