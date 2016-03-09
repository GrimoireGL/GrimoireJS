import LightNodeBase from "./LightNodeBase";
import PointLight from "../../../../Core/SceneObjects/Light/Impl/PointLight";
class PointLightNode extends LightNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "intensity": {
                value: 1,
                converter: "float",
                onchanged: this._onIntensityAttrChanged.bind(this),
            },
            "decay": {
                value: 1,
                converter: "float",
                onchanged: this._onDecayAttrChanged.bind(this),
            },
            "distance": {
                value: 1,
                converter: "float",
                onchanged: this._onDistanceAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
            this._onDecayAttrChanged.call(this, this.attributes.getAttribute("decay"));
            this._onDistanceAttrChanged.call(this, this.attributes.getAttribute("distance"));
        });
    }
    __constructLight() {
        return new PointLight();
    }
    _onIntensityAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.intensity = attr.Value;
            attr.done();
        }
    }
    _onDecayAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.decay = attr.Value;
            attr.done();
        }
    }
    _onDistanceAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.distance = attr.Value;
            attr.done();
        }
    }
}
export default PointLightNode;
