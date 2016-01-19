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
        value: 0.2,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.innerAngle = attr.Value;
        }
      },
      "outerAngle": {
        value: 0.5,
        converter: "angle",
        onchanged: (attr) => {
          this.targetLight.outerAngle = attr.Value;
        }
      },
      "innerDistance": {
        value: 4,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.innerDistance = attr.Value;
        }
      },
      "outerDistance": {
        value: 15,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.outerDistance = attr.Value;
        }
      },
      "distanceDecay": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.distanceDecay = attr.Value;
        }
      },
      "angleDecay": {
        value: 1,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.angleDecay = attr.Value;
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
