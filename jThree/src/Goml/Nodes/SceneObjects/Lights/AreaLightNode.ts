import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import AreaLight = require("../../../../Core/Light/Impl/AreaLight");
import LightBase =require('../../../../Core/Light/LightBase');
import Vector3 = require("../../../../Math/Vector3");
class AreaLightNode extends LightNodeBase
{
	private targetLight:AreaLight;

	constructor(elem: HTMLElement, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.intensity=v.Value;}
			},
			"right":{
				value:1,
				converter:"number",
				handler:(v)=>{
					this.targetLight.rightLength = v.Value;
				}
			}
			,
			"top":{
				value: 1,
				converter:"number",
				handler:(v)=>{
					this.targetLight.topLength = v.Value;
				}
			}
			,
			"far":{
				value: 1,
				converter:"number",
				handler:(v)=>{
					this.targetLight.farLength = v.Value;
				}
			}
		});
	}

	protected constructLight():LightBase
	{
		this.targetLight= new AreaLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = AreaLightNode;
