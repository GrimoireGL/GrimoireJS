import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import PointLight = require('../../../../Core/Light/Impl/PointLight');
import LightBase =require('../../../../Core/Light/LightBase');
class PointLightNode extends LightNodeBase
{
	private targetLight:PointLight;

		constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, loader, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.Intensity=v.Value;}
			},
			"decay":
			{
				value:1,converter:"number",handler:(v)=>{this.targetLight.Decay=v.Value;}
			},
			"distance":
			{
				value:1,converter:"number",handler:(v)=>{this.targetLight.Distance=v.Value;}
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
