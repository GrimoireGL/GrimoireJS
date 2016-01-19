import Camera = require("../../../../Core/Camera/Camera");
import OrthoCamera = require("../../../../Core/Camera/OrthoCamera");
import GomlTreeCameraNodeBase = require("./CameraNodeBase");

class OrthoCameraNode extends GomlTreeCameraNodeBase {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "left": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Left = attr.Value;
        }
      },
      "right": {
        value: 100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Right = attr.Value;
        }
      },
      "bottom": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Bottom = attr.Value;
        }
      },
      "top": {
        value: 100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Top = attr.Value;
        }
      },
      "near": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Near = attr.Value;
        }
      },
      "far": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          (<OrthoCamera>this.TargetSceneObject).Far = attr.Value;
        }
      }
    });
  }

  protected ConstructCamera(): Camera {
    return new OrthoCamera();
  }

}

export = OrthoCameraNode;
