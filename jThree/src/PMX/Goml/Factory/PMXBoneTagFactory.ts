import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import PMXBonesNode = require("../PMXBonesNode"); /**
* PMXMorph node factory
*/
class PMXBoneTagFactory extends TagFactory {
    public CreateNodeForThis(elem: Element, parent: GomlTreeNodeBase): GomlTreeNodeBase {
		if (parent.getTypeName() === "PMXBonesNode") {
			var castedParent = <PMXBonesNode>parent;
			return new this.nodeType(elem, parent, castedParent.TargetPMXNode);
		}
	}
}

export =PMXBoneTagFactory;
