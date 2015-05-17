import ViewCamera=require('./ViewCameraBase');
import Matrix = require("../../Math/Matrix");
class PerspectiveCamera extends ViewCamera
{
  private fovy:number=Math.PI/4;
  private aspect:number=1;
  private near:number=0.1;
  private far:number=10;
  projection:Matrix;

  private updateProjection()
  {
    this.projection=Matrix.perspective(this.fovy,this.aspect,this.near,this.far);
  }

  get Fovy():number
  {
    return this.fovy;
  }

  set Fovy(fovy:number)
  {
    this.fovy=fovy;
    this.updateProjection();
  }

  get Aspect():number
  {
    return this.aspect;
  }

  set Aspect(aspect:number)
  {
    this.aspect=aspect;
    this.updateProjection();
  }

  get Near():number
  {
    return this.near;
  }
  set Near(near:number)
  {
    this.near=near;
    this.updateProjection();
  }

  get Far():number
  {
    return this.far;
  }

  set Far(far:number)
  {
    this.far=far;
    this.updateProjection();
  }

  get ProjectionMatrix():Matrix
  {
    return this.projection;
  }
}

export=PerspectiveCamera;
