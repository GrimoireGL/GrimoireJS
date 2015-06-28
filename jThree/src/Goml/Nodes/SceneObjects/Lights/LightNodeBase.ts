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

class LightNodeBase extends SceneObjectNodeBase {
	
	private targetNode:
	
	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
		super(elem, loader, parent, parentSceneNode, parentObject);
	}

}