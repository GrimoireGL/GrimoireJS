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
        converter: "number",
      },
      "right": {
        value: 100,
        converter: "number",
      },
      "bottom": {
        value: -100,
        converter: "number",
      },
      "top": {
        value: 100,
        converter: "number",
      },
      "near": {
        value: -100,
        converter: "number",
      },
      "far": {
        value: -100,
        converter: "number",
      }
    });
    this.attributes.getAttribute('left').on('changed', ((attr) => {
      this.targetOrtho.Left = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('right').on('changed', ((attr) => {
      this.targetOrtho.Right = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('bottom').on('changed', ((attr) => {
      this.targetOrtho.Bottom = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('top').on('changed', ((attr) => {
      this.targetOrtho.Top = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('near').on('changed', ((attr) => {
      this.targetOrtho.Near = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('far').on('changed', ((attr) => {
      this.targetOrtho.Far = attr.Value;
    }).bind(this));
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
