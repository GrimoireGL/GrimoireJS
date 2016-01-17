import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import SceneLight = require('../../../../Core/Light/Impl/SceneLight');
import LightBase = require('../../../../Core/Light/LightBase');

class SceneLightNode extends LightNodeBase {
	private targetLight: SceneLight;

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
		this.targetLight = new SceneLight();
		return this.targetLight;
	}
}
export = SceneLightNode;
