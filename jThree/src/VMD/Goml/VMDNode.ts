import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import PMXNode = require("../../PMX/Goml/PMXNode");
import PMXBone = require("../../PMX/Core/PMXBone");
import VMDData = require("../Parser/VMDData");
import Vector3 = require("../../Math/Vector3");
import Quaternion = require("../../Math/Quaternion");
import PMXMorph = require("../../PMX/Core/PMXMorph");
import PMXBoneTransformer = require("../../PMX/Core/PMXBoneTransformer");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import Timer = require("../../Core/Timer");
import Q = require("q");
import ResourceLoader = require("../../Core/ResourceLoader");

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
        converter: "number",
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
        converter: "number",
        onchanged: (attr) => {
          this.autoSpeed = attr.Value;
        },
      }
    });
  }

  protected nodeWillMount(parent): void {
    this.targetPMX = parent;
    this.targetPMX.on('loaded', () => { this.attributes.updateValue(); });
  }

  private _onSrcAttrChanged(attr): void {
    if (!attr.Value || attr.Value == this.lastURL) return;
    if (this.vmdLoadingDeferred) this.vmdLoadingDeferred.resolve(null);
    this.vmdLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered();
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
        this.lastTime = timer.Time;
        return;
      } else {
        var dt = timer.Time - this.lastTime;
        this.lastTime = timer.Time;
        this.attributes.setValue("frame", this.frame + dt / 1000 * 30 * this.autoSpeed);
      }
    }
  }
}

export =VMDNode;
