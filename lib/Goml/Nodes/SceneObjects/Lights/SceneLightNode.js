import LightNodeBase from "./LightNodeBase";
import SceneLight from "../../../../Core/SceneObjects/Light/Impl/SceneLight";
class SceneLightNode extends LightNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "intensity": {
                value: 1,
                converter: "float",
                onchanged: this._onIntensityAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
        });
    }
    __constructLight() {
        return new SceneLight();
    }
    _onIntensityAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.intensity = attr.Value;
            attr.done();
        }
    }
}
export default SceneLightNode;
