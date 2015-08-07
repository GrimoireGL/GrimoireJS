import ViewCamera=require("./ViewCameraBase");
import Matrix = require("../../Math/Matrix");
class OrthoCamera extends ViewCamera
{
  private left:number;
  private right:number;
  private top:number;
  private bottom:number;
  private near:number;
  private far:number;
  private projection:Matrix;
  constructor()
  {
    super();
    this.updateProjection();
  }

  private updateProjection()
  {
    this.projection=Matrix.ortho(this.Left,this.Right,this.Bottom,this.Top,this.Near,this.Far);
  }

    public get Left():number
  {
    return this.left;
  }

    public set Left(left:number)
  {
    this.left=left;
    this.updateProjection();
  }

    public get Right():number
  {
    return this.right;
  }

    public set Right(right:number)
  {
    this.right=right;
    this.updateProjection();
  }

    public get Top():number
  {
    return this.top;
  }

    public set Top(top:number)
  {
    this.top=top;
    this.updateProjection();
  }

    public get Bottom()
  {
    return this.bottom;
  }

    public set Bottom(bottom:number)
  {
    this.bottom=bottom;
    this.updateProjection();
  }

    public get Near():number
  {
    return this.near;
  }

    public set Near(near:number)
  {
    this.near=near;
    this.updateProjection();
  }

    public get Far():number
  {
    return this.far;
  }

    public set Far(far:number)
  {
    this.far=far;
    this.updateProjection();
  }

    public get ProjectionMatrix():Matrix
  {
    return this.projection;
  }
}

export=OrthoCamera;
