import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import GomlTreeCameraNodeBase = require("./CameraNodeBase");

class GomlTreeCameraNode extends GomlTreeCameraNodeBase
{

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      this.attributes.defineAttribute(
        {
          "fovy":{
            value:Math.PI/4,
            converter:"angle",
            handler:(v)=>{this.targetPerspective.Fovy=v.Value;}
          },
          "aspect":{
            value:1,
            converter:"number",
            handler:(v)=>{this.targetPerspective.Aspect=v.Value;}
          },
          "near":
          {
            value:0.1,
            converter:"number",
            handler:(v)=>{this.targetPerspective.Near=v.Value}
          },
          "far":
          {
            value:10,
            converter:"number",
            handler:(v)=>{this.targetPerspective.Far=v.Value}
          }
        }
      );
  }
  private targetPerspective:PerspectiveCamera;

  protected ConstructCamera():Camera
  {
    var camera=new PerspectiveCamera();
    this.targetPerspective=camera;
    camera.Fovy=this.Fovy;
    camera.Aspect=this.Aspect;
    camera.Near=this.Near;
    camera.Far=this.Far;
    return camera;
  }

  get Fovy():number
  {
    return this.attributes.getValue("fovy");
  }

  get Aspect():number
  {
    return this.attributes.getValue("aspect");
  }

  get Near():number
  {
    return this.attributes.getValue("near");
  }

  get Far():number
  {
    return this.attributes.getValue("far");
  }
}

export=GomlTreeCameraNode;
