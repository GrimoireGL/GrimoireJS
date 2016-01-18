import LightNodeBase = require("./LightNodeBase");
import PointLight = require("../../../../Core/Light/Impl/PointLight");
import LightBase = require("../../../../Core/Light/LightBase");

class PointLightNode extends LightNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PointLight>this.TargetSceneObject).intensity = attr.Value;
          }
        }
      },
      "decay":
      {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PointLight>this.TargetSceneObject).decay = attr.Value;
          }
        }
      },
      "distance":
      {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PointLight>this.TargetSceneObject).distance = attr.Value;
          }
        }
      }
    });
  }

  protected constructLight(): LightBase {
    return new PointLight();
  }
}

export = PointLightNode;
