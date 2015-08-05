import GomlLoader = require("../../../Goml/GomlLoader");
import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import PMXBonesNode = require("../PMXBonesNode"); /**
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
