import TagFactory = require('../../Goml/Factories/TagFactory');
import GomlLoader = require('../../Goml/GomlLoader');
import GomlTreeNodeBase = require('../../Goml/GomlTreeNodeBase');
import PMXNode = require('./PMXNode');
class PMXContentNodeBase extends GomlTreeNodeBase {
	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase,pmx:PMXNode) {
		super(elem, loader, parent);
		this.pmxNode = pmx;
		this.pmxNode.onTargetUpdate(this.targetUpdated);
	}

	private pmxNode: PMXNode;

	public get PMXNode()
	{
		return this.pmxNode;
	}

	public get PMXModel()
	{
		return this.pmxNode.PMXModel;
	}

	public get ParentLoaded()
	{
		return this.PMXModel != null;
	}

	private targetUpdated()
	{
		this.attributes.applyDefaultValue();
	}
}

export = PMXContentNodeBase;