import Vector3 from "./Vector3";
/**
 * Axis-Aligned Bounding Box implementation
 */
class AABB {
    /**
     * Width of this AABB
     */
    get Width() {
        return Math.abs(this.pointLBF.X - this.pointRTN.X);
    }
    /**
     * Height of this AABB
     */
    get Height() {
        return Math.abs(this.pointLBF.Y - this.pointRTN.Y);
    }
    /**
     * Distance of this AABB
     */
    get Distance() {
        return Math.abs(this.pointLBF.Z - this.pointRTN.Z);
    }
    /**
     * Calculate new bounding box with considering the new point is included.
     * @param  {Vector3} newPoint the point that will be considered that it should be in this bounding box.
     */
    expandAABB(newPoint) {
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
    clear() {
        this.pointLBF = null;
        this.pointRTN = null;
    }
    toMathematicaCuboid() {
        return `Cuboid[${this.pointLBF.toMathematicaString()},${this.pointRTN.toMathematicaString()}]`;
    }
}
export default AABB;
