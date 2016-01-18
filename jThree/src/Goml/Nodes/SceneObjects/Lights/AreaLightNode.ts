import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightNodeBase = require("./LightNodeBase");
// import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightBase = require("../../../../Core/Light/LightBase");

class AreaLightNode extends LightNodeBase {
  private targetLight: AreaLight;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.intensity = attr.Value;
        }
      }
    });
  }

  protected constructLight(): LightBase {
    this.targetLight = new AreaLight();
    return this.targetLight;
  }
}

export = AreaLightNode;
