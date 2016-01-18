import DirectionalLight = require("../../../../Core/Light/Impl/DirectionalLight");
import LightNodeBase = require("./LightNodeBase");
import LightBase = require("../../../../Core/Light/LightBase");

class DirectionalLightNode extends LightNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<DirectionalLight>this.TargetSceneObject).intensity = attr.Value;
          }
        }
      },
      "bias": {
        value: 0.01,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<DirectionalLight>this.TargetSceneObject).bias = attr.Value;
          }
        }
      }
    });
  }

  protected constructLight(): LightBase {
    return new DirectionalLight();
  }
}
export = DirectionalLightNode;
