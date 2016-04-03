import SpotLight from "../../../../Core/SceneObjects/Light/Impl/SpotLight";
import LightNodeBase from "./LightNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class SpotLightNode extends LightNodeBase<SpotLight> {
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
      this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
      this._onInnerAngleAttrChanged.call(this, this.attributes.getAttribute("innerAngle"));
      this._onOuterAngleAttrChanged.call(this, this.attributes.getAttribute("outerAngle"));
      this._onInnerDistanceAttrChanged.call(this, this.attributes.getAttribute("innerDistance"));
      this._onOuterDistanceAttrChanged.call(this, this.attributes.getAttribute("outerDistance"));
      this._onDistanceDecayAttrChanged.call(this, this.attributes.getAttribute("distanceDecay"));
      this._onAngleDecayAttrChanged.call(this, this.attributes.getAttribute("angleDecay"));
    });
  }

  protected __constructLight(): SpotLight {
    return new SpotLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).intensity = attr.Value;
      attr.done();
    }
  }

  private _onInnerAngleAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).innerAngle = attr.Value;
      attr.done();
    }
  }

  private _onOuterAngleAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).outerAngle = attr.Value;
      attr.done();
    }
  }

  private _onInnerDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).innerDistance = attr.Value;
      attr.done();
    }
  }

  private _onOuterDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).outerDistance = attr.Value;
      attr.done();
    }
  }

  private _onDistanceDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).distanceDecay = attr.Value;
      attr.done();
    }
  }

  private _onAngleDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SpotLight>this.TargetSceneObject).angleDecay = attr.Value;
      attr.done();
    }
  }
}

export default SpotLightNode;
