import JThreeObject = require('../../../Base/JThreeObject');
import GomlLoader = require("../../../Goml/GomlLoader");
import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import SceneNode = require("../../../Goml/Nodes/SceneNode");
import PMXMorphsNode = require('../PMXMorphsNode');
import SceneObjectNodeBase = require("../../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
/**
* PMXMorph node factory
*/
class PMXMorphTagFactory extends TagFactory {
	CreateNodeForThis(elem: Element, loader: GomlLoader, parent: GomlTreeNodeBase): GomlTreeNodeBase {
		if (parent.getTypeName() === "PMXMorphsNode") {
			var castedParent = <PMXMorphsNode>parent;
			return new this.nodeType(elem, loader, parent, castedParent.TargetPMXNode);
		}
	}
}

export =PMXMorphTagFactory;
