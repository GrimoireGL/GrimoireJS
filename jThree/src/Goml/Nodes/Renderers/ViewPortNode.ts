import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import BasicRenderer = require("../../../Core/Renderers/BasicRenderer");
import CanvasNodeBase = require("../Canvases/CanvasNodeBase");
import Rectangle = require("../../../Math/Rectangle");
import Scene = require("../../../Core/Scene");
import SceneObjectNodeBase = require("../SceneObjects/SceneObjectNodeBase");
import CameraNodeBase = require("../SceneObjects/Cameras/CameraNodeBase");
import CanvasNode = require("../Canvases/CanvasNode");
import PerspectiveCamera = require("../../../Core/Camera/PerspectiveCamera");
import SkyboxStage = require("../../../Core/Renderers/RenderStages/SkyBoxStage");
import CubeTextureTag = require("../Texture/CubeTextureNode");
import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture");
import RenderStageChain = require("../../../Core/Renderers/RenderStageChain");
import RendererFactory = require("../../../Core/Renderers/RendererFactory");

class ViewPortNode extends GomlTreeNodeBase {

  private parentCanvas: CanvasNode;

  private targetRenderer: BasicRenderer;

  private skyBoxStageChain: RenderStageChain;

  public get TargetViewport(): BasicRenderer {
    return this.targetRenderer;
  }

  constructor() {
    super();
    this.attributes.defineAttribute({
      'cam': {
        value: undefined,
        converter: 'string',
        onchanged: this._onCamAttrChanged,
      },
      "width": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.width = attr.Value;
          this.updateViewportArea();
        },
      },
      "height": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.height = attr.Value;
          this.updateViewportArea();
        },
      },
      "left": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.left = attr.Value;
          this.updateViewportArea();
        },
      },
      "top": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.top = attr.Value;
          this.updateViewportArea();
        },
      },
      "backgroundType": {
        value: "color",
        converter: "string",
        onchanged: (attr) => {
          if (attr.Value !== "skybox" && this.skyBoxStageChain) {
            this.targetRenderer.renderPath.deleteStage(this.skyBoxStageChain);
            this.skyBoxStageChain = null;
          }
        },
      },
      "skybox": {
        value: null,
        converter: "string",
        onchanged: this._onSkyboxAttrChanged,
      },
      "config": {
        converter: "string",
        value: "default"
      },
      "name": {
        converter: "string",
        value: undefined,
        onchanged: (attr) => {
          if (attr.Value) this.targetRenderer.name = attr.Value;
        }
      },
    });
  }

  private _onCamAttrChanged(attr): void {
    this.cam = attr.Value;
    this.resolveCamera();
  }

  private _onSkyboxAttrChanged(attr): void {
    if (this.attributes.getValue("backgroundType") === "skybox") {
      var cubeTexture = <CubeTextureTag>this.nodeManager.nodeRegister.getObject("jthree.resource.cubetexture", attr.Value);
      if (cubeTexture) {
        if (!this.skyBoxStageChain) {
          this.skyBoxStageChain = {
            buffers: {
              OUT: "default"
            },
            stage: new SkyboxStage(this.targetRenderer)
          };
          this.targetRenderer.renderPath.insertWithIndex(0, this.skyBoxStageChain);
        }
        (<SkyboxStage>this.skyBoxStageChain.stage).skyBoxTexture = <CubeTexture>cubeTexture.TargetTexture;
      }
    }
  }

  protected nodeWillMount(parent) {
    super.nodeWillMount(parent);
    this.parentCanvas = <CanvasNode>parent;
    const defaultRect = this.parentCanvas.Canvas.region;
    this.attributes.setValue('width', defaultRect.Width);
    this.attributes.setValue('height', defaultRect.Height);
    this.attributes.setValue('left', defaultRect.Left);
    this.attributes.setValue('top', defaultRect.Top);
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
    var rdr: CanvasNode = this.parentCanvas;
    var defaultRect = rdr.Canvas.region;
    this.targetRenderer = RendererFactory.generateRenderer(rdr.Canvas, defaultRect, this.attributes.getValue("config"));
    var cameraNode = this.resolveCamera();
    this.targetRenderer.Camera = cameraNode.TargetCamera;
    var scene: Scene = cameraNode.ContainedSceneNode.targetScene;
    scene.addRenderer(this.targetRenderer);

    if ("resize" in rdr) {
      var castedRdr = <CanvasNode>rdr;
      castedRdr.resize(this.updateViewportArea.bind(this));
    }

    this.attributes.applyDefaultValue();
  }

  private updateViewportArea() {
    if ("targetFrame" in this.parentCanvas) {
      var castedRdr = <CanvasNode>this.parentCanvas;
      var frame = castedRdr.targetFrame;

      castedRdr.resize(this.updateViewportArea.bind(this));
      var W = frame.clientWidth;
      var H = frame.clientHeight;
      var left = this.left > 1 ? this.left : W * this.left;
      var top = this.top > 1 ? this.top : H * this.top;
      var width = this.width > 1 ? this.width : W * this.width;
      var height = this.height > 1 ? this.height : H * this.height;
      this.targetRenderer.region = new Rectangle(left, top, width, height);

      if ("Aspect" in this.targetRenderer.Camera) {//todo Camera�����n���h���o�^������
        var castedCam = <PerspectiveCamera>this.targetRenderer.Camera;
        castedCam.Aspect = width / height;
      }
    } else {
      this.targetRenderer.region = new Rectangle(this.left, this.top, this.width, this.height);

      if ("Aspect" in this.targetRenderer.Camera) {
        var castedCam = <PerspectiveCamera>this.targetRenderer.Camera;
        castedCam.Aspect = this.width / this.height;
      }
    }

  }

  private resolveCamera(): CameraNodeBase {
    var camTags = this.nodeManager.nodeRegister.getGroupMap<SceneObjectNodeBase>("jthree.camera");
    if (!camTags.has(this.Cam))//if there was no specified camera
    {
      console.error("can not find camera");
      if (camTags.size == 0) {
        console.error("There is no scene.");
      } else {

      }
      return null;
    }
    var targetCam = <CameraNodeBase>camTags.get(this.Cam);
    if (targetCam.ContainedSceneNode != null)//if there was specified camera and there is Scene
    {
      return targetCam;
    } else {
      console.error("cant retrieve scene!");
    }
  }
  private cam: string;
  private left: number;
  private top: number;
  private width: number;
  private height: number;

  public get Cam(): string {
    return this.cam;
  }

}

export = ViewPortNode;
