import StageChainTemplate from "../../../Core/Renderers/StageChainTemplate";
import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import BasicRenderer from "../../../Core/Renderers/BasicRenderer";
import Rectangle from "../../../Math/Rectangle";
import Scene from "../../../Core/Scene";
import CameraNodeBase from "../SceneObjects/Cameras/CameraNodeBase";
import CanvasNode from "../Canvases/CanvasNode";
import PerspectiveCamera from "../../../Core/SceneObjects/Camera/PerspectiveCamera";
import CubeTextureNode from "../Texture/CubeTextureNode";
import CubeTexture from "../../../Core/Resources/Texture/CubeTexture";
import RendererFactory from "../../../Core/Renderers/RendererFactory";
import GomlAttribute from "../../GomlAttribute";

class ViewPortNode extends GomlTreeNodeBase {
  private left: number;
  private top: number;
  private width: number;
  private height: number;

  private targetRenderer: BasicRenderer;

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
        },
      },
      "height": {
        value: 480,
        converter: "float",
        onchanged: (attr) => {
          this.height = attr.Value;
          this.updateViewportArea();
        },
      },
      "left": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          this.left = attr.Value;
          this.updateViewportArea();
        },
      },
      "top": {
        value: 0,
        converter: "float",
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
            // this.targetRenderer.renderPath.deleteStage(this.skyBoxStageChain); TODO fix this
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
        value: "default",
        onchanged: this._onConfigAttrChanged.bind(this),
      },
      "name": {
        converter: "string",
        value: undefined,
        onchanged: (attr) => {
          this.targetRenderer.name = attr.Value;
        }
      },
    });
  }

  public get TargetViewport(): BasicRenderer {
    return this.targetRenderer;
  }

  protected onMount(): void {
    super.onMount();
  }

  private _onConfigAttrChanged(attr: GomlAttribute): void {
    if (this.parent.getTypeName() !== "CanvasNode") {
      throw Error("viewport must be the direct child of canvas");
    }
    this.parentCanvas = <CanvasNode>this.parent;
    const defaultRect = this.parentCanvas.canvas.region;
    this.targetRenderer = RendererFactory.generateRenderer(this.parentCanvas.canvas, defaultRect, attr.Value);
  }

  private _onCamAttrChanged(attr: GomlAttribute): void {
    this.resolveCamera(attr.Value);
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
            this.targetRenderer.renderPath.insertWithIndex(0, this.skyBoxStageChain);
          }
          this.skyBoxStageChain.variables["skybox"] = <CubeTexture>node.TargetTexture;
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
        this.targetRenderer.region = new Rectangle(left, top, width, height);
      } else {
        // when canvas HTMLElement is not applied
        this.targetRenderer.region = new Rectangle(this.left, this.top, this.width, this.height);
      }
      if (this.targetRenderer.Camera.getTypeName() === "PerspectiveCamera") {
        (<PerspectiveCamera>this.targetRenderer.Camera).Aspect = this.width / this.height;
      }
    }
  }

  private resolveCamera(cam) {
    this.nodeImport("jthree.scene.camera", cam, (cameraNode: CameraNodeBase) => {
      //
      // remove camera here
      //
      if (cameraNode) {
        if (cameraNode.ContainedSceneNode != null) { // if there was specified camera and there is Scene
          this.targetRenderer.Camera = cameraNode.TargetCamera;
          const scene: Scene = cameraNode.ContainedSceneNode.targetScene;
          scene.addRenderer(this.targetRenderer);
          this.updateViewportArea();
        } else {
          console.error("cant retrieve scene!");
        }
      }
    });
  }
}

export default ViewPortNode;
