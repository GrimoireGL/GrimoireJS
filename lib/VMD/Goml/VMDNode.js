import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import VMDData from "../Parser/VMDData";
import Vector3 from "../../Math/Vector3";
import Quaternion from "../../Math/Quaternion";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class VMDNode extends GomlTreeNodeBase {
    constructor() {
        super();
        this._autoSpeed = 0;
        this._lastTime = null;
        this._frame = 0;
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
    __onMount() {
        super.__onMount();
        this._targetPMX = this.__parent;
        this._targetPMX.on("loaded", () => { this.attributes.updateValue(); });
    }
    update() {
        if (this._enabled && this._autoSpeed !== 0) {
            const timer = JThreeContext.getContextComponent(ContextComponents.Timer);
            if (this._lastTime === null) {
                this._lastTime = timer.time;
                return;
            }
            else {
                const dt = timer.time - this._lastTime;
                this._lastTime = timer.time;
                this.attributes.setValue("frame", this._frame + dt / 1000 * 30 * this._autoSpeed);
            }
        }
    }
    _onSrcAttrChanged(attr) {
        if (!attr.Value || attr.Value === this._lastURL) {
            attr.done();
            return;
        }
        if (this._vmdLoadingDeferred) {
            this._vmdLoadingDeferred.resolve(null);
            attr.done();
        }
        this._vmdLoadingDeferred = JThreeContext.getContextComponent(ContextComponents.ResourceLoader).getResourceLoadingDeffered();
        VMDData.loadFromUrl(attr.Value).then((data) => {
            this._lastURL = attr.Value;
            this._targetVMD = data;
            this._vmdLoadingDeferred.resolve(null);
            attr.done();
        });
    }
    _onFrameAttrChanged(attr) {
        this._frame = Math.max(0, attr.Value);
        if (!this.attributes.getValue("enabled")) {
            attr.done();
            return;
        }
        if (this._targetPMX.PMXModelReady && this._targetVMD) {
            for (let boneName in this._targetVMD.Motions) {
                let bone;
                if (bone = this._targetPMX.PMXModel.skeleton.getBoneByName(boneName)) {
                    const current = this._targetVMD.getBoneFrame(this._frame, boneName);
                    bone.Transformer.userTranslation = new Vector3(current.position);
                    bone.Transformer.userRotation = new Quaternion(current.rotation);
                }
            }
            for (let morphName in this._targetVMD.Morphs) {
                let morph;
                if (morph = this._targetPMX.PMXModel.MorphManager.getMorphByName(morphName)) {
                    const morphCurrent = this._targetVMD.getMorphFrame(this._frame, morphName);
                    if (morph) {
                        morph.Progress = morphCurrent.value;
                    }
                }
            }
            attr.done();
        }
        else {
            attr.done();
        }
    }
}
export default VMDNode;
