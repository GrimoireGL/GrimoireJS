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

class ViewPortNode extends CoreRelatedNodeBase<BasicRenderer> {
  private left: number;
  private top: number;
  private width: number;
  private height: number;

  private skyBoxStageChain: StageChainTemplate;

  private parentCanvas: CanvasNode;


  constructor() {
    super();
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
          this.width = attr.Value;
          this.updateViewportArea();
          attr.done();
        },
      },
      "height": {
        value: 480,
        converter: "float",
        onchanged: (attr) => {
          this.height = attr.Value;
          this.updateViewportArea();
          attr.done();
        },
      },
      "left": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          this.left = attr.Value;
          this.updateViewportArea();
          attr.done();
        },
      },
      "top": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          this.top = attr.Value;
          this.updateViewportArea();
          attr.done();
        },
      },
      "backgroundType": {
        value: "color",
        converter: "string",
        onchanged: (attr) => {
          if (attr.Value !== "skybox" && this.skyBoxStageChain) {
            // this.targetRenderer.renderPath.deleteStage(this.skyBoxStageChain); TODO fix this
            this.skyBoxStageChain = null;
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

  protected onMount(): void {
    super.onMount();
  }

  private _onConfigAttrChanged(attr: GomlAttribute): void {
    if (this.parent.getTypeName() !== "CanvasNode") {
      throw Error("viewport must be the direct child of canvas");
    }
    this.parentCanvas = <CanvasNode>this.parent;
    const defaultRect = this.parentCanvas.target.region;
    this.target = RendererFactory.generateRenderer(this.parentCanvas.target, defaultRect, attr.Value);
    attr.done();
  }

  private _onCamAttrChanged(attr: GomlAttribute): void {
    this.resolveCamera(attr.Value, attr.done.bind(attr));
  }

  private _onSkyboxAttrChanged(attr): void {
    if (this.attributes.getValue("backgroundType") === "skybox") {
      this.nodeImport("jthree.resource.TextureCube", attr.Value, (node: CubeTextureNode) => {
        if (node) {
          if (!this.skyBoxStageChain) {
            this.skyBoxStageChain = {
              buffers: {
                OUT: "main"
              },
              stage: "jthree.basic.skybox",
              variables: {}
            };
            this.target.renderPath.insertWithIndex(0, this.skyBoxStageChain);
          }
          this.skyBoxStageChain.variables["skybox"] = node.target;
          attr.done();
        }
      });
    }
  }

  private updateViewportArea() {
    // console.log("updateViewportArea");
    if (this.parentCanvas) { // ここ何やってるんだっけ
      if (this.parentCanvas.canvasFrames.container) {
        // when canvas HTMLElement is applied
        const frame = this.parentCanvas.canvasFrames.container;
        const W = frame.clientWidth;
        const H = frame.clientHeight;
        const left = this.left > 1 ? this.left : W * this.left;
        const top = this.top > 1 ? this.top : H * this.top;
        const width = this.width > 1 ? this.width : W * this.width;
        const height = this.height > 1 ? this.height : H * this.height;
        this.target.region = new Rectangle(left, top, width, height);
      } else {
        // when canvas HTMLElement is not applied
        this.target.region = new Rectangle(this.left, this.top, this.width, this.height);
      }
      if (this.target.Camera.getTypeName() === "PerspectiveCamera") {
        (<PerspectiveCamera>this.target.Camera).Aspect = this.width / this.height;
      }
    }
  }

  private resolveCamera(cam: string, done: () => void) {
    this.nodeImport("jthree.scene.camera", cam, (cameraNode: CameraNodeBase<Camera>) => {
      //
      // remove camera here
      //
      if (cameraNode) {
        if (cameraNode.ContainedSceneNode != null) { // if there was specified camera and there is Scene
          this.target.Camera = cameraNode.target;
          const scene: Scene = cameraNode.ContainedSceneNode.target;
          scene.addRenderer(this.target);
          this.updateViewportArea();
        } else {
          console.error("cant retrieve scene!");
        }
      }
      done();
    });
  }
}

export default ViewPortNode;
