import SpotLight from "../../../../Core/Light/Impl/SpotLight";
import LightNodeBase from "./LightNodeBase";
import LightBase from "../../../../Core/Light/LightBase";
import GomlAttribute from "../../../GomlAttribute";

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
    this.on("update-scene-object", (obj: SpotLight) => {
      this._onIntensityAttrChanged.bind(this)(this.attributes.getAttribute("intensity"));
      this._onInnerAngleAttrChanged.bind(this)(this.attributes.getAttribute("innerAngle"));
      this._onOuterAngleAttrChanged.bind(this)(this.attributes.getAttribute("outerAngle"));
      this._onInnerDistanceAttrChanged.bind(this)(this.attributes.getAttribute("innerDistance"));
      this._onOuterDistanceAttrChanged.bind(this)(this.attributes.getAttribute("outerDistance"));
      this._onDistanceDecayAttrChanged.bind(this)(this.attributes.getAttribute("distanceDecay"));
      this._onAngleDecayAttrChanged.bind(this)(this.attributes.getAttribute("angleDecay"));
    });
  }

  protected constructLight(): LightBase {
    return new SpotLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).intensity = attr.Value;
    }
  }

  private _onInnerAngleAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).innerAngle = attr.Value;
    }
  }

  private _onOuterAngleAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).outerAngle = attr.Value;
    }
  }

  private _onInnerDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).innerDistance = attr.Value;
    }
  }

  private _onOuterDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).outerDistance = attr.Value;
    }
  }

  private _onDistanceDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).distanceDecay = attr.Value;
    }
  }

  private _onAngleDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).angleDecay = attr.Value;
    }
  }
}

export default SpotLightNode;
