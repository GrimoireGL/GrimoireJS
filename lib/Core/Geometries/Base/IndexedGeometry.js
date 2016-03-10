import Geometry from "./Geometry";
/**
 * The abstract class for the geometries having index buffer(ELEMENT_ARRAY_BUFFER) for drawing.
 *
 * 描画にインデックスバッファ(ELEMENT_ARRAY_BUFFER)を用いるジオメトリの抽象クラス
 */
class IndexedGeometry extends Geometry {
    /**
     * The count of verticies.(3 times count of surfaces(When the topology was "triangles"))
     *
     * 頂点数(面数の3倍となる(topologyがtrianglesの時))
     * @return {number} The count of verticies
     */
    getDrawLength() {
        return this.indexBuffer.Length;
    }
    /**
     * Draw this geometry for specified material.
     *
     * 渡されたマテリアル用にジオメトリを描画します。
     * @param {Canvas}   canvas   the canvas should be rendererd with this method.
     * @param {Material} material the material should be used for rendering this geometry.
     */
    drawElements(canvas, material) {
        this.__bindIndexBuffer(canvas);
        canvas.gl.drawElements(this.primitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
    }
    /**
     * Draw this geometry as wireframe for specified material.
     * @param {Canvas}   canvas   [description]
     * @param {Material} material [description]
     */
    drawWireframe(canvas, material) {
        this.__bindIndexBuffer(canvas);
        const offset = material.getDrawGeometryOffset(this);
        const length = material.getDrawGeometryLength(this);
        let index = offset;
        switch (this.primitiveTopology) {
            case WebGLRenderingContext.TRIANGLES:
                if (length % 3 !== 0) {
                    throw new Error("length is invalid!");
                }
                while (offset + length > index) {
                    canvas.gl.drawElements(WebGLRenderingContext.POINTS, 3, this.indexBuffer.ElementType, index);
                    index += 3;
                }
                break;
            default:
                throw new Error("Unsupported topology!");
        }
    }
    /**
     * Bind the index buffer for specified Canvas
     *
     * 渡されたCanvas用にインデックスバッファをバインドします。
     * @param  {Canvas} canvas the canvas this index buffer should be bound to
     */
    __bindIndexBuffer(canvas) {
        this.indexBuffer.getForContext(canvas).bindBuffer();
    }
}
export default IndexedGeometry;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvR2VvbWV0cmllcy9CYXNlL0luZGV4ZWRHZW9tZXRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FFTyxRQUFRLE1BQU0sWUFBWTtBQUVqQzs7OztHQUlHO0FBQ0gsOEJBQXVDLFFBQVE7SUFTN0M7Ozs7O09BS0c7SUFDSSxhQUFhO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksWUFBWSxDQUFDLE1BQWMsRUFBRSxRQUFrQjtRQUNwRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxNQUFjLEVBQUUsUUFBa0I7UUFDckQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxxQkFBcUIsQ0FBQyxTQUFTO2dCQUNsQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFDRCxPQUFPLE1BQU0sR0FBRyxNQUFNLEdBQUcsS0FBSyxFQUFFLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzdGLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGlCQUFpQixDQUFDLE1BQWM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEQsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGVBQWUsQ0FBQyIsImZpbGUiOiJDb3JlL0dlb21ldHJpZXMvQmFzZS9JbmRleGVkR2VvbWV0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FudmFzIGZyb20gXCIuLi8uLi9DYW52YXMvQ2FudmFzXCI7XG5pbXBvcnQgTWF0ZXJpYWwgZnJvbSBcIi4uLy4uL01hdGVyaWFscy9NYXRlcmlhbFwiO1xuaW1wb3J0IEdlb21ldHJ5IGZyb20gXCIuL0dlb21ldHJ5XCI7XG5pbXBvcnQgQnVmZmVyIGZyb20gXCIuLi8uLi9SZXNvdXJjZXMvQnVmZmVyL0J1ZmZlclwiO1xuLyoqXG4gKiBUaGUgYWJzdHJhY3QgY2xhc3MgZm9yIHRoZSBnZW9tZXRyaWVzIGhhdmluZyBpbmRleCBidWZmZXIoRUxFTUVOVF9BUlJBWV9CVUZGRVIpIGZvciBkcmF3aW5nLlxuICpcbiAqIOaPj+eUu+OBq+OCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoShFTEVNRU5UX0FSUkFZX0JVRkZFUinjgpLnlKjjgYTjgovjgrjjgqrjg6Hjg4jjg6rjga7mir3osaHjgq/jg6njgrlcbiAqL1xuYWJzdHJhY3QgY2xhc3MgSW5kZXhlZEdlb21ldHJ5IGV4dGVuZHMgR2VvbWV0cnkge1xuICAvKipcbiAgICogSW5kZXggYnVmZmVyIHVzZWQgZm9yIHJlbmRlcmluZyB0aGlzIEdlb21ldHJ5XG4gICAqXG4gICAqIOOBk+OBruOCuOOCquODoeODiOODquOBruaPj+eUu+OBq+WIqeeUqOOBleOCjOOCi+OCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoVxuICAgKiBAdHlwZSB7QnVmZmVyfVxuICAgKi9cbiAgcHVibGljIGluZGV4QnVmZmVyOiBCdWZmZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBjb3VudCBvZiB2ZXJ0aWNpZXMuKDMgdGltZXMgY291bnQgb2Ygc3VyZmFjZXMoV2hlbiB0aGUgdG9wb2xvZ3kgd2FzIFwidHJpYW5nbGVzXCIpKVxuICAgKlxuICAgKiDpoILngrnmlbAo6Z2i5pWw44GuM+WAjeOBqOOBquOCiyh0b3BvbG9neeOBjHRyaWFuZ2xlc+OBruaZgikpXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGNvdW50IG9mIHZlcnRpY2llc1xuICAgKi9cbiAgcHVibGljIGdldERyYXdMZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleEJ1ZmZlci5MZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyB0aGlzIGdlb21ldHJ5IGZvciBzcGVjaWZpZWQgbWF0ZXJpYWwuXG4gICAqXG4gICAqIOa4oeOBleOCjOOBn+ODnuODhuODquOCouODq+eUqOOBq+OCuOOCquODoeODiOODquOCkuaPj+eUu+OBl+OBvuOBmeOAglxuICAgKiBAcGFyYW0ge0NhbnZhc30gICBjYW52YXMgICB0aGUgY2FudmFzIHNob3VsZCBiZSByZW5kZXJlcmQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIHtNYXRlcmlhbH0gbWF0ZXJpYWwgdGhlIG1hdGVyaWFsIHNob3VsZCBiZSB1c2VkIGZvciByZW5kZXJpbmcgdGhpcyBnZW9tZXRyeS5cbiAgICovXG4gIHB1YmxpYyBkcmF3RWxlbWVudHMoY2FudmFzOiBDYW52YXMsIG1hdGVyaWFsOiBNYXRlcmlhbCk6IHZvaWQge1xuICAgIHRoaXMuX19iaW5kSW5kZXhCdWZmZXIoY2FudmFzKTtcbiAgICBjYW52YXMuZ2wuZHJhd0VsZW1lbnRzKHRoaXMucHJpbWl0aXZlVG9wb2xvZ3ksIG1hdGVyaWFsLmdldERyYXdHZW9tZXRyeUxlbmd0aCh0aGlzKSwgdGhpcy5pbmRleEJ1ZmZlci5FbGVtZW50VHlwZSwgbWF0ZXJpYWwuZ2V0RHJhd0dlb21ldHJ5T2Zmc2V0KHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IHRoaXMgZ2VvbWV0cnkgYXMgd2lyZWZyYW1lIGZvciBzcGVjaWZpZWQgbWF0ZXJpYWwuXG4gICAqIEBwYXJhbSB7Q2FudmFzfSAgIGNhbnZhcyAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtNYXRlcmlhbH0gbWF0ZXJpYWwgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHVibGljIGRyYXdXaXJlZnJhbWUoY2FudmFzOiBDYW52YXMsIG1hdGVyaWFsOiBNYXRlcmlhbCk6IHZvaWQge1xuICAgIHRoaXMuX19iaW5kSW5kZXhCdWZmZXIoY2FudmFzKTtcbiAgICBjb25zdCBvZmZzZXQgPSBtYXRlcmlhbC5nZXREcmF3R2VvbWV0cnlPZmZzZXQodGhpcyk7XG4gICAgY29uc3QgbGVuZ3RoID0gbWF0ZXJpYWwuZ2V0RHJhd0dlb21ldHJ5TGVuZ3RoKHRoaXMpO1xuICAgIGxldCBpbmRleCA9IG9mZnNldDtcbiAgICBzd2l0Y2ggKHRoaXMucHJpbWl0aXZlVG9wb2xvZ3kpIHtcbiAgICAgIGNhc2UgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlRSSUFOR0xFUzpcbiAgICAgICAgaWYgKGxlbmd0aCAlIDMgIT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggaXMgaW52YWxpZCFcIik7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKG9mZnNldCArIGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgY2FudmFzLmdsLmRyYXdFbGVtZW50cyhXZWJHTFJlbmRlcmluZ0NvbnRleHQuUE9JTlRTLCAzLCB0aGlzLmluZGV4QnVmZmVyLkVsZW1lbnRUeXBlLCBpbmRleCk7XG4gICAgICAgICAgaW5kZXggKz0gMztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHRvcG9sb2d5IVwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQmluZCB0aGUgaW5kZXggYnVmZmVyIGZvciBzcGVjaWZpZWQgQ2FudmFzXG4gICAqXG4gICAqIOa4oeOBleOCjOOBn0NhbnZhc+eUqOOBq+OCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOCkuODkOOCpOODs+ODieOBl+OBvuOBmeOAglxuICAgKiBAcGFyYW0gIHtDYW52YXN9IGNhbnZhcyB0aGUgY2FudmFzIHRoaXMgaW5kZXggYnVmZmVyIHNob3VsZCBiZSBib3VuZCB0b1xuICAgKi9cbiAgcHJvdGVjdGVkIF9fYmluZEluZGV4QnVmZmVyKGNhbnZhczogQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleEJ1ZmZlci5nZXRGb3JDb250ZXh0KGNhbnZhcykuYmluZEJ1ZmZlcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4ZWRHZW9tZXRyeTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
