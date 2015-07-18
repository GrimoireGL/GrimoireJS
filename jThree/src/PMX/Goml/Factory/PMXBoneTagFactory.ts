import JThreeObject = require('../../../Base/JThreeObject');
import GomlLoader = require("../../../Goml/GomlLoader");
import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import SceneNode = require("../../../Goml/Nodes/SceneNode");
import PMXBonesNode = require('../PMXBonesNode');
import SceneObjectNodeBase = require("../../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");

/**
* PMXMorph node factory
*/
class PMXBoneTagFactory extends TagFactory {
	CreateNodeForThis(elem: Element, loader: GomlLoader, parent: GomlTreeNodeBase): GomlTreeNodeBase {
		if (parent.getTypeName() === "PMXBonesNode") {
			var castedParent = <PMXBonesNode>parent;
			return new this.nodeType(elem, loader, parent, castedParent.TargetPMXNode);
		}
	}
}

export =PMXBoneTagFactory;
