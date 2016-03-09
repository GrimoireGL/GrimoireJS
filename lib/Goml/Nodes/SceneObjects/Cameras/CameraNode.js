import PerspectiveCamera from "../../../../Core/SceneObjects/Camera/PerspectiveCamera";
import CameraNodeBase from "./CameraNodeBase";
class CameraNode extends CameraNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "fovy": {
                value: Math.PI / 4,
                converter: "angle",
                onchanged: this._onFovyAttrChanged.bind(this),
            },
            "aspect": {
                value: 0,
                converter: "float",
                onchanged: this._onAspectAttrChanged.bind(this),
            },
            "near": {
                value: 0.1,
                converter: "float",
                onchanged: this._onNearAttrChanged.bind(this),
            },
            "far": {
                value: 10,
                converter: "float",
                onchanged: this._onFarAttrChanged.bind(this),
            },
        });
        this.on("update-scene-object", (obj) => {
            this._onFovyAttrChanged.call(this, this.attributes.getAttribute("fovy"));
            this._onAspectAttrChanged.call(this, this.attributes.getAttribute("aspect"));
            this._onNearAttrChanged.call(this, this.attributes.getAttribute("near"));
            this._onFarAttrChanged.call(this, this.attributes.getAttribute("far"));
        });
    }
    __constructCamera() {
        return new PerspectiveCamera();
    }
    __onMount() {
        super.__onMount();
    }
    get Fovy() {
        return this.attributes.getValue("fovy");
    }
    get Aspect() {
        return this.attributes.getValue("aspect");
    }
    get Near() {
        return this.attributes.getValue("near");
    }
    get Far() {
        return this.attributes.getValue("far");
    }
    _onFovyAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Fovy = attr.Value;
            attr.done();
        }
    }
    _onAspectAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Aspect = attr.Value;
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
export default CameraNode;
