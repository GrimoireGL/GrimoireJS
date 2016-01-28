import SceneObjectNodeBase from "../SceneObjectNodeBase";
import Camera from "../../../../Core/Camera/Camera";
import GomlAttribute from "../../../GomlAttribute";

class CameraNodeBase extends SceneObjectNodeBase {
  protected groupPrefix: string = "camera";

  public get TargetCamera(): Camera {
    return <Camera>this.TargetSceneObject;
  }

  constructor() {
    super();
    this.attributes.getAttribute("name").on("changed", this._onNameAttrChanged.bind(this));
  }

  /**
   * Construct camera. This method should be overridden.
   * @return {Camera} [description]
   */
  protected ConstructCamera(): Camera {
    return null;
  }

  /**
   * Construct camera and set to TargetSceneObject.
   * This Node is exported.
   */
  protected onMount(): void {
    super.onMount();
    this.TargetSceneObject = this.ConstructCamera();
  }

  /**
   * Export node when name attribute changed.
   * @param {GomlAttribute} attr [description]
   */
  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    this.nodeExport(name);
  }
}

export default CameraNodeBase;
