import SpotLight = require("../../../../Core/Light/Impl/SpotLight");
import LightNodeBase = require("./LightNodeBase");
// import SpotLight = require('../../../../Core/Light/Impl/SpotLight');
import LightBase = require("../../../../Core/Light/LightBase");

class SpotLightNode extends LightNodeBase {
  private targetLight: SpotLight;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.intensity = attr.Value;
        }
      },
      "innerAngle": {
        value: 1.744,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.innerAngle = attr.Value;
        }
      },
      "outerAngle": {
        value: 2.5,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.outerAngle = attr.Value;
        }
      },
      "innerDistance": {
        value: 3,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.innerDistance = attr.Value;
        }
      },
      "outerDistance": {
        value: 5,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.outerDistance = attr.Value;
        }
      }
    });
  }

  protected constructLight(): LightBase {
    this.targetLight = new SpotLight();
    return this.targetLight;
  }
}

export = SpotLightNode;
