import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightNodeBase = require("./LightNodeBase");
import LightBase = require("../../../../Core/Light/LightBase");

class AreaLightNode extends LightNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<AreaLight>this.TargetSceneObject).intensity = attr.Value;
          }
        }
      }
    });
  }

  protected constructLight(): LightBase {
    return new AreaLight();
  }
}

export = AreaLightNode;
