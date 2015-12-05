import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import PointLight = require('../../../../Core/Light/Impl/PointLight');
import LightBase =require('../../../../Core/Light/LightBase');
class PointLightNode extends LightNodeBase
{
	private targetLight:PointLight;

		constructor(parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.intensity=v.Value;}
			},
			"decay":
			{
				value:1,converter:"number",handler:(v)=>{this.targetLight.decay=v.Value;}
			},
			"distance":
			{
				value:1,converter:"number",handler:(v)=>{this.targetLight.distance=v.Value;}
			}

		});
	}

	protected constructLight():LightBase
	{
		this.targetLight= new PointLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = PointLightNode;