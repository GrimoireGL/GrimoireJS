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
				converter: "number",
			},
			"decay":
			{
				value: 1,
				converter: "number",
			},
			"distance":
			{
				value: 1,
				converter: "number",
			}
		});
		this.attributes.getAttribute('intensity').on('changed', ((attr) => {
      this.targetLight.intensity = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('decay').on('changed', ((attr) => {
      this.targetLight.decay = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('distance').on('changed', ((attr) => {
      this.targetLight.distance = attr.Value;
    }).bind(this));
	}

	protected constructLight(): LightBase {
		this.targetLight = new PointLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}

export = PointLightNode;
