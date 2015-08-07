import GomlLoader = require("../../../Goml/GomlLoader");
import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import PMXMorphsNode = require("../PMXMorphsNode"); /**
* PMXMorph node factory
*/
class PMXMorphTagFactory extends TagFactory {
    public CreateNodeForThis(elem: Element, loader: GomlLoader, parent: GomlTreeNodeBase): GomlTreeNodeBase {
		if (parent.getTypeName() === "PMXMorphsNode") {
			var castedParent = <PMXMorphsNode>parent;
			return new this.nodeType(elem, loader, parent, castedParent.TargetPMXNode);
		}
	}
}

export =PMXMorphTagFactory;
