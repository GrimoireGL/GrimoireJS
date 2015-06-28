import JThreeObject = require('Base/JThreeObject');
import AttributeParser = require("../../../AttributeParser");
import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import ViewCamera = require("../../../../Core/Camera/ViewCameraBase");
import OrthoCamera = require("../../../../Core/Camera/OrthoCamera");
import SceneObject = require("../../../../Core/SceneObject");
import GomlTreeCameraNodeBase = require("./CameraNodeBase");
import Quaternion = require("../../../../Math/Quaternion");
import Vector3 = require("../../../../Math/Vector3");
class OrthoCameraNode extends GomlTreeCameraNodeBase {

  constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase, parentSceneNode: GomlTreeSceneNode, parentObject: SceneObjectNodeBase) {
    super(elem, loader, parent, parentSceneNode, parentObject);
    this.attributes.defineAttribute(
      {
        "left": {
          value: -100,
          converter: "number",
          handler: (v) => {
            this.targetOrtho.Left = v.Value;
          }
        },
        "right": {
          value: 100,
          converter: "number",
          handler: (v) => {
            this.targetOrtho.Right = v.Value;
          }
        },
         "bottom": {
          value: -100,
          converter: "number",
          handler: (v) => {
            this.targetOrtho.Bottom = v.Value;
          }
        }, 
        "top": {
          value: 100,
          converter: "number",
          handler: (v) => {
            this.targetOrtho.Top = v.Value;
          }
         },
          "near": {
            value: -100,
            converter: "number",
            handler: (v) => {
              this.targetOrtho.Near = v.Value;
            }
          },
          "far": {
            value: -100,
            converter: "number",
            handler: (v) => {
              this.targetOrtho.Far = v.Value;
            }
          }
      }
      );
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

export =OrthoCameraNode;
