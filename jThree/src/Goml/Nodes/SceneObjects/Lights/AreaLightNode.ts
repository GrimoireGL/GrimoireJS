import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightBase = require('../../../../Core/Light/LightBase');
import Vector3 = require("../../../../Math/Vector3");

class AreaLightNode extends LightNodeBase {
	private targetLight: AreaLight;

	constructor() {
		super();
		this.attributes.defineAttribute({
			"intensity": {
				value: 1,
				converter: "number",
			},
			"right": {
				value: 1,
				converter: "number",
			}
			,
			"top": {
				value: 1,
				converter: "number",
			}
			,
			"far": {
				value: 1,
				converter: "number",
			}
		});
		this.attributes.getAttribute('intensity').on('changed', ((attr) => {
			this.targetLight.intensity = attr.Value;
		}).bind(this));
		this.attributes.getAttribute('right').on('changed', ((attr) => {
			this.targetLight.rightLength = attr.Value;
		}).bind(this));
		this.attributes.getAttribute('top').on('changed', ((attr) => {
			this.targetLight.topLength = attr.Value;
		}).bind(this));
		this.attributes.getAttribute('far').on('changed', ((attr) => {
			this.targetLight.farLength = attr.Value;
		}).bind(this));
	}

	protected constructLight(): LightBase {
		this.targetLight = new AreaLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}

export = AreaLightNode;
