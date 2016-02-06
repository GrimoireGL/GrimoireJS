import DirectionalLight from "../../../../Core/SceneObjects/Light/Impl/DirectionalLight";
import LightNodeBase from "./LightNodeBase";
import LightBase from "../../../../Core/SceneObjects/Light/LightBase";
import GomlAttribute from "../../../GomlAttribute";

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
    this.on("update-scene-object", (obj: DirectionalLight) => {
      this._onIntensityAttrChanged.bind(this)(this.attributes.getAttribute("intensity"));
      this._onBiasAttrChanged.bind(this)(this.attributes.getAttribute("bias"));
    });
  }

  protected constructLight(): LightBase {
    return new DirectionalLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<DirectionalLight>this.TargetSceneObject).intensity = attr.Value;
    }
  }

  private _onBiasAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<DirectionalLight>this.TargetSceneObject).bias = attr.Value;
    }
  }
}
export default DirectionalLightNode;
