import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import SpotLight = require('../../../../Core/Light/Impl/SpotLight');
import LightBase = require('../../../../Core/Light/LightBase');

class SpotLightNode extends LightNodeBase {
  private targetLight: SpotLight;

		constructor() {
    super();
    this.attributes.defineAttribute({
      "intensity": {
        value: 1,
        converter: "number",
      },
      "decay": {
        value: 1,
        converter: "number",
      },
      "inner": {
        value: "10d",
        converter: "angle",
      },
      "outer": {
        value: "25d",
        converter: "angle",
      }
    });
    this.attributes.getAttribute('intensity').on('changed', ((attr) => {
      this.targetLight.intensity = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('decay').on('changed', ((attr) => {
      this.targetLight.decay = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('inner').on('changed', ((attr) => {
      this.targetLight.inner = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('outer').on('changed', ((attr) => {
      this.targetLight.outer = attr.Value;
    }).bind(this));
  }

  protected constructLight(): LightBase {
    this.targetLight = new SpotLight(this.ContainedSceneNode.targetScene);
    return this.targetLight;
  }
}

export = SpotLightNode;
