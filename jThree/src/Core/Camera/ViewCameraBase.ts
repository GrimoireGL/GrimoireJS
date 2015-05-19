import Camera = require("./Camera");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
class ViewCameraBase extends Camera
{
  constructor()
  {
    super();
    this.position=new Vector3(0,0.4,1);
    this.lookAt=new Vector3(0,0,0);
    this.updir=new Vector3(0,1,0);
    this.UpdateViewMatrix();
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

  private UpdateViewMatrix():void
  {
    this.viewMatrix=Matrix.lookAt(this.position,this.lookAt,this.updir);
  }
}

export=ViewCameraBase;
