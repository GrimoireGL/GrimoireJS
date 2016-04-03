import Vector3 from "./Vector3";
/**
 * Axis-Aligned Bounding Box implementation
 */
class AABB {
  /**
   * AABB's vertex in most left,most bottom,most far.
   * @type {Vector3}
   */
  public pointLBF: Vector3;

  /**
  * AABB's vertex in most right,most top,most near.
  * @type {Vector3}
  */
  public pointRTN: Vector3;

  /**
   * Width of this AABB
   */
  public get Width() {
    return Math.abs(this.pointLBF.X - this.pointRTN.X);
  }

  /**
   * Height of this AABB
   */
  public get Height() {
    return Math.abs(this.pointLBF.Y - this.pointRTN.Y);
  }

  /**
   * Distance of this AABB
   */
  public get Distance() {
    return Math.abs(this.pointLBF.Z - this.pointRTN.Z);
  }


  /**
   * Calculate new bounding box with considering the new point is included.
   * @param  {Vector3} newPoint the point that will be considered that it should be in this bounding box.
   */
  public expandAABB(newPoint: Vector3): void {
    if (this.pointLBF == null) {
      // assume this is first time to be used this AABB instance
      this.pointLBF = Vector3.copy(newPoint);
      this.pointRTN = Vector3.copy(newPoint);
    }

    this.pointLBF = Vector3.min(newPoint, this.pointLBF);
    this.pointRTN = Vector3.max(newPoint, this.pointRTN);
  }

  /**
   * Clean up this AABB with initial value.
   */
  public clear(): void {
    this.pointLBF = null;
    this.pointRTN = null;
  }

  public toMathematicaCuboid(): string {
    return `Cuboid[${this.pointLBF.toMathematicaString() },${this.pointRTN.toMathematicaString() }]`;
  }
}

export default AABB;
