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
  private _targetPMX: PMXNode;

  private _targetVMD: VMDData;

  private _lastURL: string;

  private _enabled: boolean;

  private _autoSpeed: number = 0;

  private _lastTime: number = null;

  private _frame: number = 0;

  private _vmdLoadingDeferred: Q.Deferred<void>;

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
          this._enabled = attr.Value;
          attr.done();
        },
      },
      "autoSpeed": {
        value: "0",
        converter: "float",
        onchanged: (attr) => {
          this._autoSpeed = attr.Value;
          attr.done();
        },
      }
    });
  }

  protected __onMount(): void {
    super.__onMount();
    this._targetPMX = <PMXNode>this.__parent;
    this._targetPMX.on("loaded", () => {
      this.attributes.getAttribute("frame").notifyValueChanged();
    });
  }

  public update(): void {
    if (this._enabled && this._autoSpeed !== 0) {
      const timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
      if (this._lastTime === null) {
        this._lastTime = timer.time;
        return;
      } else {
        const dt = timer.time - this._lastTime;
        this._lastTime = timer.time;
        this.attributes.setValue("frame", this._frame + dt / 1000 * 30 * this._autoSpeed);
      }
    }
  }

  private _onSrcAttrChanged(attr): void {
    if (!attr.Value || attr.Value === this._lastURL) {
      attr.done();
      return;
    }
    if (this._vmdLoadingDeferred) {
      this._vmdLoadingDeferred.resolve(null);
      attr.done();
    }
    this._vmdLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered<void>();
    VMDData.loadFromUrl(attr.Value).then((data) => {
      this._lastURL = attr.Value;
      this._targetVMD = data;
      this._vmdLoadingDeferred.resolve(null);
      this.attributes.getAttribute("frame").notifyValueChanged();
      attr.done();
    });
  }

  private _onFrameAttrChanged(attr): void {
    this._frame = Math.max(0, attr.Value);
    if (!this.attributes.getValue("enabled")) {
      attr.done();
      return;
    }
    if (this._targetPMX.PMXModelReady && this._targetVMD) {
      for (let boneName in this._targetVMD.Motions) {
        let bone: PMXBone;
        if (bone = this._targetPMX.PMXModel.skeleton.getBoneByName(boneName)) {
          const current = this._targetVMD.getBoneFrame(this._frame, boneName);
          (<PMXBoneTransformer>bone.Transformer).userTranslation = new Vector3(current.position);
          (<PMXBoneTransformer>bone.Transformer).userRotation = new Quaternion(current.rotation);
        }
      }
      for (let morphName in this._targetVMD.Morphs) {
        let morph: PMXMorph;
        if (morph = this._targetPMX.PMXModel.MorphManager.getMorphByName(morphName)) {
          const morphCurrent = this._targetVMD.getMorphFrame(this._frame, morphName);
          if (morph) {
            morph.Progress = morphCurrent.value;
          }
        }
      }
      attr.done();
    } else {
      attr.done();
    }
  }
}

export default VMDNode;
