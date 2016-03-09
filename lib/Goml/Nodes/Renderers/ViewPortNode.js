import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Rectangle from "../../../Math/Rectangle";
import RendererFactory from "../../../Core/Renderers/RendererFactory";
class ViewPortNode extends CoreRelatedNodeBase {
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
    __onMount() {
        super.__onMount();
    }
    _onConfigAttrChanged(attr) {
        if (this.__parent.getTypeName() !== "CanvasNode") {
            throw Error("viewport must be the direct child of canvas");
        }
        this._parentCanvas = this.__parent;
        const defaultRect = this._parentCanvas.target.region;
        this.target = RendererFactory.generateRenderer(this._parentCanvas.target, defaultRect, attr.Value);
        attr.done();
    }
    _onCamAttrChanged(attr) {
        this._resolveCamera(attr.Value, attr.done.bind(attr));
    }
    _onSkyboxAttrChanged(attr) {
        if (this.attributes.getValue("backgroundType") === "skybox") {
            this.nodeImport("jthree.resource.TextureCube", attr.Value, (node) => {
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
                }
                else {
                    attr.done();
                }
            });
        }
        else {
            attr.done();
        }
    }
    _updateViewportArea() {
        // console.log("updateViewportArea");
        if (this._parentCanvas) {
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
            }
            else {
                // when canvas HTMLElement is not applied
                this.target.region = new Rectangle(this._left, this._top, this._width, this._height);
            }
            if (this.target.Camera.getTypeName() === "PerspectiveCamera") {
                this.target.Camera.Aspect = this._width / this._height;
            }
        }
    }
    _resolveCamera(cam, done) {
        this.nodeImport("jthree.scene.camera", cam, (cameraNode) => {
            //
            // remove camera here
            //
            if (cameraNode) {
                if (cameraNode.ContainedSceneNode != null) {
                    this.target.Camera = cameraNode.target;
                    const scene = cameraNode.ContainedSceneNode.target;
                    scene.addRenderer(this.target);
                    this._updateViewportArea();
                }
                else {
                    console.error("cant retrieve scene!");
                }
            }
            done();
        });
    }
}
export default ViewPortNode;
