import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import PMXNode = require("../../PMX/Goml/PMXNode");
import PMXBone = require("../../PMX/Core/PMXBone");
import VMDData = require("../Parser/VMDData");
import Vector3 = require("../../Math/Vector3");
import Quaternion = require("../../Math/Quaternion");
import PMXMorph = require("../../PMX/Core/PMXMorph");
class VMDNode extends GomlTreeNodeBase
{
	private targetPMX: PMXNode;

	private targetVMD: VMDData;

	private lastURL:string;

	private enabled:boolean;

	constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
		super(elem, loader, parent);
		this.targetPMX = <PMXNode>this.parent;
		this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
		this.attributes.defineAttribute({
			"src":
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
					if(!this.attributes.getValue("enabled"))return;
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
						for(var morphName in this.targetVMD	.Morphs)
						{
							var morph:PMXMorph;
							if(morph = this.targetPMX.PMXModel.MorphManager.getMorphByName(morphName))
							{
								var morphCurrent = this.targetVMD.getMorphFrame(v.Value, morphName);
								if(morph)morph.Progress = morphCurrent.value;
							}
						}
					}
				}
			},
			"enabled":
			{
				value:false,
				converter:"boolean",
				handler:(v)=>{
					this.enabled = v.Value;
				}
			}
		});
	}

	public update()
	{
		console.log("hello update");
	}
}

export =VMDNode;
