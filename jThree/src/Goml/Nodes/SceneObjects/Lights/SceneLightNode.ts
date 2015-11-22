import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import SceneLight = require('../../../../Core/Light/Impl/SceneLight');
import LightBase =require('../../../../Core/Light/LightBase');
class SceneLightNode extends LightNodeBase
{
	private targetLight:SceneLight;

	constructor(elem: HTMLElement, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.intensity=v.Value;}
			}
		}
	);
	}

	public afterLoad()
	{
		this.attributes.applyDefaultValue();
	}

	protected constructLight():LightBase
	{
		this.targetLight= new SceneLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = SceneLightNode;
