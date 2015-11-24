import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require('./LightNodeBase');
import DirectionalLight = require('../../../../Core/Light/Impl/DirectionalLight');
import LightBase =require('../../../../Core/Light/LightBase');
class DirectionalLightNode extends LightNodeBase
{
	private targetLight:DirectionalLight;

	constructor(elem: HTMLElement, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.intensity=v.Value;}
			},
			"shadow":{
				value:false,
				converter:"boolean",
				handler:(v)=>{
					this.targetLight.isShadowDroppable = v.Value;
				}
			},
			"bias":
			{
				value:0.01,
				converter:"number",
				handler:(v)=>{
					this.targetLight.bias = v.Value;
				}
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
		this.targetLight= new DirectionalLight(this.ContainedSceneNode.targetScene);
		return this.targetLight;
	}
}
export = DirectionalLightNode;
