import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import Camera = require("../../../../Core/Camera/Camera");

class CameraNodeBase extends SceneObjectNodeBase {
  protected groupPrefix: string = "camera";

  public get TargetCamera(): Camera {
    return <Camera>this.TargetSceneObject;
  }

  constructor() {
    super();
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
    let name = this.attributes.getValue("name");
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: camera name must be requied.`);
    }
    this.nodeExport(name);
  }
}

export = CameraNodeBase;
