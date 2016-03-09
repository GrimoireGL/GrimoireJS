import SpotLight from "../../../../Core/SceneObjects/Light/Impl/SpotLight";
import LightNodeBase from "./LightNodeBase";
class SpotLightNode extends LightNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "intensity": {
                value: 1,
                converter: "float",
                onchanged: this._onIntensityAttrChanged.bind(this),
            },
            "innerAngle": {
                value: 0.2,
                converter: "angle",
                onchanged: this._onInnerAngleAttrChanged.bind(this),
            },
            "outerAngle": {
                value: 0.5,
                converter: "angle",
                onchanged: this._onOuterAngleAttrChanged.bind(this),
            },
            "innerDistance": {
                value: 4,
                converter: "float",
                onchanged: this._onInnerDistanceAttrChanged.bind(this),
            },
            "outerDistance": {
                value: 15,
                converter: "float",
                onchanged: this._onOuterDistanceAttrChanged.bind(this),
            },
            "distanceDecay": {
                value: 1,
                converter: "float",
                onchanged: this._onDistanceDecayAttrChanged.bind(this),
            },
            "angleDecay": {
                value: 1,
                converter: "float",
                onchanged: this._onAngleDecayAttrChanged.bind(this),
            },
        });
        this.on("update-scene-object", (obj) => {
            this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
            this._onInnerAngleAttrChanged.call(this, this.attributes.getAttribute("innerAngle"));
            this._onOuterAngleAttrChanged.call(this, this.attributes.getAttribute("outerAngle"));
            this._onInnerDistanceAttrChanged.call(this, this.attributes.getAttribute("innerDistance"));
            this._onOuterDistanceAttrChanged.call(this, this.attributes.getAttribute("outerDistance"));
            this._onDistanceDecayAttrChanged.call(this, this.attributes.getAttribute("distanceDecay"));
            this._onAngleDecayAttrChanged.call(this, this.attributes.getAttribute("angleDecay"));
        });
    }
    __constructLight() {
        return new SpotLight();
    }
    _onIntensityAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.intensity = attr.Value;
            attr.done();
        }
    }
    _onInnerAngleAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.innerAngle = attr.Value;
            attr.done();
        }
    }
    _onOuterAngleAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.outerAngle = attr.Value;
            attr.done();
        }
    }
    _onInnerDistanceAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.innerDistance = attr.Value;
            attr.done();
        }
    }
    _onOuterDistanceAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.outerDistance = attr.Value;
            attr.done();
        }
    }
    _onDistanceDecayAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.distanceDecay = attr.Value;
            attr.done();
        }
    }
    _onAngleDecayAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.angleDecay = attr.Value;
            attr.done();
        }
    }
}
export default SpotLightNode;
