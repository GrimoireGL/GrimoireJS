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


  public expandAABB(newPoint:Vector3)
  {
    this.pointLBF.X = Math.min(newPoint.X,this.pointLBF.X);
    this.pointLBF.Y = Math.min(newPoint.Y,this.pointLBF.Y);
    this.pointLBF.Z = Math.min(newPoint.Z,this.pointLBF.Z);

    this.pointRTN.X = Math.max(newPoint.X,this.pointRTN.X);
    this.pointRTN.Y = Math.max(newPoint.Y,this.pointRTN.Y);
    this.pointRTN.Z = Math.max(newPoint.Z,this.pointRTN.Z);
  }
}
