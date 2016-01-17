import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
// import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightBase = require('../../../../Core/Light/LightBase');
import Vector3 = require("../../../../Math/Vector3");

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
