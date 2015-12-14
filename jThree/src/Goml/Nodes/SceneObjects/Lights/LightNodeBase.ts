import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import SceneObject = require("../../../../Core/SceneObject");
import LightBase = require('../../../../Core/Light/LightBase');
import Delegate = require('../../../../Base/Delegates');

class LightNodeBase extends SceneObjectNodeBase {

	private targetLightBase: LightBase;

	constructor() {
		super();
		this.attributes.defineAttribute({
			"color": {
				value: "white",
				converter: "color4",
				onchanged: (attr) => {
					this.targetLightBase.Color = attr.Value;
				}
			}
		});
	}

	/**
	 * Construct target light object when this method was called.
	 */
	protected constructLight(): LightBase {
		return null;
	}

	protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
		this.targetLightBase = this.constructLight();
		callbackfn(this.targetLightBase);
	}

}

export = LightNodeBase;
