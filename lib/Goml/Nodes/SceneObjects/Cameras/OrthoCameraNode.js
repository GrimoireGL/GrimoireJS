import OrthoCamera from "../../../../Core/SceneObjects/Camera/OrthoCamera";
import CameraNodeBase from "./CameraNodeBase";
class OrthoCameraNode extends CameraNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "left": {
                value: -100,
                converter: "float",
                onchanged: this._onLeftAttrChanged.bind(this),
            },
            "right": {
                value: 100,
                converter: "float",
                onchanged: this._onRightAttrChanged.bind(this),
            },
            "bottom": {
                value: -100,
                converter: "float",
                onchanged: this._onBottomAttrChanged.bind(this),
            },
            "top": {
                value: 100,
                converter: "float",
                onchanged: this._onTopAttrChanged.bind(this),
            },
            "near": {
                value: -100,
                converter: "float",
                onchanged: this._onNearAttrChanged.bind(this),
            },
            "far": {
                value: -100,
                converter: "float",
                onchanged: this._onFarAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onLeftAttrChanged.call(this, this.attributes.getAttribute("left"));
            this._onRightAttrChanged.call(this, this.attributes.getAttribute("right"));
            this._onBottomAttrChanged.call(this, this.attributes.getAttribute("bottom"));
            this._onTopAttrChanged.call(this, this.attributes.getAttribute("top"));
            this._onNearAttrChanged.call(this, this.attributes.getAttribute("near"));
            this._onFarAttrChanged.call(this, this.attributes.getAttribute("far"));
        });
    }
    __constructCamera() {
        return new OrthoCamera();
    }
    _onLeftAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Left = attr.Value;
            attr.done();
        }
    }
    _onRightAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Right = attr.Value;
            attr.done();
        }
    }
    _onBottomAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Bottom = attr.Value;
            attr.done();
        }
    }
    _onTopAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Top = attr.Value;
            attr.done();
        }
    }
    _onNearAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Near = attr.Value;
            attr.done();
        }
    }
    _onFarAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Far = attr.Value;
            attr.done();
        }
    }
}
export default OrthoCameraNode;
