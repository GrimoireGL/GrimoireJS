import LightNodeBase from "./LightNodeBase";
import SceneLight from "../../../../Core/SceneObjects/Light/Impl/SceneLight";
import GomlAttribute from "../../../GomlAttribute";

class SceneLightNode extends LightNodeBase<SceneLight> {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: this._onIntensityAttrChanged.bind(this),
      }
    });
    this.on("update-scene-object", (obj: SceneLight) => {
      this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
    });
  }

  protected __constructLight(): SceneLight {
    return new SceneLight();
  }

  private _onIntensityAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<SceneLight>this.TargetSceneObject).intensity = attr.Value;
      attr.done();
    }
  }
}
export default SceneLightNode;
