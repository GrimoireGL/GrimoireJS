import PerspectiveCamera from "../../../../Core/SceneObjects/Camera/PerspectiveCamera";
import CameraNodeBase from "./CameraNodeBase";
import GomlAttribute from "../../../GomlAttribute";

class CameraNode extends CameraNodeBase<PerspectiveCamera> {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "fovy": {
        value: Math.PI / 4,
        converter: "angle",
        onchanged: this._onFovyAttrChanged.bind(this),
      },
      "aspect": {
        value: 0,
        converter: "float",
        onchanged: this._onAspectAttrChanged.bind(this),
      },
      "near": {
        value: 0.1,
        converter: "float",
        onchanged: this._onNearAttrChanged.bind(this),
      },
      "far": {
        value: 10,
        converter: "float",
        onchanged: this._onFarAttrChanged.bind(this),
      },
    });
    this.on("update-scene-object", (obj: PerspectiveCamera) => {
      this._onFovyAttrChanged.call(this, this.attributes.getAttribute("fovy"));
      this._onAspectAttrChanged.call(this, this.attributes.getAttribute("aspect"));
      this._onNearAttrChanged.call(this, this.attributes.getAttribute("near"));
      this._onFarAttrChanged.call(this, this.attributes.getAttribute("far"));
    });
  }

  protected __constructCamera(): PerspectiveCamera {
    return new PerspectiveCamera();
  }

  protected __onMount(): void {
    super.__onMount();
  }

  public get Fovy(): number {
    return this.attributes.getValue("fovy");
  }

  public get Aspect(): number {
    return this.attributes.getValue("aspect");
  }

  public get Near(): number {
    return this.attributes.getValue("near");
  }

  public get Far(): number {
    return this.attributes.getValue("far");
  }

  private _onFovyAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PerspectiveCamera>this.TargetSceneObject).Fovy = attr.Value;
      attr.done();
    }
  }

  private _onAspectAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PerspectiveCamera>this.TargetSceneObject).Aspect = attr.Value;
      attr.done();
    }
  }

  private _onNearAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PerspectiveCamera>this.TargetSceneObject).Near = attr.Value;
      attr.done();
    }
  }

  private _onFarAttrChanged(attr: GomlAttribute): void {
    if (this.TargetSceneObject) {
      (<PerspectiveCamera>this.TargetSceneObject).Far = attr.Value;
      attr.done();
    }
  }
}

export default CameraNode;
