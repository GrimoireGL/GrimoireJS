import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import LightBase = require("../../../../Core/Light/LightBase");

class LightNodeBase extends SceneObjectNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "color": {
        value: "white",
        converter: "color3",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<LightBase>this.TargetSceneObject).Color = attr.Value;
          }
        }
      }
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
}

export = LightNodeBase;
