import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import SceneObject = require("../../../../Core/SceneObject");
import LightBase =require("../../../../Core/Light/LightBase");
class LightNodeBase extends SceneObjectNodeBase {
	
	private targetLightBase:LightBase;
	
	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, loader, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"color":{
				value:"white",converter:"color4",handler:(v)=>{
					this.targetLightBase.Color=v.Value;
				}
			}
		});
	}
	/**
	 * Construct target light object when this method was called.
	 */
	protected constructLight():LightBase
	{
		return null;
	}
	
	protected ConstructTarget():SceneObject
	{
		this.targetLightBase=this.constructLight();
		this.ContainedSceneNode.targetScene.addLight(this.targetLightBase);
		return this.targetLightBase;
	}

}

export = LightNodeBase;