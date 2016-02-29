import DirectionalLight from "../../../../Core/SceneObjects/Light/Impl/DirectionalLight";
import LightNodeBase from "./LightNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class DirectionalLightNode extends LightNodeBase<DirectionalLight> {
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
      this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
      this._onBiasAttrChanged.call(this, this.attributes.getAttribute("bias"));
    });
  }

  protected __constructLight(): DirectionalLight {
    return new DirectionalLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<DirectionalLight>this.TargetSceneObject).intensity = attr.Value;
      attr.done();
    }
  }

  private _onBiasAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<DirectionalLight>this.TargetSceneObject).bias = attr.Value;
      attr.done();
    }
  }
}
export default DirectionalLightNode;
