import LightNodeBase from "./LightNodeBase";
import PointLight from "../../../../Core/SceneObjects/Light/Impl/PointLight";
import GomlAttribute from "../../../GomlAttribute";

class PointLightNode extends LightNodeBase<PointLight> {
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
      this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
      this._onDecayAttrChanged.call(this, this.attributes.getAttribute("decay"));
      this._onDistanceAttrChanged.call(this, this.attributes.getAttribute("distance"));
    });
  }

  protected __constructLight(): PointLight {
    return new PointLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).intensity = attr.Value;
      attr.done();
    }
  }

  private _onDecayAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).decay = attr.Value;
      attr.done();
    }
  }

  private _onDistanceAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PointLight>this.TargetSceneObject).distance = attr.Value;
      attr.done();
    }
  }
}

export default PointLightNode;
