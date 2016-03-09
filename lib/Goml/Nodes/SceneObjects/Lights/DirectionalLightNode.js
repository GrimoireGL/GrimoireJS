import DirectionalLight from "../../../../Core/SceneObjects/Light/Impl/DirectionalLight";
import LightNodeBase from "./LightNodeBase";
class DirectionalLightNode extends LightNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "intensity": {
                value: 1,
                converter: "float",
                onchanged: this._onIntensityAttrChanged.bind(this),
            },
            "bias": {
                value: 0.01,
                converter: "float",
                onchanged: this._onBiasAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
            this._onBiasAttrChanged.call(this, this.attributes.getAttribute("bias"));
        });
    }
    __constructLight() {
        return new DirectionalLight();
    }
    _onIntensityAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.intensity = attr.Value;
            attr.done();
        }
    }
    _onBiasAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.bias = attr.Value;
            attr.done();
        }
    }
}
export default DirectionalLightNode;
