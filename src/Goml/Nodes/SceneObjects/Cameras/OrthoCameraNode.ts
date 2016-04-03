import OrthoCamera from "../../../../Core/SceneObjects/Camera/OrthoCamera";
import CameraNodeBase from "./CameraNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class OrthoCameraNode extends CameraNodeBase<OrthoCamera> {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "left": {
        value: -100,
        converter: "float",
        onchanged: this._onLeftAttrChanged.bind(this),
      },
      "right": {
        value: 100,
        converter: "float",
        onchanged: this._onRightAttrChanged.bind(this),
      },
      "bottom": {
        value: -100,
        converter: "float",
        onchanged: this._onBottomAttrChanged.bind(this),
      },
      "top": {
        value: 100,
        converter: "float",
        onchanged: this._onTopAttrChanged.bind(this),
      },
      "near": {
        value: -100,
        converter: "float",
        onchanged: this._onNearAttrChanged.bind(this),
      },
      "far": {
        value: -100,
        converter: "float",
        onchanged: this._onFarAttrChanged.bind(this),
      }
    });
    this.on("update-scene-object", (obj: OrthoCamera) => {
      this._onLeftAttrChanged.call(this, this.attributes.getAttribute("left"));
      this._onRightAttrChanged.call(this, this.attributes.getAttribute("right"));
      this._onBottomAttrChanged.call(this, this.attributes.getAttribute("bottom"));
      this._onTopAttrChanged.call(this, this.attributes.getAttribute("top"));
      this._onNearAttrChanged.call(this, this.attributes.getAttribute("near"));
      this._onFarAttrChanged.call(this, this.attributes.getAttribute("far"));
    });
  }

  protected __constructCamera(): OrthoCamera {
    return new OrthoCamera();
  }

  private _onLeftAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Left = attr.Value;
      attr.done();
    }
  }

  private _onRightAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Right = attr.Value;
      attr.done();
    }
  }

  private _onBottomAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Bottom = attr.Value;
      attr.done();
    }
  }

  private _onTopAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Top = attr.Value;
      attr.done();
    }
  }

  private _onNearAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Near = attr.Value;
      attr.done();
    }
  }

  private _onFarAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Far = attr.Value;
      attr.done();
    }
  }
}

export default OrthoCameraNode;
