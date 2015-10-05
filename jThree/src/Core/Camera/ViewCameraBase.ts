import Camera = require("./Camera");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import SceneObject = require("../SceneObject");
class ViewCameraBase extends Camera
{
  constructor()
  {
    super();
    this.viewMatrix = this.generateviewMatrix(this);
    this.transformer.onUpdateTransform((t,o)=>this.UpdateviewMatrix(<Camera>o));
  }

  private UpdateviewMatrix(cam:Camera):void
  {
    this.viewMatrix = this.generateviewMatrix(cam);
    this.updateViewProjectionMatrix();
  }

  private generateviewMatrix(cam:Camera)
  {
    return Matrix.lookAt(cam.Transformer.GlobalPosition, Vector3.add(cam.Transformer.forward,cam.Transformer.GlobalPosition),cam.Transformer.up);
  }
}

export=ViewCameraBase;
