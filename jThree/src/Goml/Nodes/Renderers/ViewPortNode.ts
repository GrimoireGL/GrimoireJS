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
import CubeTextureNode = require("../Texture/CubeTextureNode");
import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture");
import RenderStageChain = require("../../../Core/Renderers/RenderStageChain");
import RendererFactory = require("../../../Core/Renderers/RendererFactory");
import Delegates = require('../../../Base/Delegates');

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
        onchanged: this._onCamAttrChanged.bind(this),
      },
      "width": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.width = attr.Value;
          // this.updateViewportArea(); // TODO: pnly
        },
      },
      "height": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.height = attr.Value;
          // this.updateViewportArea(); // TODO: pnly
        },
      },
      "left": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.left = attr.Value;
          // this.updateViewportArea(); // TODO: pnly
        },
      },
      "top": {
        value: undefined,
        converter: "number",
        onchanged: (attr) => {
          this.top = attr.Value;
          // this.updateViewportArea(); // TODO: pnly
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
        onchanged: this._onSkyboxAttrChanged.bind(this),
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
    // this.resolveCamera(() => {}); // ????
  }

  private _onSkyboxAttrChanged(attr): void {
    if (this.attributes.getValue("backgroundType") === "skybox") {
      this.nodeManager.nodeRegister.getObject("jthree.resource.cubetexture", attr.Value, (node: CubeTextureNode) => {
        if (node) {
          if (!this.skyBoxStageChain) {
            this.skyBoxStageChain = {
              buffers: {
                OUT: "default"
              },
              stage: new SkyboxStage(this.targetRenderer)
            };
            this.targetRenderer.renderPath.insertWithIndex(0, this.skyBoxStageChain);
          }
          (<SkyboxStage>this.skyBoxStageChain.stage).skyBoxTexture = <CubeTexture>node.TargetTexture;
        }
      });
    }
  }

  protected nodeWillMount(parent) {
    super.nodeWillMount(parent);
    this.cam = this.attributes.getValue('cam'); // TODO: pnly
    this.parentCanvas = <CanvasNode>parent;
    const defaultRect = this.parentCanvas.Canvas.region;
    // this.attributes.setValue('width', defaultRect.Width);
    // this.attributes.setValue('height', defaultRect.Height);
    // this.attributes.setValue('left', defaultRect.Left);
    // this.attributes.setValue('top', defaultRect.Top);

    var rdr: CanvasNode = this.parentCanvas;
    this.targetRenderer = RendererFactory.generateRenderer(rdr.Canvas, defaultRect, this.attributes.getValue("config"));
    this.resolveCamera((cameraNode) => {
      this.targetRenderer.Camera = cameraNode.TargetCamera;
      var scene: Scene = cameraNode.ContainedSceneNode.targetScene;
      scene.addRenderer(this.targetRenderer);
      this.updateViewportArea();
    });

    if ("resize" in rdr) {
      var castedRdr = <CanvasNode>rdr;
      castedRdr.resize(this.updateViewportArea.bind(this));
    }
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
  }

  private updateViewportArea() {
    console.info('updateViewportArea');
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
      debugger;
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

  private resolveCamera(callbackfn: Delegates.Action1<CameraNodeBase>) {
    this.nodeManager.nodeRegister.getObject("jthree.camera", this.Cam, (targetCam: CameraNodeBase) => {
      if (targetCam.ContainedSceneNode != null) { //if there was specified camera and there is Scene
        callbackfn(targetCam);
      } else {
        console.error("cant retrieve scene!");
      }
    });
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
