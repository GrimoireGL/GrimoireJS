import Camera from "../../../../Core/SceneObjects/Camera/Camera";
import OrthoCamera from "../../../../Core/SceneObjects/Camera/OrthoCamera";
import GomlTreeCameraNodeBase from "./CameraNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class OrthoCameraNode extends GomlTreeCameraNodeBase {

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
      this._onLeftAttrChanged.bind(this)(this.attributes.getAttribute("left"));
      this._onRightAttrChanged.bind(this)(this.attributes.getAttribute("right"));
      this._onBottomAttrChanged.bind(this)(this.attributes.getAttribute("bottom"));
      this._onTopAttrChanged.bind(this)(this.attributes.getAttribute("top"));
      this._onNearAttrChanged.bind(this)(this.attributes.getAttribute("near"));
      this._onFarAttrChanged.bind(this)(this.attributes.getAttribute("far"));
    });
  }

  protected ConstructCamera(): Camera {
    return new OrthoCamera();
  }

  private _onLeftAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Left = attr.Value;
    }
  }

  private _onRightAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Right = attr.Value;
    }
  }

  private _onBottomAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Bottom = attr.Value;
    }
  }

  private _onTopAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Top = attr.Value;
    }
  }

  private _onNearAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Near = attr.Value;
    }
  }

  private _onFarAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<OrthoCamera>this.TargetSceneObject).Far = attr.Value;
    }
  }
}

export default OrthoCameraNode;
