import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import PMXNode = require("./PMXNode");
import SceneObjectNodeBase = require("../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");

class PMXBoneNode extends SceneObjectNodeBase {

	private targetPMX: PMXNode;

	protected ConstructTarget() {
		return this.targetSceneObject || null;
	}

	constructor(elem: HTMLElement, parent: GomlTreeNodeBase, pmx: PMXNode) {
		super(elem, parent, pmx.ContainedSceneNode, pmx);
		this.targetPMX = pmx;
		this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
		this.attributes.defineAttribute({
			"name":
			{
				value: "",
				converter: "string",
				handler: (v) => {
					if (!this.targetPMX.PMXModelReady) return;
					var bone = this.targetPMX.PMXModel.skeleton.getBoneByName(v.Value);
					if (bone != null && bone != this.targetSceneObject) {
						this.targetSceneObject = bone;
						if (this.children) {
							for (var i = 0; i < this.children.length; i++) {
								(<SceneObjectNodeBase>this.children[i]).TargetObject.Transformer.Position=bone.Transformer.LocalOrigin;
								(<SceneObjectNodeBase>this.children[i]).parentChanged();
							}
						}

					}
				}
			}
		});
	}
}

export =PMXBoneNode;
