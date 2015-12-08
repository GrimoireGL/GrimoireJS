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
				value: 1, converter: "number",
			},
			"shadow": {
				value: false,
				converter: "boolean",
			},
			"bias": {
				value: 0.01,
				converter: "number",
			}
		});
		this.attributes.getAttribute('intensity').on('changed', ((attr) => {
      this.targetLight.intensity = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('shadow').on('changed', ((attr) => {
      this.targetLight.isShadowDroppable = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('bias').on('changed', ((attr) => {
      this.targetLight.bias = attr.Value;
    }).bind(this));
	}

	public afterLoad() {
		this.attributes.applyDefaultValue();
	}

	protected constructLight(): LightBase {
		this.targetLight = new DirectionalLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = DirectionalLightNode;
