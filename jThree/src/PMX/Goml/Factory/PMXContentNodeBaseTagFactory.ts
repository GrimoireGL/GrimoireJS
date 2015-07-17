import TagFactory = require('../../../Goml/Factories/TagFactory');
import GomlLoader = require('../../../Goml/GomlLoader');
import GomlTreeNodeBase = require('../../../Goml/GomlTreeNodeBase');
import PMXNode = require('./../PMXNode');
class PMXContentNodeBaseFactory extends TagFactory {
	CreateNodeForThis(elem: Element, loader: GomlLoader, parent: GomlTreeNodeBase): GomlTreeNodeBase {
		if (parent.getTypeName() === "PMXNode") {
			var pmx = <PMXNode>parent;
			return new this.nodeType(elem,loader,parent,pmx);
		}
	}
}

export = PMXContentNodeBaseFactory;