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
      },
      "aspect": {
        value: 0,
        converter: "number",
      },
      "near": {
        value: 0.1,
        converter: "number",
      },
      "far": {
        value: 10,
        converter: "number",
      },
    });
    this.attributes.getAttribute('fovy').on('changed', ((attr) => {
      this.targetPerspective.Fovy = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('aspect').on('changed', ((attr) => {
      this.targetPerspective.Aspect = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('near').on('changed', ((attr) => {
      this.targetPerspective.Near = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('far').on('changed', ((attr) => {
      this.targetPerspective.Far = attr.Value;
    }).bind(this));
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
