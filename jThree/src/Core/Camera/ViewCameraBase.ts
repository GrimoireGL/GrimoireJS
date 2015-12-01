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
    this._generateViewMatrix(this);
    this.transformer.onUpdateTransform((t,o)=>this._updateViewProjectionMatrix(<Camera>o));
  }

  private _updateViewProjectionMatrix(cam:Camera):void
  {
    this._generateViewMatrix(cam);
    this.__updateViewProjectionMatrix();
  }

  private _generateViewMatrix(cam:Camera)
  {
    glm.mat4.lookAt(this.viewMatrix.rawElements,cam.Transformer.GlobalPosition.rawElements, Vector3.add(cam.Transformer.forward,cam.Transformer.GlobalPosition).rawElements,cam.Transformer.up.rawElements);
  }
}

export=ViewCameraBase;
