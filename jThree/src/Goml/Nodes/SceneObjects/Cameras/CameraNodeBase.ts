import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import SceneObject = require("../../../../Core/SceneObject");
import Delegate = require('../../../../Base/Delegates');

class GomlTreeCameraNodeBase extends SceneObjectNodeBase {
  private targetCamera: Camera;

  public get TargetCamera(): Camera {
    return this.targetCamera;
  }

  constructor() {
    super();
    this.nodeManager.nodeRegister.addObject("jthree.camera", this.Name, this);
  }

  protected ConstructCamera(): Camera {
    return null;
  }

  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
    this.targetCamera = this.ConstructCamera();
    callbackfn(this.targetCamera);
  }

  protected nodeWillMount(parent) {
    super.nodeWillMount(parent);
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

export =GomlTreeCameraNodeBase;
