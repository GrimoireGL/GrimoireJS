import Camera = require("../../../../Core/Camera/Camera");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import CameraNodeBase = require("./CameraNodeBase");

class CameraNode extends CameraNodeBase {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "fovy": {
        value: Math.PI / 4,
        converter: "angle",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PerspectiveCamera>this.TargetSceneObject).Fovy = attr.Value;
          }
        },
      },
      "aspect": {
        value: 0,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PerspectiveCamera>this.TargetSceneObject).Aspect = attr.Value;
          }
        },
      },
      "near": {
        value: 0.1,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PerspectiveCamera>this.TargetSceneObject).Near = attr.Value;
          }
        },
      },
      "far": {
        value: 10,
        converter: "float",
        onchanged: (attr) => {
          if (this.TargetSceneObject) {
            (<PerspectiveCamera>this.TargetSceneObject).Far = attr.Value;
          }
        },
      },
    });
  }

  protected ConstructCamera(): Camera {
    return new PerspectiveCamera();
  }

  protected onMount(): void {
    super.onMount();
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

export = CameraNode;
