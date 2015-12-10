import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import SceneObject = require("../../../../Core/SceneObject");
import LightBase = require('../../../../Core/Light/LightBase');

class LightNodeBase extends SceneObjectNodeBase {

	private targetLightBase: LightBase;

	constructor() {
		super();
		this.attributes.defineAttribute({
			"color": {
				value: "white",
				converter: "color4",
			}
		});
		this.attributes.getAttribute('color').on('changed', this._onColorAttrChaged.bind(this));
	}

	private _onColorAttrChaged(attr): void {
		this.targetLightBase.Color = attr.Value;
	}

	/**
	 * Construct target light object when this method was called.
	 */
	protected constructLight(): LightBase {
		return null;
	}

	protected ConstructTarget(): SceneObject {
		this.targetLightBase = this.constructLight();
		return this.targetLightBase;
	}

}

export = LightNodeBase;
