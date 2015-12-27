import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
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
          this.targetOrtho.Left = attr.Value;
        }
      },
      "right": {
        value: 100,
        converter: "float",
        onchanged: (attr) => {
          this.targetOrtho.Right = attr.Value;
        }
      },
      "bottom": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          this.targetOrtho.Bottom = attr.Value;
        }
      },
      "top": {
        value: 100,
        converter: "float",
        onchanged: (attr) => {
          this.targetOrtho.Top = attr.Value;
        }
      },
      "near": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          this.targetOrtho.Near = attr.Value;
        }
      },
      "far": {
        value: -100,
        converter: "float",
        onchanged: (attr) => {
          this.targetOrtho.Far = attr.Value;
        }
      }
    });
  }

  private targetOrtho: OrthoCamera;

  protected ConstructCamera(): Camera {
    var camera = new OrthoCamera();
    this.targetOrtho = camera;
    camera.Left = this.attributes.getValue("left");
    camera.Bottom = this.attributes.getValue("right");
    camera.Top = this.attributes.getValue("top");
    camera.Right = this.attributes.getValue("right");
    camera.Far = this.attributes.getValue('far');
    camera.Near = this.attributes.getValue('near');
    return camera;
  }

}

export = OrthoCameraNode;
