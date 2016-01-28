import LightNodeBase from "./LightNodeBase";
import PointLight from "../../../../Core/Light/Impl/PointLight";
import LightBase from "../../../../Core/Light/LightBase";
import GomlAttribute from "../../../GomlAttribute";

class PointLightNode extends LightNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: this._onIntensityAttrChanged.bind(this),
      },
      "decay":
      {
        value: 1,
        converter: "float",
        onchanged: this._onDecayAttrChanged.bind(this),
      },
      "distance":
      {
        value: 1,
        converter: "float",
        onchanged: this._onDistanceAttrChanged.bind(this),
      }
    });
    this.on("update-scene-object", (obj: PointLight) => {
      this._onIntensityAttrChanged.bind(this)(this.attributes.getAttribute("intensity"));
      this._onDecayAttrChanged.bind(this)(this.attributes.getAttribute("decay"));
      this._onDistanceAttrChanged.bind(this)(this.attributes.getAttribute("distance"));
    });
  }

  protected constructLight(): LightBase {
    return new PointLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).intensity = attr.Value;
    }
  }

  private _onDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).decay = attr.Value;
    }
  }

  private _onDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).distance = attr.Value;
    }
  }
}

export default PointLightNode;
