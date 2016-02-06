import SceneObjectNodeBase from "../SceneObjectNodeBase";
import Camera from "../../../../Core/SceneObjects/Camera/Camera";
import GomlAttribute from "../../../GomlAttribute";

class CameraNodeBase<T extends Camera> extends SceneObjectNodeBase<T> {
  protected groupPrefix: string = "camera";

  constructor() {
    super();
    this.attributes.getAttribute("name").on("changed", this._onNameAttrChanged.bind(this));
  }

  /**
   * Construct camera. This method should be overridden.
   * @return {Camera} [description]
   */
  protected ConstructCamera(): T {
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
