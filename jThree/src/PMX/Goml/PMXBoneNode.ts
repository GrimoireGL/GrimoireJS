import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import PMXNode = require('./PMXNode');
import SceneObjectNodeBase = require('../../Goml/Nodes/SceneObjects/SceneObjectNodeBase');
class PMXBoneNode extends SceneObjectNodeBase {

	private targetPMX: PMXNode;

	protected ConstructTarget()
	{
		return this.targetSceneObject;
	}

	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, pmx: PMXNode) {
		super(elem, loader, parent,pmx.ContainedSceneNode,pmx);
		this.targetPMX = pmx;
		this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
		this.attributes.defineAttribute({
			"name":
			{
				value: "",
				converter: "string",
				handler:(v)=>
				{
					if (!this.targetPMX.PMXModelReady) return;
					var bone = this.targetPMX.PMXModel.Skeleton.getBoneByName(v.Value);
					if(bone!=null&&bone!=this.targetSceneObject)
					{
						this.targetSceneObject = bone;
						super.beforeLoad();
					}
				}
			}
		});
	}
}

export =PMXBoneNode;
