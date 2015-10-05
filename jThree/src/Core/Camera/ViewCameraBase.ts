import Camera = require("./Camera");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import SceneObject = require("../SceneObject");
import glm = require("gl-matrix");
class ViewCameraBase extends Camera
{
  constructor()
  {
    super();
    this.generateviewMatrix(this);
    this.transformer.onUpdateTransform((t,o)=>this.UpdateviewMatrix(<Camera>o));
  }

  private UpdateviewMatrix(cam:Camera):void
  {
    this.generateviewMatrix(cam);
    this.updateViewProjectionMatrix();
  }

  private generateviewMatrix(cam:Camera)
  {
    glm.mat4.lookAt(this.viewMatrix.rawElements,cam.Transformer.GlobalPosition.rawElements, Vector3.add(cam.Transformer.forward,cam.Transformer.GlobalPosition).rawElements,cam.Transformer.up.rawElements);
  }
}

export=ViewCameraBase;
