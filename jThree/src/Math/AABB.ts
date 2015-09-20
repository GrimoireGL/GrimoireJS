import Vector3 = require("./Vector3");
/**
 * Axis-Aligned Bounding Box implementation
 */
class AABB
{
  /**
   * AABB's vertex in most left,most bottom,most far.
   * @type {Vector3}
   */
  public pointLBF:Vector3;

  /**
  * AABB's vertex in most right,most top,most near.
  * @type {Vector3}
  */
  public pointRTN:Vector3;

  /**
   * Width of this AABB
   */
  public get Width()
  {
    return Math.abs(this.pointLBF.X - this.pointRTN.X);
  }

  /**
   * Height of this AABB
   */
  public get Height()
  {
    return Math.abs(this.pointLBF.Y - this.pointRTN.Y);
  }

  /**
   * Distance of this AABB
   */
  public get Distance()
  {
    return Math.abs(this.pointLBF.Z - this.pointRTN.Z);
  }


  /**
   * Calculate new bounding box with considering the new point is included.
   * @param  {Vector3} newPoint the point that will be considered that it should be in this bounding box.
   */
  public expandAABB(newPoint:Vector3)
  {
    if(this.pointLBF==null)
    {
      //assume this is first time to be used this AABB instance
      this.pointLBF = Vector3.copy(newPoint);
      this.pointRTN = Vector3.copy(newPoint);
    }
    this.pointLBF.X = Math.min(newPoint.X,this.pointLBF.X);
    this.pointLBF.Y = Math.min(newPoint.Y,this.pointLBF.Y);
    this.pointLBF.Z = Math.min(newPoint.Z,this.pointLBF.Z);

    this.pointRTN.X = Math.max(newPoint.X,this.pointRTN.X);
    this.pointRTN.Y = Math.max(newPoint.Y,this.pointRTN.Y);
    this.pointRTN.Z = Math.max(newPoint.Z,this.pointRTN.Z);
  }

  /**
   * Clean up this AABB with initial value.
   */
  public clear()
  {
    this.pointLBF=null;
    this.pointRTN=null;
  }
}
