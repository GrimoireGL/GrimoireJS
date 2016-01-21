import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import LightBase = require("../../../../Core/Light/LightBase");
import GomlAttribute = require("../../../GomlAttribute");

class LightNodeBase extends SceneObjectNodeBase {
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
      this._onColorAttrChanged.bind(this)(this.attributes.getAttribute("color"));
    });
  }

	/**
	 * Construct target light object when this method was called.
   * This method should be overridden.
	 */
  protected constructLight(): LightBase {
    return null;
  }

  protected onMount(): void {
    super.onMount();
    this.TargetSceneObject = this.constructLight();
  }

  private _onColorAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<LightBase>this.TargetSceneObject).Color = attr.Value;
    }
  }
}

export = LightNodeBase;
