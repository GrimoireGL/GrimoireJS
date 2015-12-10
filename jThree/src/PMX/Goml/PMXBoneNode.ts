import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import PMXNode = require("./PMXNode");
import SceneObjectNodeBase = require("../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
import PMXBonesNode = require('./PMXBonesNode');

class PMXBoneNode extends SceneObjectNodeBase {

	private targetPMX: PMXNode;

	protected ConstructTarget() {
		return this.targetSceneObject || null;
	}

	constructor() {
		super();
		this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
		this.attributes.defineAttribute({
			"name": {
				value: "",
				converter: "string",
			}
		});
	}

	private _onNameAttrChanged(attr): void {
		if (!this.targetPMX.PMXModelReady) return;
		var bone = this.targetPMX.PMXModel.skeleton.getBoneByName(attr.Value);
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

	private _onParentAdded(parent): void {
		if (parent.getTypeName() === "PMXBonesNode") {
			this.targetPMX = (<PMXBonesNode>parent).TargetPMXNode;
		}
	}
}

export =PMXBoneNode;
