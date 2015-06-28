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
import LightBase =require('../../../../Core/Light/LightBase');
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