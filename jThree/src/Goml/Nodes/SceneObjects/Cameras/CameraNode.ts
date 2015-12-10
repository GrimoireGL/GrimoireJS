import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import CameraNodeBase = require("./CameraNodeBase");

class GomlTreeCameraNode extends CameraNodeBase {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "fovy": {
        value: Math.PI / 4,
        converter: "angle",
        onchanged: (attr) => {
          this.targetPerspective.Fovy = attr.Value;
        },
      },
      "aspect": {
        value: 0,
        converter: "number",
        onchanged: (attr) => {
          this.targetPerspective.Aspect = attr.Value;
        },
      },
      "near": {
        value: 0.1,
        converter: "number",
        onchanged: (attr) => {
          this.targetPerspective.Near = attr.Value;
        },
      },
      "far": {
        value: 10,
        converter: "number",
        onchanged: (attr) => {
          this.targetPerspective.Far = attr.Value;
        },
      },
    });
  }

  private targetPerspective: PerspectiveCamera;

  protected ConstructCamera(): Camera {
    var camera = new PerspectiveCamera();
    this.targetPerspective = camera;
    camera.Fovy = this.Fovy;
    camera.Aspect = this.Aspect;
    camera.Near = this.Near;
    camera.Far = this.Far;
    return camera;
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
}

export = GomlTreeCameraNode;
