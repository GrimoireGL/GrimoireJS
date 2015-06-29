import Camera = require("./Camera");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import SceneObject = require("../SceneObject");
class ViewCameraBase extends Camera
{
  constructor()
  {
    super();
    this.position=new Vector3(0,0,0);
    this.lookAt=new Vector3(0,0,-1);
    this.updir=new Vector3(0,1,0);
    this.UpdateViewMatrix();
    this.transformer.onUpdateTransform((o)=>this.UpdateViewMatrix(o));
  }
  //ViewMatix paramaters
  position:Vector3;
  lookAt:Vector3;
  updir:Vector3;
  viewMatrix:Matrix;

  get Position():Vector3
  {
    return this.position;
  }

  set Position(vec:Vector3)
  {
    this.position=vec;
    this.UpdateViewMatrix();
  }

  get LookAt():Vector3
  {
    return this.lookAt;
  }

  set LookAt(vec:Vector3)
  {
    this.lookAt=vec;
    this.UpdateViewMatrix();
  }

  get UpDirection():Vector3
  {
    return this.updir;
  }

  set UpDirection(vec:Vector3)
  {
    this.updir=vec;
    this.UpdateViewMatrix();
  }

  get ViewMatrix():Matrix
  {
    return this.viewMatrix;
  }

  private UpdateViewMatrix(obj?:SceneObject):void
  {
    var cam:Camera=<Camera>obj||this;//To avoid to get this
    var newPos=Vector3.add(cam.Position,this.transformer.Position);
    var pos2la=Vector3.subtract(cam.LookAt,cam.Position);
    pos2la=Matrix.transformNormal(Matrix.RotationQuaternion(this.transformer.Rotation),pos2la);
    var newLa=Vector3.add(newPos,pos2la);
    var newUp=Matrix.transformNormal(Matrix.RotationQuaternion(this.transformer.Rotation),this.updir);
    this.viewMatrix=Matrix.lookAt(newPos,newLa,newUp);
  }
}

export=ViewCameraBase;
