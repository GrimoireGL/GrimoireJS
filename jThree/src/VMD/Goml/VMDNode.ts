import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import PMXNode from "../../PMX/Goml/PMXNode";
import PMXBone from "../../PMX/Core/PMXBone";
import VMDData from "../Parser/VMDData";
import Vector3 from "../../Math/Vector3";
import Quaternion from "../../Math/Quaternion";
import PMXMorph from "../../PMX/Core/PMXMorph";
import PMXBoneTransformer from "../../PMX/Core/PMXBoneTransformer";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import Timer from "../../Core/Timer";
import Q from "q";
import ResourceLoader from "../../Core/ResourceLoader";

class VMDNode extends GomlTreeNodeBase {
  private targetPMX: PMXNode;

  private targetVMD: VMDData;

  private lastURL: string;

  private enabled: boolean;

  private autoSpeed: number = 0;

  private lastTime: number = null;

  private frame: number = 0;

  private vmdLoadingDeferred: Q.Deferred<void>;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "src": {
        value: "",
        converter: "string",
        onchanged: this._onSrcAttrChanged,
      },
      "frame": {
        value: 0,
        converter: "float",
        onchanged: this._onFrameAttrChanged,
      },
      "enabled": {
        value: false,
        converter: "boolean",
        onchanged: (attr) => {
          this.enabled = attr.Value;
        },
      },
      "autoSpeed": {
        value: "0",
        converter: "float",
        onchanged: (attr) => {
          this.autoSpeed = attr.Value;
        },
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    this.targetPMX = <PMXNode>this.parent;
    this.targetPMX.on('loaded', () => { this.attributes.updateValue(); });
  }

  private _onSrcAttrChanged(attr): void {
    if (!attr.Value || attr.Value == this.lastURL) return;
    if (this.vmdLoadingDeferred) this.vmdLoadingDeferred.resolve(null);
    this.vmdLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered<void>();
    VMDData.LoadFromUrl(attr.Value).then((data) => {
      this.lastURL = attr.Value;
      this.targetVMD = data;
      this.vmdLoadingDeferred.resolve(null);
    });
  }

  private _onFrameAttrChanged(attr): void {
    this.frame = Math.max(0, attr.Value);
    if (!this.attributes.getValue("enabled")) return;
    if (this.targetPMX.PMXModelReady && this.targetVMD) {
      for (var boneName in this.targetVMD.Motions) {
        var bone: PMXBone;
        if (bone = this.targetPMX.PMXModel.skeleton.getBoneByName(boneName)) {
          var current = this.targetVMD.getBoneFrame(this.frame, boneName);
          bone.Transformer.Position = new Vector3(current.position);
          (<PMXBoneTransformer>bone.Transformer).userRotation = new Quaternion(current.rotation);
        }
      }
      for (var morphName in this.targetVMD.Morphs) {
        var morph: PMXMorph;
        if (morph = this.targetPMX.PMXModel.MorphManager.getMorphByName(morphName)) {
          var morphCurrent = this.targetVMD.getMorphFrame(this.frame, morphName);
          if (morph) morph.Progress = morphCurrent.value;
        }
      }
    }
  }

  public update() {
    if (this.enabled && this.autoSpeed !== 0) {
      var timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
      if (this.lastTime === null) {
        this.lastTime = timer.time;
        return;
      } else {
        var dt = timer.time - this.lastTime;
        this.lastTime = timer.time;
        this.attributes.setValue("frame", this.frame + dt / 1000 * 30 * this.autoSpeed);
      }
    }
  }
}

export default VMDNode;
