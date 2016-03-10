import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class ConeGeometry extends BasicGeometry {
    constructor(name) {
        super();
        this._divideCount = 10;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }
    get DivideCount() {
        return this._divideCount;
    }
    set DivideCount(count) {
        this._divideCount = count;
        this.__updateBuffers();
    }
    __updateBuffers() {
        const pos = [];
        const normal = [];
        const uv = [];
        const index = [];
        GeometryBuilder.addCone(pos, normal, uv, index, 100);
        this.indexBuffer.update(new Uint16Array(index), index.length);
        this.normalBuffer.update(new Float32Array(normal), normal.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
    }
}
export default ConeGeometry;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvR2VvbWV0cmllcy9Db25lR2VvbWV0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sZUFBZSxNQUFNLHdCQUF3QjtPQUM3QyxhQUFhLE1BQU0sc0JBQXNCO09BQ3pDLGFBQWEsTUFBTSxxQkFBcUI7T0FDeEMsaUJBQWlCLE1BQU0seUJBQXlCO0FBRXZELDJCQUEyQixhQUFhO0lBYXBDLFlBQVksSUFBWTtRQUNwQixPQUFPLENBQUM7UUFaSixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQWE5QixNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWtCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pHLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFLHFCQUFxQixDQUFDLG9CQUFvQixFQUFFLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUscUJBQXFCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0ssSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxNQUFNLEVBQUUscUJBQXFCLENBQUMsWUFBWSxFQUFFLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUosSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxNQUFNLEVBQUUscUJBQXFCLENBQUMsWUFBWSxFQUFFLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUosSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxLQUFLLEVBQUUscUJBQXFCLENBQUMsWUFBWSxFQUFFLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckosSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFqQkQsSUFBVyxXQUFXO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFXLFdBQVcsQ0FBQyxLQUFhO1FBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBYVMsZUFBZTtRQUNyQixNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7UUFDekIsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLE1BQU0sRUFBRSxHQUFhLEVBQUUsQ0FBQztRQUN4QixNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDM0IsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7QUFDTCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiQ29yZS9HZW9tZXRyaWVzL0NvbmVHZW9tZXRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHZW9tZXRyeUJ1aWxkZXIgZnJvbSBcIi4vQmFzZS9HZW9tZXRyeUJ1aWxkZXJcIjtcbmltcG9ydCBCYXNpY0dlb21ldHJ5IGZyb20gXCIuL0Jhc2UvQmFzaWNHZW9tZXRyeVwiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uLy4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBSZXNvdXJjZU1hbmFnZXIgZnJvbSBcIi4uL1Jlc291cmNlTWFuYWdlclwiO1xuY2xhc3MgQ29uZUdlb21ldHJ5IGV4dGVuZHMgQmFzaWNHZW9tZXRyeSB7XG5cbiAgICBwcml2YXRlIF9kaXZpZGVDb3VudDogbnVtYmVyID0gMTA7XG5cbiAgICBwdWJsaWMgZ2V0IERpdmlkZUNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGl2aWRlQ291bnQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBEaXZpZGVDb3VudChjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2RpdmlkZUNvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMuX191cGRhdGVCdWZmZXJzKCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IHJtID0gSlRocmVlQ29udGV4dC5nZXRDb250ZXh0Q29tcG9uZW50PFJlc291cmNlTWFuYWdlcj4oQ29udGV4dENvbXBvbmVudHMuUmVzb3VyY2VNYW5hZ2VyKTtcbiAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IHJtLmNyZWF0ZUJ1ZmZlcihuYW1lICsgXCJpbmRleFwiLCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5TVEFUSUNfRFJBVywgMSwgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlVOU0lHTkVEX1NIT1JUKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlciA9IHJtLmNyZWF0ZUJ1ZmZlcihuYW1lICsgXCItcG9zXCIsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5BUlJBWV9CVUZGRVIsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5TVEFUSUNfRFJBVywgMywgV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZMT0FUKTtcbiAgICAgICAgdGhpcy5ub3JtYWxCdWZmZXIgPSBybS5jcmVhdGVCdWZmZXIobmFtZSArIFwiLW5vclwiLCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQVJSQVlfQlVGRkVSLCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuU1RBVElDX0RSQVcsIDMsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5GTE9BVCk7XG4gICAgICAgIHRoaXMudXZCdWZmZXIgPSBybS5jcmVhdGVCdWZmZXIobmFtZSArIFwiLXV2XCIsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5BUlJBWV9CVUZGRVIsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5TVEFUSUNfRFJBVywgMiwgV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZMT0FUKTtcbiAgICAgICAgdGhpcy5fX3VwZGF0ZUJ1ZmZlcnMoKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBfX3VwZGF0ZUJ1ZmZlcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBvczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9ybWFsOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCB1djogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlcltdID0gW107XG4gICAgICAgIEdlb21ldHJ5QnVpbGRlci5hZGRDb25lKHBvcywgbm9ybWFsLCB1diwgaW5kZXgsIDEwMCk7XG4gICAgICAgIHRoaXMuaW5kZXhCdWZmZXIudXBkYXRlKG5ldyBVaW50MTZBcnJheShpbmRleCksIGluZGV4Lmxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9ybWFsQnVmZmVyLnVwZGF0ZShuZXcgRmxvYXQzMkFycmF5KG5vcm1hbCksIG5vcm1hbC5sZW5ndGgpO1xuICAgICAgICB0aGlzLnV2QnVmZmVyLnVwZGF0ZShuZXcgRmxvYXQzMkFycmF5KHV2KSwgdXYubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlci51cGRhdGUobmV3IEZsb2F0MzJBcnJheShwb3MpLCBwb3MubGVuZ3RoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmVHZW9tZXRyeTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==