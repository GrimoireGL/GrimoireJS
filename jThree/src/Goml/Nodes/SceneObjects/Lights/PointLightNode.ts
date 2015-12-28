import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import PointLight = require('../../../../Core/Light/Impl/PointLight');
import LightBase = require('../../../../Core/Light/LightBase');

class PointLightNode extends LightNodeBase {
	private targetLight: PointLight;

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
			"decay":
			{
				value: 1,
				converter: "float",
        onchanged: (attr) => {
          this.targetLight.decay = attr.Value;
        }
			},
			"distance":
			{
				value: 1,
				converter: "float",
        onchanged: (attr) => {
          this.targetLight.distance = attr.Value;
        }
			}
		});
	}

	protected constructLight(): LightBase {
		this.targetLight = new PointLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}

export = PointLightNode;
