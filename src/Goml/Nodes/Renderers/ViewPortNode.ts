import Camera from "../../../Core/SceneObjects/Camera/Camera";
import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import StageChainTemplate from "../../../Core/Renderers/StageChainTemplate";
import BasicRenderer from "../../../Core/Renderers/BasicRenderer";
import Rectangle from "../../../Math/Rectangle";
import Scene from "../../../Core/Scene";
import CameraNodeBase from "../SceneObjects/Cameras/CameraNodeBase";
import CanvasNode from "../Canvases/CanvasNode";
import PerspectiveCamera from "../../../Core/SceneObjects/Camera/PerspectiveCamera";
import CubeTextureNode from "../Texture/CubeTextureNode";
import RendererFactory from "../../../Core/Renderers/RendererFactory";
import GomlAttribute from "../../GomlAttribute";
import EventBroadcaster from "../../../Interface/Events/EventBroadcaster";

class ViewPortNode extends CoreRelatedNodeBase<BasicRenderer> {
  private _left: number;
  private _top: number;
  private _width: number;
  private _height: number;

  private _skyBoxStageChain: StageChainTemplate;

  private _parentCanvas: CanvasNode;

  private _eventBroadcaster: EventBroadcaster;

  constructor() {
    super();
    this._eventBroadcaster = new EventBroadcaster();
    this.attributes.defineAttribute({
      "cam": {
        value: undefined,
        converter: "string",
        onchanged: this._onCamAttrChanged.bind(this),
      },
      "width": {
        value: 640,
        converter: "float",
        onchanged: (attr) => {
          this._width = attr.Value;
          this._updateViewportArea();
          attr.done();
        },
      },
      "height": {
        value: 480,
        converter: "float",
        onchanged: (attr) => {
          this._height = attr.Value;
          this._updateViewportArea();
          attr.done();
        },
      },
      "left": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          this._left = attr.Value;
          this._updateViewportArea();
          attr.done();
        },
      },
      "top": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          this._top = attr.Value;
          this._updateViewportArea();
          attr.done();
        },
      },
      "backgroundType": {
        value: "color",
        converter: "string",
        onchanged: (attr) => {
          if (attr.Value !== "skybox" && this._skyBoxStageChain) {
            // this.targetRenderer.renderPath.deleteStage(this.skyBoxStageChain); TODO fix this
            this._skyBoxStageChain = null;
          }
          attr.done();
        },
      },
      "skybox": {
        value: null,
        converter: "string",
        onchanged: this._onSkyboxAttrChanged.bind(this),
      },
      "config": {
        converter: "string",
        value: "default",
        onchanged: this._onConfigAttrChanged.bind(this),
      },
      "name": {
        converter: "string",
        value: undefined,
        onchanged: (attr) => {
          this.target.name = attr.Value;
          attr.done();
        }
      },
    });
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __onUnmount(): void {
    super.__onUnmount();
    this._eventBroadcaster.detachEvents();
  }

  private _onConfigAttrChanged(attr: GomlAttribute): void {
    if (this.__parent.getTypeName() !== "CanvasNode") {
      throw Error("viewport must be the direct child of canvas");
    }
    this._parentCanvas = <CanvasNode>this.__parent;
    const defaultRect = this._parentCanvas.target.region;
    if (this.target) {
      this._eventBroadcaster.detachEvents();
    }
    this.target = RendererFactory.generateRenderer(this._parentCanvas.target, defaultRect, attr.Value);
    this._eventBroadcaster.attachEvents(this.target);
    attr.done();
  }

  private _onCamAttrChanged(attr: GomlAttribute): void {
    this._resolveCamera(attr.Value, attr.done.bind(attr));
  }

  private _onSkyboxAttrChanged(attr): void {
    if (this.attributes.getValue("backgroundType") === "skybox") {
      this.nodeImport("jthree.resource.TextureCube", attr.Value, (node: CubeTextureNode) => {
        if (node) {
          if (!this._skyBoxStageChain) {
            this._skyBoxStageChain = {
              buffers: {
                OUT: "main"
              },
              stage: "jthree.basic.skybox",
              variables: {}
            };
            this.target.renderPath.insertWithIndex(0, this._skyBoxStageChain);
          }
          this._skyBoxStageChain.variables["skybox"] = node.target;
          attr.done();
        } else {
          attr.done();
        }
      });
    } else {
      attr.done();
    }
  }

  private _updateViewportArea(): void {
    // console.log("updateViewportArea");
    if (this._parentCanvas) { // ここ何やってるんだっけ
      if (this._parentCanvas.canvasFrames.container) {
        // when canvas HTMLElement is applied
        const frame = this._parentCanvas.canvasFrames.container;
        const W = frame.clientWidth;
        const H = frame.clientHeight;
        const left = this._left > 1 ? this._left : W * this._left;
        const top = this._top > 1 ? this._top : H * this._top;
        const width = this._width > 1 ? this._width : W * this._width;
        const height = this._height > 1 ? this._height : H * this._height;
        this.target.region = new Rectangle(left, top, width, height);
      } else {
        // when canvas HTMLElement is not applied
        this.target.region = new Rectangle(this._left, this._top, this._width, this._height);
      }
      if (this.target.camera.getTypeName() === "PerspectiveCamera") {
        (<PerspectiveCamera>this.target.camera).Aspect = this._width / this._height;
      }
    }
  }

  private _resolveCamera(cam: string, done: () => void): void {
    this.nodeImport("jthree.scene.camera", cam, (cameraNode: CameraNodeBase<Camera>) => {
      //
      // remove camera here
      //
      if (cameraNode) {
        if (cameraNode.ContainedSceneNode != null) { // if there was specified camera and there is Scene
          this.target.camera = cameraNode.target;
          const scene: Scene = cameraNode.ContainedSceneNode.target;
          scene.addRenderer(this.target);
          this._updateViewportArea();
        } else {
          console.error("cant retrieve scene!");
        }
      }
      done();
    });
  }
}

export default ViewPortNode;
