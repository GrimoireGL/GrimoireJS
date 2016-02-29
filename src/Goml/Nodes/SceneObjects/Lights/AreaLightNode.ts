import AreaLight from "../../../../Core/SceneObjects/Light/Impl/AreaLight";
import LightNodeBase from "./LightNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class AreaLightNode extends LightNodeBase<AreaLight> {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: this._onIntensityAttrChanged.bind(this),
      }
    });
    this.on("update-scene-object", (obj: AreaLight) => {
      this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
    });
  }

  protected __constructLight(): AreaLight {
    return new AreaLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<AreaLight>this.TargetSceneObject).intensity = attr.Value;
      attr.done();
    }
  }
}

export default AreaLightNode;
