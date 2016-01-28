import AreaLight from "../../../../Core/Light/Impl/AreaLight";
import LightNodeBase from "./LightNodeBase";
import LightBase from "../../../../Core/Light/LightBase";
import GomlAttribute from "../../../GomlAttribute";

class AreaLightNode extends LightNodeBase {
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
      this._onIntensityAttrChanged.bind(this)(this.attributes.getAttribute("intensity"));
    });
  }

  protected constructLight(): LightBase {
    return new AreaLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<AreaLight>this.TargetSceneObject).intensity = attr.Value;
    }
  }
}

export default AreaLightNode;
