import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import BufferWrapper from "./BufferWrapper";
/**
 * Provides buffer resource without considering context.
 */
class Buffer extends ContextSafeResourceContainer {
    constructor(target, usage, unitCount, elementType) {
        super();
        /**
         * This elements are normalized or not.
         * It must be false in WebGL1.0.
         */
        this._normalized = false;
        this._stride = 0;
        this._offset = 0;
        /**
      * Length of this buffer.
      */
        this._length = 0;
        this._target = target;
        this._usage = usage;
        this._unitCount = unitCount;
        this._elementType = elementType;
        this.__initializeForFirst();
    }
    /**
    * Buffer target.
    * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
    */
    get Target() {
        return this._target;
    }
    /**
    * Buffer usage.
    * StaticDraw,DynamicDraw,StreamDraw
    */
    get Usage() {
        return this._usage;
    }
    get ElementType() {
        return this._elementType;
    }
    /**
    * This elements are normalized or not.
    * It must be false in WebGL1.0.
    */
    get Normalized() {
        return this._normalized;
    }
    /**
    * This elements are normalized or not.
    * It must be false in WebGL1.0.
    */
    set Normalized(normalized) {
        this._normalized = normalized;
    }
    get Stride() {
        return this._stride;
    }
    set Stride(stride) {
        this._stride = stride;
    }
    get Offset() {
        return this._offset;
    }
    set Offset(offset) {
        this._offset = offset;
    }
    /**
  * Element count per 1 vertex.
  * This accessor is readonly.
  */
    get UnitCount() {
        return this._unitCount;
    }
    get ElementCache() {
        return this._elementCache;
    }
    /**
     * Length of this buffer.
     */
    get Length() {
        return this._length;
    }
    update(array, length) {
        this._elementCache = array;
        this._length = length;
        this.each((a) => a.update(array, length));
    }
    __createWrapperForCanvas(canvas) {
        return new BufferWrapper(this, canvas);
    }
}
export default Buffer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVzb3VyY2VzL0J1ZmZlci9CdWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQ08sNEJBQTRCLE1BQU0saUNBQWlDO09BQ25FLGFBQWEsTUFBTSxpQkFBaUI7QUFDM0M7O0dBRUc7QUFDSCxxQkFBcUIsNEJBQTRCO0lBRS9DLFlBQVksTUFBYyxFQUFFLEtBQWEsRUFBRSxTQUFpQixFQUFFLFdBQW1CO1FBQy9FLE9BQU8sQ0FBQztRQXVDVjs7O1dBR0c7UUFDSyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQWtCN0IsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUVwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBc0M1Qjs7UUFFQTtRQUNRLFlBQU8sR0FBVyxDQUFDLENBQUM7UUF2RzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBRTlCLENBQUM7SUFNRDs7O01BR0U7SUFDRixJQUFXLE1BQU07UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBTUQ7OztNQUdFO0lBQ0YsSUFBVyxLQUFLO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUlELElBQVcsV0FBVztRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBUUQ7OztNQUdFO0lBQ0YsSUFBVyxVQUFVO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O01BR0U7SUFDRixJQUFXLFVBQVUsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBTUQsSUFBVyxNQUFNO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQVcsTUFBTSxDQUFDLE1BQWM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFXLE1BQU0sQ0FBQyxNQUFjO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFNRDs7O0lBR0E7SUFDQSxJQUFXLFNBQVM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQU9ELElBQVcsWUFBWTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBS0Q7O09BRUc7SUFDSCxJQUFXLE1BQU07UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQWtDLEVBQUUsTUFBYztRQUM5RCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVTLHdCQUF3QixDQUFDLE1BQWM7UUFDL0MsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0FBQ0gsQ0FBQztBQUdELGVBQWUsTUFBTSxDQUFDIiwiZmlsZSI6IkNvcmUvUmVzb3VyY2VzL0J1ZmZlci9CdWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FudmFzIGZyb20gXCIuLi8uLi9DYW52YXMvQ2FudmFzXCI7XG5pbXBvcnQgQ29udGV4dFNhZmVSZXNvdXJjZUNvbnRhaW5lciBmcm9tIFwiLi4vQ29udGV4dFNhZmVSZXNvdXJjZUNvbnRhaW5lclwiO1xuaW1wb3J0IEJ1ZmZlcldyYXBwZXIgZnJvbSBcIi4vQnVmZmVyV3JhcHBlclwiO1xuLyoqXG4gKiBQcm92aWRlcyBidWZmZXIgcmVzb3VyY2Ugd2l0aG91dCBjb25zaWRlcmluZyBjb250ZXh0LlxuICovXG5jbGFzcyBCdWZmZXIgZXh0ZW5kcyBDb250ZXh0U2FmZVJlc291cmNlQ29udGFpbmVyPEJ1ZmZlcldyYXBwZXI+IHtcblxuICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IG51bWJlciwgdXNhZ2U6IG51bWJlciwgdW5pdENvdW50OiBudW1iZXIsIGVsZW1lbnRUeXBlOiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLl91c2FnZSA9IHVzYWdlO1xuICAgIHRoaXMuX3VuaXRDb3VudCA9IHVuaXRDb3VudDtcbiAgICB0aGlzLl9lbGVtZW50VHlwZSA9IGVsZW1lbnRUeXBlO1xuICAgIHRoaXMuX19pbml0aWFsaXplRm9yRmlyc3QoKTtcblxuICB9XG4gIC8qKlxuICAgKiBCdWZmZXIgdGFyZ2V0LlxuICAgKiBBcnJheUJ1ZmZlciA9PiBWZXJ0ZXhCdWZmZXIsIEFycmF5RWxlbWVudEJ1ZmZlciA9PiBJbmRleEJ1ZmZlclxuICAgKi9cbiAgcHJpdmF0ZSBfdGFyZ2V0OiBudW1iZXI7XG4gIC8qKlxuICAqIEJ1ZmZlciB0YXJnZXQuXG4gICogQXJyYXlCdWZmZXIgPT4gVmVydGV4QnVmZmVyLCBBcnJheUVsZW1lbnRCdWZmZXIgPT4gSW5kZXhCdWZmZXJcbiAgKi9cbiAgcHVibGljIGdldCBUYXJnZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xuICB9XG4gIC8qKlxuICAgKiBCdWZmZXIgdXNhZ2UuXG4gICAqIFN0YXRpY0RyYXcsRHluYW1pY0RyYXcsU3RyZWFtRHJhd1xuICAgKi9cbiAgcHJpdmF0ZSBfdXNhZ2U6IG51bWJlcjtcbiAgLyoqXG4gICogQnVmZmVyIHVzYWdlLlxuICAqIFN0YXRpY0RyYXcsRHluYW1pY0RyYXcsU3RyZWFtRHJhd1xuICAqL1xuICBwdWJsaWMgZ2V0IFVzYWdlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3VzYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZWxlbWVudFR5cGU6IG51bWJlcjtcblxuICBwdWJsaWMgZ2V0IEVsZW1lbnRUeXBlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRUeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZWxlbWVudHMgYXJlIG5vcm1hbGl6ZWQgb3Igbm90LlxuICAgKiBJdCBtdXN0IGJlIGZhbHNlIGluIFdlYkdMMS4wLlxuICAgKi9cbiAgcHJpdmF0ZSBfbm9ybWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAqIFRoaXMgZWxlbWVudHMgYXJlIG5vcm1hbGl6ZWQgb3Igbm90LlxuICAqIEl0IG11c3QgYmUgZmFsc2UgaW4gV2ViR0wxLjAuXG4gICovXG4gIHB1YmxpYyBnZXQgTm9ybWFsaXplZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbm9ybWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAqIFRoaXMgZWxlbWVudHMgYXJlIG5vcm1hbGl6ZWQgb3Igbm90LlxuICAqIEl0IG11c3QgYmUgZmFsc2UgaW4gV2ViR0wxLjAuXG4gICovXG4gIHB1YmxpYyBzZXQgTm9ybWFsaXplZChub3JtYWxpemVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbm9ybWFsaXplZCA9IG5vcm1hbGl6ZWQ7XG4gIH1cblxuICBwcml2YXRlIF9zdHJpZGU6IG51bWJlciA9IDA7XG5cbiAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyBnZXQgU3RyaWRlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmlkZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgU3RyaWRlKHN0cmlkZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RyaWRlID0gc3RyaWRlO1xuICB9XG5cbiAgcHVibGljIGdldCBPZmZzZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgcHVibGljIHNldCBPZmZzZXQob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogRWxlbWVudCBjb3VudCBwZXIgMSB2ZXJ0ZXguXG4gICAqL1xuICBwcml2YXRlIF91bml0Q291bnQ6IG51bWJlcjtcbiAgLyoqXG4qIEVsZW1lbnQgY291bnQgcGVyIDEgdmVydGV4LlxuKiBUaGlzIGFjY2Vzc29yIGlzIHJlYWRvbmx5LlxuKi9cbiAgcHVibGljIGdldCBVbml0Q291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdW5pdENvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlZCBzb3VyY2UgZm9yIGJ1ZmZlci5cbiAgICovXG4gIHByaXZhdGUgX2VsZW1lbnRDYWNoZTogQXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3O1xuXG4gIHB1YmxpYyBnZXQgRWxlbWVudENhY2hlKCk6IEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRDYWNoZTtcbiAgfVxuICAvKipcbiogTGVuZ3RoIG9mIHRoaXMgYnVmZmVyLlxuKi9cbiAgcHJpdmF0ZSBfbGVuZ3RoOiBudW1iZXIgPSAwO1xuICAvKipcbiAgICogTGVuZ3RoIG9mIHRoaXMgYnVmZmVyLlxuICAgKi9cbiAgcHVibGljIGdldCBMZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZShhcnJheTogQXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3LCBsZW5ndGg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRDYWNoZSA9IGFycmF5O1xuICAgIHRoaXMuX2xlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmVhY2goKGEpID0+IGEudXBkYXRlKGFycmF5LCBsZW5ndGgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX2NyZWF0ZVdyYXBwZXJGb3JDYW52YXMoY2FudmFzOiBDYW52YXMpOiBCdWZmZXJXcmFwcGVyIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcldyYXBwZXIodGhpcywgY2FudmFzKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJ1ZmZlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
