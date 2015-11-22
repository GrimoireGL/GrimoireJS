import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import PMXNode = require("../../PMX/Goml/PMXNode");
import PMXBone = require("../../PMX/Core/PMXBone");
import VMDData = require("../Parser/VMDData");
import Vector3 = require("../../Math/Vector3");
import Quaternion = require("../../Math/Quaternion");
import PMXMorph = require("../../PMX/Core/PMXMorph");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import PMXBoneTransformer = require("../../PMX/Core/PMXBoneTransformer");
import JThreeContext = require("../../NJThreeContext");
import ContextComponents = require("../../ContextComponents");
import Timer = require("../../Core/Timer");
class VMDNode extends GomlTreeNodeBase
{
	private targetPMX: PMXNode;

	private targetVMD: VMDData;

	private lastURL:string;

	private enabled:boolean;

	private autoSpeed:number=0;

	private lastTime:number=null;

	private frame:number =0;

	constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
		super(elem, parent);
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
					this.frame = Math.max(0,v.Value);
					if(!this.attributes.getValue("enabled"))return;
					if (this.targetPMX.PMXModelReady&&this.targetVMD) {
						for(var boneName in this.targetVMD.Motions)
						{
							var bone:PMXBone;
							if(bone = this.targetPMX.PMXModel.skeleton.getBoneByName(boneName))
							{
								var current = this.targetVMD.getBoneFrame(this.frame, boneName);
								bone.Transformer.Position = new Vector3(current.position);
								(<PMXBoneTransformer>bone.Transformer).userRotation = new Quaternion(current.rotation);
							}
						}
						for(var morphName in this.targetVMD	.Morphs)
						{
							var morph:PMXMorph;
							if(morph = this.targetPMX.PMXModel.MorphManager.getMorphByName(morphName))
							{
								var morphCurrent = this.targetVMD.getMorphFrame(this.frame, morphName);
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
			},
			"autoSpeed":
			{
				value:"0",
				converter:"number",
				handler:(v)=>{
					this.autoSpeed = v.Value;
				}
			}
		});
	}

	public update()
	{
		if(this.enabled&&this.autoSpeed!==0)
		{
			var timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
			if(this.lastTime===null)
			{
				this.lastTime = timer.Time;
				return;
			}else
			{
				var dt = timer.Time -this.lastTime;
				this.lastTime = timer.Time;
				this.attributes.setValue("frame",this.frame+dt/1000*30*this.autoSpeed);
			}
		}
	}
}

export =VMDNode;
