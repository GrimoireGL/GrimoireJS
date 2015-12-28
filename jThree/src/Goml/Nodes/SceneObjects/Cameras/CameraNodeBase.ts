import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import SceneObject = require("../../../../Core/SceneObject");
import Delegate = require('../../../../Base/Delegates');

class CameraNodeBase extends SceneObjectNodeBase {
  private targetCamera: Camera;

  public get TargetCamera(): Camera {
    return this.targetCamera;
  }

  constructor() {
    super();
  }

  protected ConstructCamera(): Camera {
    return null;
  }

  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
    this.targetCamera = this.ConstructCamera();
    callbackfn(this.targetCamera);
  }

  protected onMount(): void {
    super.onMount();
    this.nodeManager.nodeRegister.addObject("jthree.camera", this.Name, this);
  }

  private name: string;
  /**
  * GOML Attribute
  * Identical Name for camera
  */
  public get Name(): string {
    return this.attributes.getValue('name');
  }
}

export = CameraNodeBase;
