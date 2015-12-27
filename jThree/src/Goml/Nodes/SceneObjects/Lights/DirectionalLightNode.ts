import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import DirectionalLight = require('../../../../Core/Light/Impl/DirectionalLight');
import LightBase = require('../../../../Core/Light/LightBase');

class DirectionalLightNode extends LightNodeBase {
  private targetLight: DirectionalLight;

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
      "shadow": {
        value: false,
        converter: "boolean",
        onchanged: (attr) => {
          this.targetLight.isShadowDroppable = attr.Value;
        }
      },
      "bias": {
        value: 0.01,
        converter: "float",
        onchanged: (attr) => {
          this.targetLight.bias = attr.Value;
        }
      }
    });
  }

  protected constructLight(): LightBase {
    this.targetLight = new DirectionalLight(this.ContainedSceneNode.targetScene);
    return this.targetLight;
  }
}
export = DirectionalLightNode;
