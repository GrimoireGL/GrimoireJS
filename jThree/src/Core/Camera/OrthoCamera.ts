import ViewCamera=require('./ViewCamera');
import Matrix = require("../../Math/Matrix");
class OrthoCamera extends ViewCamera
{
  left:number;
  right:number;
  top:number;
  bottom:number;
  near:number;
  far:number;
  projection:Matrix;

  private updateProjection()
  {
    this.projection=Matrix.ortho(this.Left,this.Right,this.Bottom,this.Top,this.Near,this.Far);
  }

  get Left():number
  {
    return this.left;
  }

  set Left(left:number)
  {
    this.left=left;
    this.updateProjection();
  }

  get Right():number
  {
    return this.right;
  }

  set Right(right:number)
  {
    this.right=right;
    this.updateProjection();
  }

  get Top():number
  {
    return this.top;
  }

  set Top(top:number)
  {
    this.top=top;
    this.updateProjection();
  }

  get Bottom()
  {
    return this.bottom;
  }

  set Bottom(bottom:number)
  {
    this.bottom=bottom;
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

export=OrthoCamera;
