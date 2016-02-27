import SceneObjectNodeBase from "../SceneObjectNodeBase";
import LightBase from "../../../../Core/SceneObjects/Light/LightBase";
import GomlAttribute from "../../../GomlAttribute";

class LightNodeBase<T extends LightBase> extends SceneObjectNodeBase<T> {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "color": {
        value: "white",
        converter: "color3",
        onchanged: this._onColorAttrChanged.bind(this),
      }
    });
    this.on("update-scene-object", (obj: LightBase) => {
      this._onColorAttrChanged.call(this, this.attributes.getAttribute("color"));
    });
  }

	/**
	 * Construct target light object when this method was called.
   * This method should be overridden.
	 */
  protected __constructLight(): T {
    return null;
  }

  protected __onMount(): void {
    super.__onMount();
    this.TargetSceneObject = this.__constructLight();
  }

  private _onColorAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<LightBase>this.TargetSceneObject).Color = attr.Value;
      attr.done();
    }
  }
}

export default LightNodeBase;
