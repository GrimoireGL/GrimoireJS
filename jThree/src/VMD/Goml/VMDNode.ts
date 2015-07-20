import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import PMXNode = require("../../PMX/Goml/PMXNode");
import PMXBone = require('../../PMX/Core/PMXBone');
import VMDData = require('../Parser/VMDData');
import Vector3 = require('../../Math/Vector3');
import Quaternion = require('../../Math/Quaternion');
class VMDNode extends GomlTreeNodeBase
{
	private targetPMX: PMXNode;

	private targetVMD: VMDData;

	private lastURL:string;

	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
		super(elem, loader, parent);
		this.targetPMX = <PMXNode>this.parent;
		this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
		this.attributes.defineAttribute({
			"url":
			{
				value: "",
				converter: "string",
				handler:(v)=>
				{
					if (!v.Value||v.Value==this.lastURL) return;
					VMDData.LoadFromUrl(v.Value,(data)=>
					{
						this.lastURL=v.Value;
						this.targetVMD = data;
						this.attributes.applyDefaultValue();
					});
				}
			},
			"frame":
			{
				value: 0,
				converter: "number",
				handler: (v) => {
					if (this.targetPMX.PMXModelReady&&this.targetVMD) {
						for(var boneName in this.targetVMD.Motions)
						{
							var bone:PMXBone;
							if(bone = this.targetPMX.PMXModel.Skeleton.getBoneByName(boneName))
							{
								var current = this.targetVMD.getBoneFrame(v.Value, boneName);
								bone.Transformer.Position = new Vector3(current.position);
								bone.Transformer.Rotation = new Quaternion(current.rotation);
							}
						}
					}
				}
			}
		});
	}
}

export =VMDNode;