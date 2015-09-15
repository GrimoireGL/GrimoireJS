import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import DirectionalLight = require('../../../../Core/Light/Impl/DirectionalLight');
import LightBase =require('../../../../Core/Light/LightBase');
class DirectionalLightNode extends LightNodeBase
{
	private targetLight:DirectionalLight;

	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, loader, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.intensity=v.Value;}
			}
		});
	}

	protected constructLight():LightBase
	{
		this.targetLight= new DirectionalLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = DirectionalLightNode;
