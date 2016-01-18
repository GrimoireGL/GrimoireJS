import LightNodeBase = require("./LightNodeBase");
import SceneLight = require("../../../../Core/Light/Impl/SceneLight");
import LightBase = require("../../../../Core/Light/LightBase");

class SceneLightNode extends LightNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<SceneLight>this.TargetSceneObject).intensity = attr.Value;
          }
        }
      }
    });
  }

  protected constructLight(): LightBase {
    return new SceneLight();
  }
}
export = SceneLightNode;
