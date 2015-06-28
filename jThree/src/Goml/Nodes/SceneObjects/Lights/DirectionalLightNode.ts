import JThreeObject = require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import ViewCamera = require("../../../../Core/Camera/ViewCameraBase");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import SceneObject = require("../../../../Core/SceneObject");
import AttributeParser = require("../../../AttributeParser");
import Vector3 = require("../../../../Math/Vector3");
import LightNodeBase = require('./LightNodeBase');
import DirectionalLight = require('../../../../Core/Light/DirectionalLight');
import LightBase =require('../../../..//Core/Light/LightBase');
class DirectionalLightNode extends LightNodeBase
{
	private targetLight:DirectionalLight;
	
	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, loader, parent, parentSceneNode, parentObject);
		this.attributes.defineAttribute({
			"intensity":{
				value:1,converter:"number",handler:(v)=>{this.targetLight.Intensity=v.Value;}
			}
		});
	}
	
	protected constructLight():LightBase
	{
		this.targetLight= new DirectionalLight();
		return this.targetLight;
	}
}
export = DirectionalLightNode;